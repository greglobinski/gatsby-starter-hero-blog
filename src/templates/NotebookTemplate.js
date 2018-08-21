import React from 'react';
import PropTypes from "prop-types";
import Notebook from "../components/Notebook";
import Article from "../components/Article"
import { ThemeContext } from "../layouts";
import Seo from "../components/Seo";
import "katex/dist/katex.min.css";

const NotebookTemplate = props => {
  const {
    data : {
      notebook,
      site: {
        siteMetadata: { facebook }
      }
    }
  } = props;

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
      {theme => (
        <Article theme={theme}>
        <Notebook notebook={notebook} theme={theme} />
        </Article>
      )}
      </ThemeContext.Consumer>
      <Seo data={notebook} facebook={facebook} />
    </React.Fragment>
  );
};

NotebookTemplate.propTypes = {
  data: PropTypes.object.isRequired
};

export default NotebookTemplate;

//eslint-disable-next-line no-undef
export const NotebookQuery = graphql`
  query NotebookbySlug($slug: String!) {
    notebook: jupyterNotebook(fields: { slug: { eq: $slug } }) {
      html
      internal {
        content
      }
    }
    site {
      siteMetadata {
        facebook {
          appId
        }
      }
    }
  }
`

