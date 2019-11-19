import React from "react";
import { SocialIcon } from "react-social-icons";
import "./SocialMediaIcons.css";

class SocialMediaIcons extends React.Component {
  render() {
    const { urls, color } = this.props;
    if (urls && urls.length > 0) {
      return (
        <div className="social-media-icons">
          {urls.map(url => (
            <SocialIcon
              key={url}
              className="social-media-icon"
              url={url}
              color={color}
              style={{ height: null, width: null }}
            />
          ))}
        </div>
      );
    }
    return null;
  }
}

export default SocialMediaIcons;
