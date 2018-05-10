import React from "react";
import PropTypes from "prop-types";

import Seo from "../components/Seo";
import Main from "../components/Main";
import Article from "../components/Main/Article";
import Page from "../components/Page";
import { ThemeContext } from "../layouts";

const PageTemplate = props => {
  const {
    data: {
      page,
      site: {
        siteMetadata: { facebook }
      }
    }
  } = props;

  return (
    <Main>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <Page page={page} theme={theme} />
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo data={page} facebook={facebook} />
    </Main>
  );
};

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired
};

export default PageTemplate;

//eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query PageByPath($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
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
`;
