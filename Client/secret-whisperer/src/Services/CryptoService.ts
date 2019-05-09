export const AES_ALGORITHM = "AES-CBC";
export const DERIVATION_ALGORITHM = "PBKDF2";
export const ITERATIONS = 100000;
export const HASH_FUNCTION = "SHA-256";

export const generateInitialVector = () => {
  return window.crypto.getRandomValues(new Uint8Array(16));
};

export const generateSalt = () => {
  return window.crypto.getRandomValues(new Uint8Array(16));
};

export const importCryptoKey = (key: string) => {
  const encodedKey = new Uint8Array(32);
  const lowerCaseKey = key.toLowerCase();
  const array = Buffer.from(lowerCaseKey) as Uint8Array;
  encodedKey.set(array);
  return crypto.subtle.importKey(
    "raw",
    encodedKey,
    DERIVATION_ALGORITHM,
    false,
    ["deriveKey"]
  );
};

export const deriveCryptoKey = (key: CryptoKey, salt: Uint8Array) => {
  const algorithm = {
    name: DERIVATION_ALGORITHM,
    salt: salt,
    iterations: ITERATIONS,
    hash: HASH_FUNCTION
  } as Pbkdf2Params;

  const derivedKeyAlgorithm = {
    name: AES_ALGORITHM,
    length: 256
  } as AesDerivedKeyParams;

  return window.crypto.subtle.deriveKey(
    algorithm,
    key,
    derivedKeyAlgorithm,
    false,
    ["encrypt", "decrypt"]
  );
};

export const getAesParams = (iv: Uint8Array) => {
  return { name: AES_ALGORITHM, iv } as AesCbcParams;
};

export const encrypt = async (
  key: string,
  salt: Uint8Array,
  iv: Uint8Array,
  data: ArrayBuffer
) => {
  const masterKey = await importCryptoKey(key);
  const derivedKey = await deriveCryptoKey(masterKey, salt);
  return window.crypto.subtle.encrypt(getAesParams(iv), derivedKey, data);
};

export const decrypt = async (
  key: string,
  salt: Uint8Array,
  iv: Uint8Array,
  encryptedData: ArrayBuffer
) => {
  const masterKey = await importCryptoKey(key);
  const derivedKey = await deriveCryptoKey(masterKey, salt);
  return window.crypto.subtle.decrypt(
    getAesParams(iv),
    derivedKey,
    encryptedData
  );
};
