var textEncoding = require("text-encoding");
var TextEncoder = textEncoding.TextEncoder;

export const AES_ALGORITHM = "AES-CBC";

export const generateInitialVector = () => {
  return window.crypto.getRandomValues(new Uint8Array(16));
};

export const importCryptoKey = (key: string) => {
  const enc = new TextEncoder();
  const encodedKey = new Uint8Array(32);
  encodedKey.set(enc.encode(key.toLowerCase()) as Uint8Array);
  return crypto.subtle.importKey("raw", encodedKey, AES_ALGORITHM, true, [
    "encrypt",
    "decrypt"
  ]);
};

export const getAesParams = (iv: Uint8Array) => {
  return { name: AES_ALGORITHM, iv } as AesCbcParams;
};

export const encrypt = async (
  key: string,
  iv: Uint8Array,
  data: ArrayBuffer
) => {
  const cryptoKey = await importCryptoKey(key);
  return window.crypto.subtle.encrypt(getAesParams(iv), cryptoKey, data);
};

export const decrypt = async (
  key: string,
  iv: Uint8Array,
  encryptedData: ArrayBuffer
) => {
  const cryptoKey = await importCryptoKey(key);
  return window.crypto.subtle.decrypt(
    getAesParams(iv),
    cryptoKey,
    encryptedData
  );
};
