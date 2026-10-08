import { useFileUpload, UseFileUploadProps } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

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

export interface FileRejection {
  id: string;
  file: File;
  message: string;
}

/** Readable text for the error codes Chakra / zag-js reports */
const describeUploadErrors = (errors: string[], maxFileSize?: number): string =>
  errors
    .map((code) => {
      switch (code) {
        case "FILE_INVALID_TYPE":
          return "This file type is not supported.";
        case "FILE_TOO_LARGE":
          return maxFileSize
            ? `The file is larger than the ${formatSize(maxFileSize)} limit.`
            : "The file is too large.";
        case "FILE_TOO_SMALL":
          return "The file is too small.";
        case "TOO_MANY_FILES":
          return "Too many files selected at once.";
        case "FILE_EXISTS":
          return "This file has already been added.";
        default:
          return "This file is not valid.";
      }
    })
    .join(" ");

interface ValidatedFileUploadOptions {
  overrides?: Overrides;
  /** Show a toast for every rejected file. Turn off when the rejections are shown in a list. */
  notify?: boolean;
}

/**
 * `useFileUpload` with validation built in. Use it with `<FileUpload.RootProvider value={...}>`
 * instead of `<FileUpload.Root onFileChange={withFileValidation(...)}>`.
 *
 * Chakra keeps every picked file in its own state, including files our validation rejects, and
 * on each new pick it reports the whole accumulated list again. That made rejected files show up
 * in `FileUpload.List`, count toward `maxFiles` and re-toast, and made earlier files get processed
 * again. This hook clears Chakra's state after every pick, so the handler only ever sees the
 * files from that pick, and calls it once for accepted files and once for rejected ones.
 *
 * It also returns `rejections`: every file from the latest pick that was turned away (by Chakra's
 * type / size checks or by our validation) with the reason, ready to list under the dropzone.
 *
 * @example
 * const { fileUpload, rejections } = useValidatedFileUpload({ accept }, handleFileChange, "image");
 * <FileUpload.RootProvider value={fileUpload}>...</FileUpload.RootProvider>
 */
export const useValidatedFileUpload = <D extends FileChangeDetails>(
  props: Omit<UseFileUploadProps, "onFileChange" | "onFileAccept" | "onFileReject">,
  handler: (details: D) => any,
  preset: FilePreset,
  { overrides = {}, notify = true }: ValidatedFileUploadOptions = {}
) => {
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const idRef = useRef(0);
  const pickPendingRef = useRef(false);

  // always call the latest handler without re-creating the upload machine
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const toRejection = (file: File, message: string): FileRejection => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${idRef.current++}`,
    file,
    message
  });

  // Accept and reject callbacks for one pick fire back to back, so the first one starts the pick:
  // it clears the previous pick's rejections and schedules Chakra's state to be cleared.
  const startPick = () => {
    if (pickPendingRef.current) return;
    pickPendingRef.current = true;
    setRejections([]);
    queueMicrotask(() => {
      pickPendingRef.current = false;
      fileUpload.clearFiles();
    });
  };

  const fileUpload = useFileUpload({
    ...props,
    onFileAccept: async ({ files }) => {
      if (!files.length) return; // fired by clearFiles()
      startPick();

      const results = await Promise.all(files.map((file) => checkFile(file, preset, overrides)));
      const safe = files.filter((_, i) => results[i].valid);
      const failed = files
        .map((file, i) =>
          results[i].valid ? null : toRejection(file, results[i].message ?? "File rejected")
        )
        .filter(Boolean) as FileRejection[];

      if (failed.length) {
        if (notify) failed.forEach((r) => notification(r.message));
        setRejections((prev) => [...prev, ...failed]);
      }

      if (safe.length) {
        handlerRef.current({ acceptedFiles: safe, rejectedFiles: [] } as unknown as D);
      }
    },
    onFileReject: ({ files }) => {
      if (!files.length) return; // fired by clearFiles()
      startPick();

      setRejections((prev) => [
        ...prev,
        ...files.map(({ file, errors }) =>
          toRejection(file, describeUploadErrors(errors, props.maxFileSize))
        )
      ]);
      handlerRef.current({ acceptedFiles: [], rejectedFiles: files } as unknown as D);
    }
  });

  const dismissRejection = (id: string) => setRejections((prev) => prev.filter((r) => r.id !== id));

  return { fileUpload, rejections, dismissRejection, clearRejections: () => setRejections([]) };
};
