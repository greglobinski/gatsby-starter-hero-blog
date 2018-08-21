import React from "react";
import PropTypes from "prop-types";

import Bodytext from "../Article/Bodytext";

const Notebook = props => {
  const {
    notebook: {
      html
    },
    theme
  } = props;
  return (
    <React.Fragment>
      <Bodytext html={html} theme = {theme}/>
    </React.Fragment>
  );
};

Notebook.propTypes = {
  notebook: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default Notebook;