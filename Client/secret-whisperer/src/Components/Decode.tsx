import React, { useState, useEffect } from "react";
import { Grid, Input, Typography, Button } from "@material-ui/core";

import {
  encrypt,
  decrypt,
  generateInitialVector
} from "../Services/CryptoService";
import { postData, fetchData } from "../api/Api";
import { getImageUrlFromData } from "../Services/ImageService";
import { fromStringToIV } from "../Services/EncodingService";

export function Decode(props: {
  match: { params: { token: string; iv: string } };
}) {
  const decodedIv = fromStringToIV(props.match.params.iv);
  const [iv] = useState<Uint8Array>(decodedIv);
  const [decryptKey, setDecryptKey] = useState<string>("");
  const [decrypting, setDecrypting] = useState<boolean>(false);

  const [encryptedData, setEncryptedData] = useState<ArrayBuffer | null>(null);
  const [decryptedData, setDecryptedData] = useState<ArrayBuffer | null>(null);

  const [decryptionFailed, setDecryptionFailed] = useState<boolean>(false);
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);

  const fetchEncryptedData = async () => {
    try {
      const data = await fetchData(props.match.params.token);
      if (data) {
        setEncryptedData(data);
      } else {
        setFetchFailed(true);
      }
    } catch (exception) {
      setFetchFailed(true);
    }
  };

  useEffect(() => {
    fetchEncryptedData();
  }, [props.match.params.token]);

  const handleDecryptKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDecryptKey(event.target.value);
  };

  const decryptData = async () => {
    setDecrypting(true);
    setDecryptedData(null);
    setDecryptionFailed(false);
    if (encryptedData) {
      try {
        setDecryptedData(await decrypt(decryptKey, iv, encryptedData));
        setDecrypting(false);
      } catch (exception) {
        setDecrypting(false);
        setDecryptionFailed(true);
      }
    }
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      {(fetchFailed && (
        <Typography color="error">
          The secret is not available anymore!
        </Typography>
      )) || (
        <>
          <Input
            placeholder="Your first name"
            onChange={handleDecryptKeyChange}
          />
          <br />

          <Button onClick={decryptData}>Reveal secret</Button>

          {decryptedData && <img src={getImageUrlFromData(decryptedData)} />}
          {decryptionFailed && (
            <Typography color="error">
              The secret does not belong to this name
            </Typography>
          )}
        </>
      )}
    </Grid>
  );
}
