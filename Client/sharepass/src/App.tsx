import React, { useState } from "react";
import {
  Grid,
  Paper,
  Input,
  Button,
  CircularProgress,
  Typography,
  Checkbox
} from "@material-ui/core";
import { useStyles } from "./App.styles";
import { useDebounce } from "./Util";
import { Canvas } from "./Canvas";
import {
  encrypt,
  generateInitialVector,
  decrypt
} from "./Services/CryptoService";
import {
  blobToArrayBuffer,
  getImageUrlFromData
} from "./Services/ImageService";

function App() {
  const classes = useStyles();

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [iv, setIv] = useState<Uint8Array>(generateInitialVector());
  const [encryptKey, setEncryptKey] = useState<string>("");
  const [decryptKey, setDecryptKey] = useState<string>("");

  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [decrypting, setDecrypting] = useState<boolean>(false);

  const [data, setData] = useState<ArrayBuffer | null>(null);

  const [encryptedData, setEncryptedData] = useState<ArrayBuffer | null>(null);
  const [decryptedData, setDecryptedData] = useState<ArrayBuffer | null>(null);

  const [decryptionFailed, setDecryptionFailed] = useState<boolean>(false);

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

  const handleDecryptKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDecryptKey(event.target.value);
  };

  const encryptData = async () => {
    setEncrypting(true);
    if (data) {
      const encryptedData = await encrypt(encryptKey, iv, data);
      debugger;
      setEncryptedData(encryptedData);
      setEncrypting(false);
    }
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

  const handleImageChange = async (blob: Blob) => {
    setData(await blobToArrayBuffer(blob));
  };

  return (
    <Grid
      container
      className={classes.container}
      alignContent="center"
      justify="center"
    >
      <Grid item>
        <Typography
          component="h1"
          variant="h2"
          color="secondary"
          style={{ marginBottom: "2rem", textAlign: "center" }}
        >
          SharePass
        </Typography>
        <Paper className={classes.paper}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Input
              placeholder="Your password"
              onChange={handlePasswordChange}
              type="password"
            />

            {debouncedPassword !== "" && (
              <>
                <Checkbox
                  color="default"
                  value={showPassword}
                  onChange={handleToggleShowPassword}
                >
                  Show password
                </Checkbox>
                <Canvas
                  show={showPassword}
                  fontSize={50}
                  renderString={debouncedPassword}
                  onImageChange={handleImageChange}
                />
                <Input
                  placeholder="Receivers first name"
                  onChange={handleEncryptKeyChange}
                />
                <br />

                <Button onClick={encryptData}>Encrypt</Button>
                {encrypting && <CircularProgress size="large" />}
                {encryptedData && (
                  <>
                    <Input
                      placeholder="Your first name"
                      onChange={handleDecryptKeyChange}
                    />
                    <br />

                    <Button onClick={decryptData}>Decrypt</Button>

                    {decryptedData && (
                      <img src={getImageUrlFromData(decryptedData)} />
                    )}
                    {decryptionFailed && (
                      <Typography color="error">Decryption failed</Typography>
                    )}
                  </>
                )}
              </>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
