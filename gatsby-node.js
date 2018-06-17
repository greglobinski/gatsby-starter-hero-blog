//const webpack = require("webpack");
const _ = require("lodash");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const Promise = require("bluebird");

const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    const separtorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separtorIndex ? separtorIndex + 2 : 0;
    createNodeField({
      node,
      name: `slug`,
      value: `${separtorIndex ? "/" : ""}${slug.substring(shortSlugStart)}`
    });
    createNodeField({
      node,
      name: `prefix`,
      value: separtorIndex ? slug.substring(1, separtorIndex) : ""
    });
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve("./src/templates/PostTemplate.js");
    const pageTemplate = path.resolve("./src/templates/PageTemplate.js");
    const categoryTemplate = path.resolve("./src/templates/CategoryTemplate.js");
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              filter: { id: { regex: "//posts|pages//" } }
              sort: { fields: [fields___prefix], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  id
                  fields {
                    slug
                    prefix
                  }
                  frontmatter {
                    title
                    category
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const items = result.data.allMarkdownRemark.edges;

        // Create category list
        const categorySet = new Set();
        items.forEach(edge => {
          const {
            node: {
              frontmatter: { category }
            }
          } = edge;

          if (category && category !== null) {
            categorySet.add(category);
          }
        });

        // Create category pages
        const categoryList = Array.from(categorySet);
        categoryList.forEach(category => {
          createPage({
            path: `/category/${_.kebabCase(category)}/`,
            component: categoryTemplate,
            context: {
              category
            }
          });
        });

        // Create posts
        const posts = items.filter(item => /posts/.test(item.node.id));
        posts.forEach(({ node }, index) => {
          const slug = node.fields.slug;
          const next = index === 0 ? undefined : posts[index - 1].node;
          const prev = index === posts.length - 1 ? undefined : posts[index + 1].node;

          createPage({
            path: slug,
            component: postTemplate,
            context: {
              slug,
              prev,
              next
            }
          });
        });

        // and pages.
        const pages = items.filter(item => /pages/.test(item.node.id));
        pages.forEach(({ node }) => {
          const slug = node.fields.slug;

          createPage({
            path: slug,
            component: pageTemplate,
            context: {
              slug
            }
          });
        });
      })
    );
  });
};

exports.modifyWebpackConfig = ({ config, stage }) => {
  switch (stage) {
    case "build-javascript":
      {
        // let components = store.getState().pages.map(page => page.componentChunkName);
        // components = _.uniq(components);
        // config.plugin("CommonsChunkPlugin", webpack.optimize.CommonsChunkPlugin, [
        //   {
        //     name: `commons`,
        //     chunks: [`app`, ...components],
        //     minChunks: (module, count) => {
        //       const vendorModuleList = []; // [`material-ui`, `lodash`];
        //       const isFramework = _.some(
        //         vendorModuleList.map(vendor => {
        //           const regex = new RegExp(`[\\\\/]node_modules[\\\\/]${vendor}[\\\\/].*`, `i`);
        //           return regex.test(module.resource);
        //         })
        //       );
        //       return isFramework || count > 1;
        //     }
        //   }
        // ]);

        config.plugin("BundleAnalyzerPlugin", BundleAnalyzerPlugin, [
          {
            analyzerMode: "static",
            reportFilename: "./report/treemap.html",
            openAnalyzer: true,
            logLevel: "error",
            defaultSizes: "gzip"
          }
        ]);

        config.loader("yaml-loader", {
          test: /\.yaml$/,
          include: path.resolve("data"),
          loader: "yaml"
        });
      }
      break;
  }

  return config;
};

exports.modifyBabelrc = ({ babelrc }) => {
  return {
    ...babelrc,
    plugins: babelrc.plugins.concat([
      [
        "styled-jsx/babel",
        {
          plugins: [
            "styled-jsx-plugin-postcss",
            [
              "styled-jsx-plugin-stylelint",
              {
                stylelint: {
                  rules: {
                    "block-no-empty": true,
                    "color-no-invalid-hex": true,
                    "unit-no-unknown": true,
                    "property-no-unknown": true,
                    "declaration-block-no-shorthand-property-overrides": true,
                    "selector-pseudo-element-no-unknown": true,
                    "selector-type-no-unknown": true,
                    "media-feature-name-no-unknown": true,
                    "no-empty-source": true,
                    "no-extra-semicolons": true,
                    "function-url-no-scheme-relative": true,
                    "declaration-no-important": true,
                    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global"] }],
                    "shorthand-property-no-redundant-values": true,
                    "no-duplicate-selectors": null,
                    "declaration-block-no-duplicate-properties": null,
                    "no-descending-specificity": null
                  }
                }
              }
            ]
          ]
        }
      ],
      [
        "import",
        {
          libraryName: "antd",
          style: "css"
        }
      ],
      `syntax-dynamic-import`,
      `dynamic-import-webpack`
    ])
  };
};
