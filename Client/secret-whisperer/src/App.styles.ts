import { makeStyles } from "@material-ui/styles";
import src from "./static/images/background-blur-clean-531880.jpg";

export const useStyles = makeStyles({
  container: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    width: "100%",
    overflow: "auto",
    backgroundImage: `url('${src}')`
  },
  paper: {
    padding: "2rem",
    overflow: "auto",
    maxWidth: "80%"
  }
});
