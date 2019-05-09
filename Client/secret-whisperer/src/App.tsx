import React, { useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { useStyles } from "./App.styles";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Encode } from "./Components/Encode";
import { Decode } from "./Components/Decode";
import { detectIE } from "./Components/DetectIE";

function App() {
  const classes = useStyles();

  const [isMicrosoftBrowser] = useState<boolean>(detectIE() !== false);

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
          Secret Whisperer
        </Typography>
        <Paper className={classes.paper}>
          {(isMicrosoftBrowser && (
            <Typography color="error">
              This application only supports NON Microsoft browsers
            </Typography>
          )) || (
            <BrowserRouter>
              <Switch>
                <Route exact={true} path="/" component={Encode} />

                <Route
                  exact={true}
                  path="/decode/:token/:salt/:iv"
                  component={Decode}
                />
              </Switch>
            </BrowserRouter>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
