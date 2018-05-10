import FaTag from "react-icons/lib/fa/tag";
import PropTypes from "prop-types";
import React from "react";

import Seo from "../components/Seo";
import { ThemeContext } from "../layouts";
import Article from "../components/Main/Article";
import Headline from "../components/Main/Headline";
import List from "../components/List";
import Main from "../components/Main";

const CategoryTemplate = props => {
  const {
    pathContext: { category },
    data: {
      allMarkdownRemark: { totalCount, edges },
      site: {
        siteMetadata: { facebook }
      }
    }
  } = props;

  return (
    <React.Fragment>
      <Main>
        <ThemeContext.Consumer>
          {theme => (
            <Article theme={theme}>
              <header>
                <Headline theme={theme}>
                  <span>Posts in category</span> <FaTag />
                  {category}
                </Headline>
                <p className="meta">
                  There {totalCount > 1 ? "are" : "is"} <strong>{totalCount}</strong> post{totalCount >
                  1
                    ? "s"
                    : ""}{" "}
                  in the category.
                </p>
                <List edges={edges} theme={theme} />
              </header>
            </Article>
          )}
        </ThemeContext.Consumer>

        <Seo facebook={facebook} />
      </Main>
    </React.Fragment>
  );
};

CategoryTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pathContext: PropTypes.object.isRequired
};

export default CategoryTemplate;

// eslint-disable-next-line no-undef
export const categoryQuery = graphql`
  query PostsByCategory($category: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___prefix], order: DESC }
      filter: { frontmatter: { category: { eq: $category } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
            category
          }
        }
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
