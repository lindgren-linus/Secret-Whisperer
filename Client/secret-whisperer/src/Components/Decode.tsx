import React, { useState, useEffect } from "react";
import {
  Grid,
  Input,
  Typography,
  Button,
  CircularProgress
} from "@material-ui/core";

import { decrypt } from "../Services/CryptoService";
import { fetchData } from "../api/Api";
import { getImageUrlFromData } from "../Services/ImageService";
import { fromStringToData } from "../Services/EncodingService";
import { HomeLink } from "./HomeLink";

export function Decode(props: {
  match: { params: { token: string; salt: string; iv: string } };
}) {
  const decodedIv = fromStringToData(props.match.params.iv);
  const [iv] = useState<Uint8Array>(decodedIv);
  const decodedSalt = fromStringToData(props.match.params.salt);
  const [salt] = useState<Uint8Array>(decodedSalt);

  const [decryptKey, setDecryptKey] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(true);

  const [decrypting, setDecrypting] = useState<boolean>(false);

  const [encryptedData, setEncryptedData] = useState<ArrayBuffer | null>(null);
  const [decryptedData, setDecryptedData] = useState<ArrayBuffer | null>(null);

  const [decryptionFailed, setDecryptionFailed] = useState<boolean>(false);
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);

  const fetchEncryptedData = async () => {
    setFetching(true);
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
    setFetching(false);
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
        const data = await decrypt(decryptKey, salt, iv, encryptedData);
        if (data) {
          setDecryptedData(data);
        } else {
          setDecrypting(false);
          setDecryptionFailed(true);
        }
        setDecrypting(false);
      } catch (exception) {
        setDecrypting(false);
        setDecryptionFailed(true);
      }
    }
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      {(fetching && <CircularProgress />) ||
        (fetchFailed && (
          <Typography color="error">
            The secret is not available anymore!
          </Typography>
        )) || (
          <>
            {!decryptedData && (
              <>
                <Input
                  placeholder="Your first name"
                  onChange={handleDecryptKeyChange}
                />
                <br />

                <Button onClick={decryptData}>Reveal secret</Button>
              </>
            )}
            {decryptedData && <img src={getImageUrlFromData(decryptedData)} />}
            {decryptionFailed && (
              <>
                <Typography color="error">
                  The secret does not belong to this name
                </Typography>
              </>
            )}
          </>
        )}
      {(decryptedData || fetchFailed) && (
        <Button component={HomeLink}>Share a new secret</Button>
      )}
    </Grid>
  );
}
