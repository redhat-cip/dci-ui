import React, { Component } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ClipboardIcon } from "@patternfly/react-icons";

export default class CopyButton extends Component {
  state = {
    title: this.props.titleBefore
  };
  textCopied = () => {
    this.setState({ title: this.props.titleAfter });
    setTimeout(() => {
      this.setState({ title: this.props.titleBefore });
    }, 2000);
  };

  render() {
    return (
      <CopyToClipboard text={this.props.text} onCopy={() => this.textCopied()}>
        <span
          data-balloon={this.state.title}
          data-balloon-pos={this.props.position}
          onClick={() => this.textCopied()}
        >
          <ClipboardIcon />
        </span>
      </CopyToClipboard>
    );
  }
}

CopyButton.propTypes = {
  titleBefore: PropTypes.string,
  titleAfter: PropTypes.string,
  position: PropTypes.string,
  text: PropTypes.string.isRequired
};

CopyButton.defaultProps = {
  titleBefore: "Click to copy",
  titleAfter: "Copied!",
  position: "right"
};
