import React from "react";
import { Link } from "react-router-dom";

export const HomeLink = React.forwardRef((props: any, ref: any) => (
  <Link innerRef={ref} to="/" {...props} />
));
