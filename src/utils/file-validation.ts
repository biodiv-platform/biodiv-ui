/**
 * General purpose, dependency-free client-side file validation.
 *
 * For every file it runs (in order):
 *  1. File name checks    – control chars, path separators, bidi tricks (`gpj.exe`), double
 *                           extensions (`shell.php.jpg`)
 *  2. Extension allow-list
 *  3. Declared MIME check – `file.type` must be consistent with the extension
 *  4. Magic-byte sniffing – the real content must match the extension (`evil.html` renamed to
 *                           `evil.jpg` is rejected)
 *  5. Content inspection  – per type: embedded scripts / PHP / executables, PDF active content,
 *                           zip-slip / zip-bombs / encrypted / nested archives, office macros,
 *                           XML entity (XXE) payloads, CSV formula injection
 *
 * This module never reads a whole large file into memory.
 */

const KB = 1024;
const MB = KB * KB;

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type FileValidationCode =
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_NAME"
  | "DANGEROUS_EXTENSION"
  | "UNSUPPORTED_TYPE"
  | "MIME_MISMATCH"
  | "SIGNATURE_MISMATCH"
  | "MALICIOUS_CONTENT"
  | "SCAN_FAILED";

export interface FileValidationResult {
  valid: boolean;
  code?: FileValidationCode;
  /** Human readable (English) reason, safe to show in a toast */
  message?: string;
  /** Lower-cased extension without the dot */
  extension?: string;
  /** MIME type we determined from the content (not from the browser) */
  detectedMime?: string;
}

