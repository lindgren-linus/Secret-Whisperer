export const blobToArrayBuffer = (blob: Blob) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (ev: ProgressEvent) => {
      if (reader.result) {
        const buffer = reader.result as ArrayBuffer;
        resolve(buffer);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

export const getImageUrlFromData = (data: ArrayBuffer) => {
  const blob = new Blob([new Uint8Array(data)], { type: "image/png" });
  var url = URL.createObjectURL(blob);
  return url;
};
