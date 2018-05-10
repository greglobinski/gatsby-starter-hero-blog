import FaTag from "react-icons/lib/fa/tag";
import PropTypes from "prop-types";
import React from "react";

import { ThemeContext } from "../layouts";
import Article from "../components/Main/Article";
import Headline from "../components/Main/Headline";
import List from "../components/List";
import Main from "../components/Main";
import Seo from "../components/Seo";

const CategoryPage = props => {
  const {
    data: {
      posts: { edges: posts },
      site: {
        siteMetadata: { facebook }
      }
    }
  } = props;

  // Create category list
  const categories = {};
  posts.forEach(edge => {
    const {
      node: {
        frontmatter: { category }
      }
    } = edge;

    if (category && category != null) {
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(edge);
    }
  });

  const categoryList = [];

  for (var key in categories) {
    categoryList.push([key, categories[key]]);
  }

  return (
    <React.Fragment>
      <Main>
        <ThemeContext.Consumer>
          {theme => (
            <Article theme={theme}>
              <header>
                <Headline title="Posts by categories" theme={theme} />
              </header>
              {categoryList.map(item => (
                <section key={item[0]}>
                  <h2>
                    <FaTag /> {item[0]}
                  </h2>
                  <List edges={item[1]} theme={theme} />
                </section>
              ))}
              {/* --- STYLES --- */}
              <style jsx>{`
                h2 {
                  margin: 0 0 0.5em;
                }
                h2 :global(svg) {
                  height: 0.8em;
                  fill: ${theme.color.brand.primary};
                }
              `}</style>
            </Article>
          )}
        </ThemeContext.Consumer>

        <Seo facebook={facebook} />
      </Main>
    </React.Fragment>
  );
};

CategoryPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default CategoryPage;

//eslint-disable-next-line no-undef
export const guery = graphql`
  query PostsQuery {
    posts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
      sort: { fields: [fields___prefix], order: DESC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            prefix
          }
          frontmatter {
            title
            category
            author
            cover {
              children {
                ... on ImageSharp {
                  sizes(maxWidth: 800, maxHeight: 360) {
                    ...GatsbyImageSharpSizes_withWebp
                  }
                }
              }
            }
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
