import React, { useState } from "react";
import {
  Grid,
  Input,
  Checkbox,
  Button,
  FormControlLabel,
  Link
} from "@material-ui/core";
import { Canvas } from "./Canvas";
import { useDebounce } from "../Util";
import {
  encrypt,
  generateInitialVector,
  generateSalt
} from "../Services/CryptoService";
import { postData } from "../api/Api";
import { blobToArrayBuffer } from "../Services/ImageService";
import { fromDataToString } from "../Services/EncodingService";
import generate from "@babel/generator";

const baseUri = process.env.REACT_APP_BASE_URI;

export function Encode() {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [iv, setIv] = useState<Uint8Array>(generateInitialVector());
  const [salt, setSalt] = useState<Uint8Array>(generateSalt());

  const [encryptKey, setEncryptKey] = useState<string>("");
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);

  const [data, setData] = useState<ArrayBuffer | null>(null);
  const [encryptedData, setEncryptedData] = useState<ArrayBuffer | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const debouncedPassword = useDebounce(password, 500);

  const handleToggleShowPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setShowPassword(checked);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEncryptedData(null);
    setPassword(event.target.value);
  };

  const handleEncryptKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEncryptKey(event.target.value);
  };

  const encryptData = async () => {
    setEncrypting(true);
    if (data) {
      const encryptedData = await encrypt(encryptKey, salt, iv, data);
      setEncryptedData(encryptedData);
      setEncrypting(false);
    }
  };

  const submitAndGenerateUrl = async () => {
    if (encryptedData) {
      const response = await postData(encryptedData);
      setUrl(
        `${baseUri}decode/${response.token}/${fromDataToString(
          salt
        )}/${fromDataToString(iv)}`
      );
    }
  };

  const handleImageChange = async (blob: Blob) => {
    setData(await blobToArrayBuffer(blob));
  };

  const reset = () => {
    setUrl(null);
    setEncryptedData(null);
    setEncrypting(false);
    setData(null);
    setPassword("");
    setShowPassword(false);
    setEncryptKey("");
    setIv(generateInitialVector());
    setSalt(generateSalt());
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      {!url && (
        <Input
          placeholder="Your secret"
          onChange={handlePasswordChange}
          type="password"
        />
      )}

      {debouncedPassword !== "" && (
        <>
          {!url && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    color="default"
                    checked={showPassword}
                    onChange={handleToggleShowPassword}
                  />
                }
                label="Show secret"
              />

              <Canvas
                show={showPassword}
                fontSize={50}
                renderString={debouncedPassword}
                onImageChange={handleImageChange}
              />

              <Input
                color="default"
                placeholder="Receivers first name"
                onChange={handleEncryptKeyChange}
              />
              <br />

              <Button onClick={encryptData}>Encrypt</Button>
              <br />
            </>
          )}
          {encryptedData && (
            <>
              {(!url && (
                <Button
                  onClick={submitAndGenerateUrl}
                  color="primary"
                  variant="contained"
                >
                  Submit and generate URL
                </Button>
              )) || (
                <>
                  <Link
                    style={{ textAlign: "center" }}
                    href={url as string}
                    color="primary"
                  >
                    {url}
                  </Link>
                  <br />
                  <Button onClick={reset}>Share a new secret</Button>
                </>
              )}
            </>
          )}
        </>
      )}
    </Grid>
  );
}
