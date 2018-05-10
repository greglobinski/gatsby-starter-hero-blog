import React from "react";
import PropTypes from "prop-types";

const Main = props => {
  const { children } = props;

  return <main>{children}</main>;
};

Main.propTypes = {
  children: PropTypes.node.isRequired
};

export default Main;
