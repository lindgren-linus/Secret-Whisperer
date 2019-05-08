import React, { useState } from "react";
import {
  Grid,
  Input,
  Checkbox,
  Button,
  Typography,
  FormControlLabel,
  Link
} from "@material-ui/core";
import { Canvas } from "./Canvas";
import { useDebounce } from "../Util";
import { encrypt, generateInitialVector } from "../Services/CryptoService";
import { postData } from "../api/Api";
import { blobToArrayBuffer } from "../Services/ImageService";
import { fromIVToString } from "../Services/EncodingService";

const baseUri = process.env.REACT_APP_BASE_URI;

export function Encode() {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [iv] = useState<Uint8Array>(generateInitialVector());
  const [encryptKey, setEncryptKey] = useState<string>("");
  const [encrypting, setEncrypting] = useState<boolean>(false);
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
      const encryptedData = await encrypt(encryptKey, iv, data);
      setEncryptedData(encryptedData);
      setEncrypting(false);
    }
  };

  const submitAndGenerateUrl = async () => {
    if (encryptedData) {
      const response = await postData(encryptedData);
      setUrl(`${baseUri}decode/${response.token}/${fromIVToString(iv)}`);
    }
  };

  const handleImageChange = async (blob: Blob) => {
    setData(await blobToArrayBuffer(blob));
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Input
        placeholder="Your password"
        onChange={handlePasswordChange}
        type="password"
      />

      {debouncedPassword !== "" && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                checked={showPassword}
                onChange={handleToggleShowPassword}
              />
            }
            label="Show password"
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
                <Link href={url as string} color="primary">
                  {url}
                </Link>
              )}
            </>
          )}
        </>
      )}
    </Grid>
  );
}
