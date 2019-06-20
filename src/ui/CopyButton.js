import React, { Component } from "react";
import CopyButton from "@patternfly/react-core/dist/js/components/ClipboardCopy/CopyButton";
import { TooltipPosition } from "@patternfly/react-core";
import copyToClipboard from "../services/copyToClipboard";

export default class DCICopyButton extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      text: this.props.text,
      copied: false
    };
  }

  render() {
    const { position = TooltipPosition.right } = this.props;
    const { copied, text } = this.state;
    return (
      <CopyButton
        exitDelay={1600}
        entryDelay={100}
        maxWidth="150px"
        position={position}
        id={`copy-button-${text}`}
        textId={`text-input-${text}`}
        aria-label="Copy to clipboard"
        onClick={event => {
          if (this.timer) {
            clearTimeout(this.timer);
            this.setState({ copied: false });
          }
          copyToClipboard(event, text);
          this.setState({ copied: true }, () => {
            this.timer = setTimeout(() => {
              this.setState({ copied: false });
              this.timer = null;
            }, 2000);
          });
        }}
      >
        {copied ? "Successfully copied to clipboard!" : "Copy to clipboard"}
      </CopyButton>
    );
  }
}