export interface ValidateFileOptions {
  /** Extensions (without dot, case-insensitive) that are acceptable for this upload */
  allowedExtensions: readonly string[];
  /** Overrides `file.name` (needed for plain Blobs, which have no name) */
  fileName?: string;
  /** Maximum size in bytes */
  maxSize?: number;
  /** Files up to this size are scanned completely, larger ones only head+tail. Default 50MB */
  fullScanLimit?: number;
  /**
   * If set, every file inside an uploaded ZIP must have one of these extensions.
   * If not set, ZIPs are only checked for dangerous / nested-archive entries.
   */
  zipEntryExtensions?: readonly string[];
  /** Zip-bomb guard: max total uncompressed size (default 20GB) */
  zipMaxUncompressedSize?: number;
  /** Zip-bomb guard: max number of entries (default 20 000) */
  zipMaxEntries?: number;
  /** Reject CSV/TXT cells that would execute as spreadsheet formulas (default true) */
  blockCsvFormulas?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               Small byte helpers                           */
/* -------------------------------------------------------------------------- */

const readBytes = async (blob: Blob, start: number, end: number): Promise<Uint8Array> =>
  new Uint8Array(await blob.slice(start, Math.min(end, blob.size)).arrayBuffer());

const startsWith = (b: Uint8Array, sig: readonly number[], offset = 0) =>
  b.length >= offset + sig.length && sig.every((v, i) => b[offset + i] === v);

const ascii = (b: Uint8Array, start: number, end: number) =>
  String.fromCharCode(...Array.from(b.subarray(start, end)));

const u16 = (dv: DataView, o: number) => dv.getUint16(o, true);
const u32 = (dv: DataView, o: number) => dv.getUint32(o, true);
const u64 = (dv: DataView, o: number) => Number(dv.getBigUint64(o, true));

interface Pattern {
  name: string;
  re: RegExp;
}

/**
 * Decodes `blob` in windows and tests `patterns` against each. Small files are scanned
 * completely (chunked, with overlap so a pattern can't hide on a chunk boundary); large files
 * only head + tail to stay fast.
 */
const scanBlob = async (
  blob: Blob,
  patterns: readonly Pattern[],
  fullScanLimit: number,
  encoding = "latin1"
): Promise<string | null> => {
  const CHUNK = 4 * MB;
  const OVERLAP = 512;
  const decoder = new TextDecoder(encoding);

  const test = (text: string) => patterns.find((p) => p.re.test(text))?.name ?? null;

  if (blob.size <= fullScanLimit) {
    for (let pos = 0; pos < blob.size; pos += CHUNK) {
      const start = Math.max(0, pos - OVERLAP);
      const hit = test(decoder.decode(await readBytes(blob, start, pos + CHUNK)));
      if (hit) return hit;
    }
    return null;
  }

  const tailStart = (blob.size - CHUNK) & ~1;
  return (
    test(decoder.decode(await readBytes(blob, 0, CHUNK))) ??
    test(decoder.decode(await readBytes(blob, tailStart, blob.size)))
  );
};

/* -------------------------------------------------------------------------- */
/*                               Threat signatures                            */
/* -------------------------------------------------------------------------- */

/** Active web content that has no business inside an image / pdf / csv / archive */
const WEB_THREATS: Pattern[] = [
  { name: "an embedded <script> tag", re: /<\s*script\b/i },
  { name: "embedded PHP code", re: /<\?php/i },
  {
    name: "an embedded <iframe>/<object>/<embed> tag",
    re: /<\s*(?:iframe|object|embed|applet)\b/i
  },
  { name: "a javascript: URI", re: /javascript\s*:/i },
  { name: "a vbscript: URI", re: /vbscript\s*:/i },
  { name: "a data:text/html URI", re: /data\s*:\s*text\/html/i },
  { name: "an inline event handler", re: /\bon(?:error|load|click|mouseover|focus)\s*=\s*["']/i }
];

/** Native executables hidden inside a "harmless" file */
const NATIVE_THREATS: Pattern[] = [
  { name: "a Windows executable stub", re: /This program (?:cannot|must) be run/ },
  { name: "an ELF executable", re: /\x7FELF[\x01\x02][\x01\x02]\x01/ }
];

/** Extra server-side-template / shell markers for plain-text types (csv, prj, bib …) */
const TEXT_ONLY_THREATS: Pattern[] = [
  { name: "an ASP/JSP-style server tag", re: /<%[@=!]/ },
  { name: "a shell script header", re: /^\s*#!\s*\/(?:usr|bin|opt|env)/ }
];

/** Malicious PDF features (names de-obfuscated of #xx escapes before matching) */
const PDF_THREATS: Pattern[] = [
  { name: "embedded JavaScript", re: /\/JavaScript\b/ },
  { name: "embedded JavaScript", re: /\/JS\s*[(<]/ },
  { name: "a /Launch action", re: /\/Launch\b/ },
  { name: "an embedded file", re: /\/EmbeddedFile\b/ },
  { name: "rich media (Flash/3D) content", re: /\/RichMedia\b/ },
  { name: "a remote-goto action", re: /\/GoToE\b/ },
  // Catches JS smuggled outside the spec's own JS mechanisms (e.g. a PDF.js FontMatrix
  // parser-exploit payload hidden inside a string literal/array rather than a /JS action).
  {
    name: "JavaScript-like code embedded in the document",
    re: /\b(?:window|document)\s*\.|\beval\s*\(|\bFunction\s*\(|\balert\s*\(/
  }
];

/** XML (SLD, PRJ-XML …): XXE / entity-expansion payloads */
const XML_THREATS: Pattern[] = [
  { name: "an XML external entity declaration", re: /<!ENTITY/i },
  { name: "an XML external DTD reference", re: /<!DOCTYPE[^>]*\b(?:SYSTEM|PUBLIC)\b/i }
];

/** CSV / spreadsheet formula (DDE) injection */
const CSV_FORMULA_THREATS: Pattern[] = [
  {
    name: "a spreadsheet formula (CSV injection)",
    re: /(?:^|[\r\n,;\t])\s*"?[=@+\-][A-Za-z_][A-Za-z0-9_.]*[|(]/
  },
  { name: "a DDE command (CSV injection)", re: /(?:^|[\r\n,;\t])\s*"?=[^,;\t\r\n]{0,200}\|/ }
];

/** Legacy OLE2 Office files with a VBA project (macros), UTF-16LE strings */
const OLE_MACRO_THREATS: Pattern[] = [
  {
    name: "an Office macro (VBA project)",
    re: /_\x00V\x00B\x00A\x00_\x00P\x00R\x00O\x00J\x00E\x00C\x00T/
  }
];

/** Extensions that may never appear as an *inner* extension (`shell.php.jpg`) or inside a zip */
const DANGEROUS_EXTENSIONS = new Set([
  "exe",
  "dll",
  "bat",
  "cmd",
  "scr",
  "msi",
  "ps1",
  "psm1",
  "vbs",
  "vbe",
  "js",
  "jse",
  "mjs",
  "wsf",
  "wsh",
  "hta",
  "jar",
  "sh",
  "bash",
  "php",
  "php3",
  "php4",
  "php5",
  "php7",
  "phtml",
  "phar",
  "asp",
  "aspx",
  "jsp",
  "jspx",
  "cgi",
  "py",
  "rb",
  "html",
  "htm",
  "xhtml",
  "svg",
  "swf",
  "lnk",
  "reg",
  "dmg",
  "apk",
  "iso",
  "so",
  "dylib",
  "class"
]);

const ARCHIVE_EXTENSIONS = new Set(["zip", "rar", "7z", "gz", "tgz", "tar", "bz2", "xz", "cab"]);

/** OS junk that legitimately shows up in zips created on macOS / Windows */
const ZIP_IGNORED = /(?:^|\/)(?:__MACOSX\/|\.DS_Store$|Thumbs\.db$|desktop\.ini$)/i;

/** Returns a description if the first bytes look like a native executable / script */
const detectExecutableHeader = (h: Uint8Array): string | null => {
  if (startsWith(h, [0x4d, 0x5a])) {
    // "MZ" alone is too weak (a CSV can start with "MZ,"); require a DOS stub or PE header
    const dosStub = ascii(h, 0, Math.min(h.length, 256)).includes("This program");
    let pe = false;
    if (h.length >= 0x40) {
      const off = new DataView(h.buffer, h.byteOffset, h.byteLength).getUint32(0x3c, true);
      pe = startsWith(h, [0x50, 0x45, 0x00, 0x00], off);
    }
    if (dosStub || pe) return "a Windows executable";
  }
  if (startsWith(h, [0x7f, 0x45, 0x4c, 0x46])) return "a Linux executable (ELF)";
  if (
    startsWith(h, [0xcf, 0xfa, 0xed, 0xfe]) ||
    startsWith(h, [0xce, 0xfa, 0xed, 0xfe]) ||
    startsWith(h, [0xfe, 0xed, 0xfa, 0xcf]) ||
    startsWith(h, [0xfe, 0xed, 0xfa, 0xce]) ||
    startsWith(h, [0xca, 0xfe, 0xba, 0xbe])
  ) {
    return "a macOS/Java executable";
  }
  if (startsWith(h, [0x23, 0x21, 0x2f]) || startsWith(h, [0x23, 0x21, 0x20, 0x2f])) {
    return "a shell script";
  }
  return null;
};

/* -------------------------------------------------------------------------- */
/*                                ZIP inspection                              */
/* -------------------------------------------------------------------------- */

interface ZipEntry {
  name: string;
  compressedSize: number;
  uncompressedSize: number;
  encrypted: boolean;
  isSymlink: boolean;
}

/** Parses the ZIP central directory (incl. ZIP64) by reading only the end of the file */
const readZipEntries = async (blob: Blob, maxEntries: number): Promise<ZipEntry[]> => {
  const tailLen = Math.min(blob.size, 0xffff + 22 + 20);
  const tail = await readBytes(blob, blob.size - tailLen, blob.size);
  const tdv = new DataView(tail.buffer, tail.byteOffset, tail.byteLength);

  let eocd = -1;
  for (let i = tail.length - 22; i >= 0; i--) {
    if (u32(tdv, i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("no end-of-central-directory record");

  let total = u16(tdv, eocd + 10);
  let cdSize = u32(tdv, eocd + 12);
  let cdOffset = u32(tdv, eocd + 16);

  if (total === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
    const loc = eocd - 20;
    if (loc < 0 || u32(tdv, loc) !== 0x07064b50) throw new Error("bad ZIP64 locator");
    const z64Offset = u64(tdv, loc + 8);
    const z64 = await readBytes(blob, z64Offset, z64Offset + 56);
    const zdv = new DataView(z64.buffer, z64.byteOffset, z64.byteLength);
    if (z64.length < 56 || u32(zdv, 0) !== 0x06064b50) throw new Error("bad ZIP64 record");
    total = u64(zdv, 32);
    cdSize = u64(zdv, 40);
    cdOffset = u64(zdv, 48);
  }

  if (total > maxEntries) throw new Error(`too many entries (${total})`);
  if (cdSize > 64 * MB || cdOffset + cdSize > blob.size) throw new Error("corrupt directory");

  const cd = await readBytes(blob, cdOffset, cdOffset + cdSize);
  const dv = new DataView(cd.buffer, cd.byteOffset, cd.byteLength);
  const entries: ZipEntry[] = [];
  let p = 0;

  while (p + 46 <= cd.length && u32(dv, p) === 0x02014b50) {
    const versionMadeBy = u16(dv, p + 4);
    const flags = u16(dv, p + 8);
    let compressedSize = u32(dv, p + 20);
    let uncompressedSize = u32(dv, p + 24);
    const nameLen = u16(dv, p + 28);
    const extraLen = u16(dv, p + 30);
    const commentLen = u16(dv, p + 32);
    const externalAttrs = u32(dv, p + 38);

    const nameBytes = cd.subarray(p + 46, p + 46 + nameLen);
    const name = new TextDecoder(flags & 0x800 ? "utf-8" : "latin1").decode(nameBytes);

    // ZIP64 extended info: values appear in order, only for fields that were 0xFFFFFFFF
    let x = p + 46 + nameLen;
    const xEnd = x + extraLen;
    while (x + 4 <= xEnd) {
      const id = u16(dv, x);
      const size = u16(dv, x + 2);
      if (id === 0x0001) {
        let o = x + 4;
        if (uncompressedSize === 0xffffffff && o + 8 <= xEnd) {
          uncompressedSize = u64(dv, o);
          o += 8;
        }
        if (compressedSize === 0xffffffff && o + 8 <= xEnd) {
          compressedSize = u64(dv, o);
        }
      }
      x += 4 + size;
    }

    const unixMode = externalAttrs >>> 16;
    entries.push({
      name,
      compressedSize,
      uncompressedSize,
      encrypted: (flags & 0x1) === 0x1,
      isSymlink: versionMadeBy >> 8 === 3 && (unixMode & 0xf000) === 0xa000
    });

    p += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
};

const extOf = (name: string) => {
  const base = name.split(/[\\/]/).pop() ?? "";
  const i = base.lastIndexOf(".");
  return i > 0 ? base.slice(i + 1).toLowerCase() : "";
};

const inspectZip = async (
  blob: Blob,
  opts: ValidateFileOptions,
  ooxml?: { requiredEntries: string[]; forbidden: RegExp }
): Promise<string | null> => {
  let entries: ZipEntry[];
  try {
    entries = await readZipEntries(blob, opts.zipMaxEntries ?? 20_000);
  } catch (e: any) {
    return `a corrupt or malformed archive (${e?.message ?? "unreadable"})`;
  }
  if (entries.length === 0) return "an empty archive";

  const maxUncompressed = opts.zipMaxUncompressedSize ?? 20 * 1024 * MB;
  let totalUncompressed = 0;

  for (const e of entries) {
    const name = e.name;
    const segments = name.split(/[\\/]/);

    if (/[\u0000-\u001f]/.test(name)) return "an archive entry with control characters in its name";
    if (segments.includes("..") || name.startsWith("/") || /^[a-zA-Z]:/.test(name)) {
      return "an archive entry that escapes the extraction folder (zip-slip)";
    }
    if (e.encrypted) return "a password-protected archive (contents can't be inspected)";
    if (e.isSymlink) return "an archive containing symbolic links";

    totalUncompressed += e.uncompressedSize;
    if (totalUncompressed > maxUncompressed) return "an archive that expands to an excessive size";
    if (
      e.compressedSize > 0 &&
      e.uncompressedSize > 100 * MB &&
      e.uncompressedSize / e.compressedSize > 1000
    ) {
      return "a suspicious compression ratio (zip bomb)";
    }

    if (name.endsWith("/") || ZIP_IGNORED.test(name)) continue;

    const ext = extOf(name);
    if (ooxml) {
      if (ooxml.forbidden.test(name)) return `an Office macro/embedded object (${name})`;
      continue;
    }
    if (DANGEROUS_EXTENSIONS.has(ext)) return `an executable/script inside the archive (${name})`;
    if (ARCHIVE_EXTENSIONS.has(ext)) return `a nested archive (${name})`;
    if (opts.zipEntryExtensions && !opts.zipEntryExtensions.includes(ext)) {
      return `an unexpected file type inside the archive (${name})`;
    }
    // double-extension inside a zip too
    if (
      segments[segments.length - 1]
        .split(".")
        .slice(1, -1)
        .some((s) => DANGEROUS_EXTENSIONS.has(s.toLowerCase()))
    ) {
      return `a disguised executable inside the archive (${name})`;
    }
  }

  if (ooxml) {
    const names = new Set(entries.map((e) => e.name));
    if (!ooxml.requiredEntries.every((r) => names.has(r))) return "a malformed Office document";
  }
  return null;
};

/* -------------------------------------------------------------------------- */
/*                         File type registry (MIME + magic)                  */
/* -------------------------------------------------------------------------- */

interface FileTypeDef {
  /** MIME types a browser may legitimately report for this extension */
  mimes: string[];
  /** Canonical MIME to report / send to server */
  detectedMime: string;
  /** Do the leading bytes look like this format? */
  sniff: (head: Uint8Array) => boolean;
  /** Deep scan – returns a threat description or null */
  inspect?: (
    blob: Blob,
    opts: ValidateFileOptions,
    fullScanLimit: number
  ) => Promise<string | null>;
}

const inspectImage: FileTypeDef["inspect"] = async (blob, _o, limit) => {
  const hit = await scanBlob(blob, [...WEB_THREATS, ...NATIVE_THREATS], limit);
  if (hit) return hit;

  // Data appended after the image's end marker that is itself an archive / program / script
  const tail = await readBytes(blob, Math.max(0, blob.size - 2 * MB), blob.size);
  const text = new TextDecoder("latin1").decode(tail);
  let end = -1;
  if (startsWith(await readBytes(blob, 0, 4), [0x89, 0x50, 0x4e, 0x47])) {
    const i = text.lastIndexOf("IEND");
    end = i >= 0 ? i + 8 : -1; // "IEND" + 4 CRC bytes
  } else if (startsWith(await readBytes(blob, 0, 3), [0xff, 0xd8, 0xff])) {
    const i = text.lastIndexOf("\xff\xd9");
    end = i >= 0 ? i + 2 : -1;
  }
  if (end >= 0 && end < tail.length) {
    const trailing = tail.subarray(end, end + 16);
    if (startsWith(trailing, [0x50, 0x4b, 0x03, 0x04]))
      return "a ZIP archive appended to the image";
    if (startsWith(trailing, [0x52, 0x61, 0x72, 0x21]))
      return "a RAR archive appended to the image";
    const exe = detectExecutableHeader(trailing);
    if (exe) return `${exe} appended to the image`;
  }
  return null;
};

const inspectMedia: FileTypeDef["inspect"] = async (blob, _o, limit) => {
  // Audio/video are big and opaque; only look for native executables & scripts smuggled in
  // the first/last few MB (polyglot files).
  return scanBlob(
    blob,
    [...NATIVE_THREATS, WEB_THREATS[0], WEB_THREATS[1]],
    Math.min(limit, 8 * MB)
  );
};

const inspectPdf: FileTypeDef["inspect"] = async (blob, _o, limit) => {
  const CHUNK = 4 * MB;
  const decoder = new TextDecoder("latin1");
  const deobfuscate = (s: string) =>
    s.replace(/#([0-9a-fA-F]{2})/g, (_m, h) => String.fromCharCode(parseInt(h, 16)));
  const test = (t: string) => PDF_THREATS.find((p) => p.re.test(deobfuscate(t)))?.name ?? null;

  if (blob.size <= limit) {
    for (let pos = 0; pos < blob.size; pos += CHUNK) {
      const start = Math.max(0, pos - 512);
      const hit = test(decoder.decode(await readBytes(blob, start, pos + CHUNK)));
      if (hit) return hit;
    }
  } else {
    const hit =
      test(decoder.decode(await readBytes(blob, 0, CHUNK))) ??
      test(decoder.decode(await readBytes(blob, blob.size - CHUNK, blob.size)));
    if (hit) return hit;
  }
  return scanBlob(blob, [...NATIVE_THREATS, WEB_THREATS[0], WEB_THREATS[1]], limit);
};

const detectTextEncoding = (head: Uint8Array) =>
  startsWith(head, [0xff, 0xfe])
    ? "utf-16le"
    : startsWith(head, [0xfe, 0xff])
    ? "utf-16be"
    : "utf-8";

const inspectText =
  (opts: { xml?: boolean; csv?: boolean }): FileTypeDef["inspect"] =>
  async (blob, o, limit) => {
    const head = await readBytes(blob, 0, 4096);
    const encoding = detectTextEncoding(head);

    // Real text has no NUL bytes (UTF-16 legitimately does, with a BOM)
    if (encoding === "utf-8" && head.includes(0)) return "binary data disguised as a text file";

    const patterns = [...WEB_THREATS, ...NATIVE_THREATS, ...TEXT_ONLY_THREATS];
    if (opts.xml) patterns.push(...XML_THREATS);
    if (opts.csv && o.blockCsvFormulas !== false) patterns.push(...CSV_FORMULA_THREATS);

    return scanBlob(blob, patterns, limit, encoding);
  };

const isZipHead = (h: Uint8Array) => startsWith(h, [0x50, 0x4b, 0x03, 0x04]);

const isoBmff = (h: Uint8Array) =>
  h.length >= 12 && ["ftyp", "moov", "mdat", "free", "wide", "skip"].includes(ascii(h, 4, 8));

const TEXT_MIMES = ["text/plain", "text/csv", "application/csv", "application/vnd.ms-excel"];

const FILE_TYPES: Record<string, FileTypeDef> = {
  /* images */
  jpg: {
    mimes: ["image/jpeg", "image/jpg", "image/pjpeg"],
    detectedMime: "image/jpeg",
    sniff: (h) => startsWith(h, [0xff, 0xd8, 0xff]),
    inspect: inspectImage
  },
  png: {
    mimes: ["image/png"],
    detectedMime: "image/png",
    sniff: (h) => startsWith(h, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    inspect: inspectImage
  },
  gif: {
    mimes: ["image/gif"],
    detectedMime: "image/gif",
    sniff: (h) => ascii(h, 0, 6) === "GIF87a" || ascii(h, 0, 6) === "GIF89a",
    inspect: inspectImage
  },
  webp: {
    mimes: ["image/webp"],
    detectedMime: "image/webp",
    sniff: (h) => ascii(h, 0, 4) === "RIFF" && ascii(h, 8, 12) === "WEBP",
    inspect: inspectImage
  },
  tif: {
    mimes: ["image/tiff", "image/geotiff", "image/tiff-fx"],
    detectedMime: "image/tiff",
    sniff: (h) =>
      startsWith(h, [0x49, 0x49, 0x2a, 0x00]) ||
      startsWith(h, [0x4d, 0x4d, 0x00, 0x2a]) ||
      startsWith(h, [0x49, 0x49, 0x2b, 0x00]),
    inspect: inspectMedia // TIFFs can be GBs; treat like media
  },

  /* video / audio */
  mp4: {
    mimes: ["video/mp4", "video/x-m4v"],
    detectedMime: "video/mp4",
    sniff: isoBmff,
    inspect: inspectMedia
  },
  mov: {
    mimes: ["video/quicktime", "video/mp4"],
    detectedMime: "video/quicktime",
    sniff: isoBmff,
    inspect: inspectMedia
  },
  webm: {
    mimes: ["video/webm", "audio/webm"],
    detectedMime: "video/webm",
    sniff: (h) => startsWith(h, [0x1a, 0x45, 0xdf, 0xa3]),
    inspect: inspectMedia
  },
  wav: {
    mimes: ["audio/wav", "audio/x-wav", "audio/wave", "audio/vnd.wave"],
    detectedMime: "audio/wav",
    sniff: (h) => ascii(h, 0, 4) === "RIFF" && ascii(h, 8, 12) === "WAVE",
    inspect: inspectMedia
  },
  mp3: {
    mimes: ["audio/mpeg", "audio/mp3"],
    detectedMime: "audio/mpeg",
    sniff: (h) => ascii(h, 0, 3) === "ID3" || (h[0] === 0xff && (h[1] & 0xe0) === 0xe0),
    inspect: inspectMedia
  },

  /* documents */
  pdf: {
    mimes: ["application/pdf"],
    detectedMime: "application/pdf",
    // spec allows up to 1024 bytes of junk before the header
    sniff: (h) => ascii(h, 0, Math.min(h.length, 1024)).includes("%PDF-"),
    inspect: inspectPdf
  },
  zip: {
    mimes: [
      "application/zip",
      "application/x-zip-compressed",
      "application/x-zip",
      "multipart/x-zip"
    ],
    detectedMime: "application/zip",
    sniff: isZipHead,
    inspect: (blob, o) => inspectZip(blob, o)
  },
  xlsx: {
    mimes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    detectedMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sniff: isZipHead,
    inspect: (blob, o) =>
      inspectZip(blob, o, {
        requiredEntries: ["[Content_Types].xml", "xl/workbook.xml"],
        forbidden: /(?:vbaProject\.bin|\/embeddings\/|\.exe$|\.dll$)/i
      })
  },
  xls: {
    mimes: ["application/vnd.ms-excel", "application/msexcel", "application/x-msexcel"],
    detectedMime: "application/vnd.ms-excel",
    sniff: (h) => startsWith(h, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
    inspect: (blob, _o, limit) => scanBlob(blob, OLE_MACRO_THREATS, limit)
  },

  /* text-ish */
  csv: {
    mimes: TEXT_MIMES,
    detectedMime: "text/csv",
    sniff: () => true,
    inspect: inspectText({ csv: true })
  },
  txt: {
    mimes: TEXT_MIMES,
    detectedMime: "text/plain",
    sniff: () => true,
    inspect: inspectText({ csv: true })
  },
  bib: {
    mimes: ["text/plain", "application/x-bibtex", "text/x-bibtex"],
    detectedMime: "application/x-bibtex",
    sniff: () => true,
    inspect: inspectText({})
  },
  prj: {
    mimes: ["text/plain", "application/x-esri-prj"],
    detectedMime: "text/plain",
    sniff: () => true,
    inspect: inspectText({})
  },
  cpg: {
    mimes: ["text/plain"],
    detectedMime: "text/plain",
    sniff: () => true,
    inspect: inspectText({})
  },
  xml: {
    mimes: ["text/xml", "application/xml"],
    detectedMime: "application/xml",
    sniff: (h) => ascii(h, 0, Math.min(h.length, 512)).trimStart().startsWith("<"),
    inspect: inspectText({ xml: true })
  },
  sld: {
    mimes: ["text/xml", "application/xml", "application/vnd.ogc.sld+xml"],
    detectedMime: "application/xml",
    sniff: (h) => ascii(h, 0, Math.min(h.length, 512)).trimStart().startsWith("<"),
    inspect: inspectText({ xml: true })
  },

  /* shapefile family */
  shp: {
    mimes: ["application/x-esri-shape", "application/octet-stream"],
    detectedMime: "application/x-esri-shape",
    sniff: (h) =>
      startsWith(h, [0x00, 0x00, 0x27, 0x0a]) && startsWith(h, [0xe8, 0x03, 0x00, 0x00], 28),
    inspect: inspectMedia
  },
  shx: {
    mimes: ["application/x-esri-shape", "application/octet-stream"],
    detectedMime: "application/x-esri-shape",
    sniff: (h) =>
      startsWith(h, [0x00, 0x00, 0x27, 0x0a]) && startsWith(h, [0xe8, 0x03, 0x00, 0x00], 28),
    inspect: inspectMedia
  },
  dbf: {
    mimes: [
      "application/dbf",
      "application/x-dbf",
      "application/vnd.dbf",
      "application/octet-stream"
    ],
    detectedMime: "application/x-dbf",
    sniff: (h) =>
      [0x02, 0x03, 0x04, 0x05, 0x30, 0x31, 0x32, 0x43, 0x63, 0x83, 0x8b, 0x8e, 0xf5, 0xfb].includes(
        h[0]
      ),
    inspect: inspectMedia
  }
};
// Shapefile sidecar/index files: opaque binaries (or xml for .atx) with no reliable magic bytes.
// They still get the executable-header check and a polyglot scan.
["sbn", "sbx", "fbn", "fbx", "ain", "aih", "ixs", "mxs", "qix"].forEach((ext) => {
  FILE_TYPES[ext] = {
    mimes: ["application/octet-stream", "application/x-esri-shape"],
    detectedMime: "application/octet-stream",
    sniff: () => true,
    inspect: inspectMedia
  };
});
FILE_TYPES.atx = {
  mimes: ["application/octet-stream", "text/xml", "application/xml"],
  detectedMime: "application/octet-stream",
  sniff: () => true,
  inspect: inspectMedia
};

// aliases
FILE_TYPES.jpeg = FILE_TYPES.jpg;
FILE_TYPES.tiff = FILE_TYPES.tif;

/** Ready-made allow-lists that mirror what each part of the app accepts today */
export const FILE_PRESETS = {
  /** Profile pictures, logos, trait icons, page/group images */
  image: ["jpg", "jpeg", "png", "gif", "webp"],
  /** Observation media + bulk zip (matches ACCEPTED_FILE_TYPES) */
  observation: ["jpg", "jpeg", "png", "mp4", "mov", "webm", "wav", "mp3", "zip"],
  document: ["pdf", "mp4", "mov", "webm"],
  /** Video only (rich-text editor media picker) */
  video: ["mp4", "mov", "webm"],
  spreadsheet: ["xls", "xlsx"],
  csv: ["csv"],
  bib: ["bib"],
  /** Naksha vector + raster layer parts */
  layer: [
    ...["shp", "shx", "dbf", "prj", "cpg", "xml", "csv", "tif", "tiff", "sld"],
    ...["sbn", "sbx", "fbn", "fbx", "ain", "aih", "ixs", "mxs", "atx", "qix"]
  ]
} as const;

export type FilePreset = keyof typeof FILE_PRESETS;

/** Entries allowed inside a bulk-upload zip for each preset */
export const ZIP_ENTRY_PRESETS: Partial<Record<FilePreset, readonly string[]>> = {
  observation: ["jpg", "jpeg", "png", "mp4", "mov", "webm", "wav", "mp3", "csv", "txt"]
};

/* -------------------------------------------------------------------------- */
/*                                 File-name checks                           */
/* -------------------------------------------------------------------------- */

const validateFileName = (name: string): string | null => {
  if (!name || name.length > 255) return "The file name is empty or too long.";
  if (/[\u0000-\u001f\u007f]/.test(name)) return "The file name contains control characters.";
  if (/[\\/]/.test(name)) return "The file name contains path separators.";
  if (/[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/.test(name)) {
    return "The file name contains hidden or direction-changing characters.";
  }
  if (name !== name.trim() || name.endsWith(".")) return "The file name ends with a space or dot.";
  return null;
};

const formatSize = (bytes: number) =>
  bytes >= MB ? `${Math.round(bytes / MB)} MB` : `${Math.max(1, Math.round(bytes / KB))} KB`;

const fail = (
  code: FileValidationCode,
  message: string,
  extra: Partial<FileValidationResult> = {}
): FileValidationResult => ({ valid: false, code, message, ...extra });

/* -------------------------------------------------------------------------- */
/*                                  Public API                                */
/* -------------------------------------------------------------------------- */

/**
 * Validates a single file/blob. Never throws – always resolves with a result object.
 *
 * @example
 * const res = await validateFile(file, { allowedExtensions: FILE_PRESETS.image, maxSize: 10 * 1024 * 1024 });
 * if (!res.valid) notification(res.message);
 */
export async function validateFile(
  file: Blob & { name?: string },
  options: ValidateFileOptions
): Promise<FileValidationResult> {
  try {
    const fileName = options.fileName ?? file.name ?? "";
    const fullScanLimit = options.fullScanLimit ?? 50 * MB;

    // 1. name
    const nameProblem = validateFileName(fileName);
    if (nameProblem) return fail("INVALID_FILE_NAME", nameProblem);

    // basic size
    if (file.size === 0) return fail("EMPTY_FILE", `"${fileName}" is empty.`);
    if (options.maxSize && file.size > options.maxSize) {
      return fail(
        "FILE_TOO_LARGE",
        `"${fileName}" is larger than the allowed ${formatSize(options.maxSize)}.`
      );
    }

    // 2. extension
    const segments = fileName.split(".");
    const extension = segments.length > 1 ? segments[segments.length - 1].toLowerCase() : "";
    const inner = segments.slice(1, -1).map((s) => s.toLowerCase());

    if (inner.some((s) => DANGEROUS_EXTENSIONS.has(s))) {
      return fail("DANGEROUS_EXTENSION", `"${fileName}" has a disguised executable extension.`, {
        extension
      });
    }
    const allowed = options.allowedExtensions.map((e) => e.toLowerCase().replace(/^\./, ""));
    const def = FILE_TYPES[extension];
    if (!extension || !allowed.includes(extension) || !def) {
      return fail(
        "UNSUPPORTED_TYPE",
        `".${extension || "?"}" files are not supported here. Allowed: ${allowed
          .map((e) => "." + e)
          .join(", ")}.`,
        { extension }
      );
    }

    // 3. declared MIME must agree with the extension
    const declared = (file.type || "").split(";")[0].trim().toLowerCase();
    if (declared && declared !== "application/octet-stream" && !def.mimes.includes(declared)) {
      return fail(
        "MIME_MISMATCH",
        `"${fileName}" is reported as ${declared}, which doesn't match a .${extension} file.`,
        { extension }
      );
    }

    // 4. magic bytes
    const head = await readBytes(file, 0, 4096);
    const exe = detectExecutableHeader(head);
    if (exe) {
      return fail(
        "MALICIOUS_CONTENT",
        `"${fileName}" is ${exe} disguised as a .${extension} file.`,
        { extension }
      );
    }
    if (!def.sniff(head)) {
      return fail(
        "SIGNATURE_MISMATCH",
        `The content of "${fileName}" doesn't match a real .${extension} file.`,
        { extension }
      );
    }

    // 5. deep inspection
    if (def.inspect) {
      const threat = await def.inspect(file, options, fullScanLimit);
      if (threat) {
        return fail(
          "MALICIOUS_CONTENT",
          `"${fileName}" was blocked for security reasons: detected ${threat}.`,
          {
            extension,
            detectedMime: def.detectedMime
          }
        );
      }
    }

    return { valid: true, extension, detectedMime: def.detectedMime };
  } catch (e: any) {
    // Fail closed: if we couldn't inspect it, don't let it through
    return fail("SCAN_FAILED", `Could not verify the file (${e?.message ?? "unknown error"}).`);
  }
}

/** Validates many files (in parallel) and splits them into accepted / rejected */
export async function validateFiles<T extends Blob & { name?: string }>(
  files: readonly T[],
  options: ValidateFileOptions
) {
  const results = await Promise.all(files.map((f) => validateFile(f, options)));
  const accepted: T[] = [];
  const rejected: { file: T; result: FileValidationResult }[] = [];
  results.forEach((result, i) =>
    result.valid ? accepted.push(files[i]) : rejected.push({ file: files[i], result })
  );
  return { accepted, rejected };
}

/** First registered extension whose MIME list contains `mime` (used to name anonymous Blobs) */
export const extensionForMime = (mime?: string): string | undefined => {
  const m = (mime || "").split(";")[0].trim().toLowerCase();
  if (!m || m === "application/octet-stream") return undefined;
  return Object.keys(FILE_TYPES).find((ext) => FILE_TYPES[ext].detectedMime === m);
};

/** Options for a preset (allowed extensions + sensible zip policy) */
export const optionsForPreset = (
  preset: FilePreset,
  overrides: Partial<ValidateFileOptions> = {}
): ValidateFileOptions => ({
  allowedExtensions: FILE_PRESETS[preset],
  zipEntryExtensions: ZIP_ENTRY_PRESETS[preset],
  ...overrides
});
