import {
  extensionForMime,
  FilePreset,
  FileValidationResult,
  optionsForPreset,
  validateFile,
  ValidateFileOptions
} from "./file-validation";
import notification from "./notification";

type Overrides = Partial<ValidateFileOptions>;

interface FileChangeDetails {
  acceptedFiles: File[];
  rejectedFiles?: any[];
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Logs every file check to the browser console so you can see which files are going out:
 *   [upload-check] ACCEPTED photo.jpg | 2.3 MB | image/jpeg | preset: observation
 *   [upload-check] REJECTED evil.jpg  | 12 KB  | SIGNATURE_MISMATCH | preset: image | <reason>
 * Only metadata is logged, never file content.
 */
const logCheck = (
  file: Blob & { name?: string },
  name: string,
  preset: FilePreset,
  result: FileValidationResult
) => {
  const base = `[upload-check] ${result.valid ? "ACCEPTED" : "REJECTED"} ${
    name || "(unnamed)"
  } | ${formatSize(file.size)}`;
  if (result.valid) {
  } else {
    console.warn(
      `${base} | ${result.code} | declared: ${file.type || "none"} | preset: ${preset} | ${
        result.message
      }`
    );
  }
};

/** Validates one file, logs the outcome, and returns the result */
const checkFile = async (
  file: Blob & { name?: string },
  preset: FilePreset,
  overrides: Overrides = {}
): Promise<FileValidationResult> => {
  // anonymous blobs: derive the extension from the MIME type
  let name = overrides.fileName ?? file.name ?? "";
  if (!/\.[a-z0-9]+$/i.test(name)) {
    const ext = extensionForMime(file.type);
    if (ext) name = `${name}.${ext}`;
  }

  const result = await validateFile(
    file,
    optionsForPreset(preset, { ...overrides, fileName: name })
  );
  logCheck(file, name, preset, result);
  return result;
};

/**
 * Wraps a `FileUpload.Root` `onFileChange` handler. Every picked / dropped file is validated
 * (MIME, magic bytes, malicious content) *before* the handler sees it. Unsafe files are removed
 * and the reason is shown in a toast; the handler only receives the safe files.
 *
 * @example
 * <FileUpload.Root accept={ACCEPT_STRING} onFileChange={withFileValidation(handleFileChange, "image")}>
 */
export const withFileValidation =
  <D extends FileChangeDetails>(
    handler: (details: D) => any,
    preset: FilePreset,
    overrides: Overrides = {}
  ) =>
  async (details: D) => {
    const results = await Promise.all(
      details.acceptedFiles.map((file) => checkFile(file, preset, overrides))
    );

    const accepted = details.acceptedFiles.filter((_, i) => results[i].valid);
    results.forEach((r) => !r.valid && notification(r.message ?? "File rejected"));

    // everything was unsafe and nothing else to report → nothing for the handler to do
    if (accepted.length === 0 && !details.rejectedFiles?.length) return;

    return handler({ ...details, acceptedFiles: accepted });
  };

/**
 * For plain `<input type="file">` handlers. Resolves `true` if the file is safe; otherwise shows
 * a toast with the reason and resolves `false`.
 *
 * @example
 * const file = e.target.files?.[0];
 * if (!file || !(await isFileSafe(file, "image"))) return;
 */
export const isFileSafe = async (
  file: Blob & { name?: string },
  preset: FilePreset,
  overrides: Overrides = {}
): Promise<boolean> => {
  const result = await checkFile(file, preset, overrides);
  if (!result.valid) notification(result.message ?? "File rejected");
  return result.valid;
};
