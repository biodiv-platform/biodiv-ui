export const sendFileFromResponse = (file, fileName) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  const blob = new Blob([file], { type: "octet/stream" });
  const blobUrl = window.URL.createObjectURL(blob);
  a.href = blobUrl;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(blobUrl);
};
