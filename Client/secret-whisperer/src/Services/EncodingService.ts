export const fromStringToIV = (hexString: string) => {
  var result = [];
  for (var i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16));
  }

  return Uint8Array.from(result);
};

export const fromIVToString = (data: Uint8Array) => {
  return Buffer.from(data).toString("hex");
};
