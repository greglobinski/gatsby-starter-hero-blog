import React from "react";
import PropTypes from "prop-types";
import FacebookProvider, { Comments as FBComments } from "react-facebook";
import { DiscussionEmbed } from "disqus-react";

import config from "../../../content/meta/config";

const Comments = props => {
  const { facebook, slug, theme, post } = props;
  // const { slug, post,theme} = props || {};
  if (!config.disqusShortname) {
    return (
      <React.Fragment>
        <div id="post-comments" className="comments">
          <FacebookProvider appId={facebook.appId}>
            <FBComments href={`${config.siteUrl}${slug}`} width="100%" colorscheme="light" />
          </FacebookProvider>
        </div>
        {/* --- STYLES --- */}
        <style jsx>
          {`
            .comments {
              margin: 0 -8px ${theme.space.default};
            }
          `}
        </style>
      </React.Fragment>
    );
  } else {
    const title = post && post.frontmatter && post.frontmatter.title;
    const category = post && post.frontmatter && post.frontmatter.category;
    const url = config.siteUrl + config.pathPrefix + slug;
    const disqusConfig = {
      identifier: `${post && post.fields && post.fields.prefix}/${category}`,
      title: title || slug,
      url
    };
    //console.log("POST COMMENTS:", JSON.stringify(disqusConfig));
    // console.log("POST COMMENTS PROPS:", JSON.stringify(props, null, 2));
    return (
      <React.Fragment>
        <div id="post-comments" className="comments">
          <DiscussionEmbed shortname={config.disqusShortname} config={disqusConfig} />{" "}
        </div>
        <style jsx>
          {`
            .comments {
              margin: 0 -8px ${theme.space.default};
            }
          `}
        </style>
      </React.Fragment>
    );
  }
};
Comments.propTypes = {
  slug: PropTypes.string.isRequired,
  facebook: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default Comments;
