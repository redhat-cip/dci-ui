import React, { Component } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ClipboardIcon } from "@patternfly/react-icons";
import { Tooltip, TooltipPosition } from "@patternfly/react-core";

export default class CopyButton extends Component {
  state = {
    tooltipText: this.props.tooltipTextBefore || "Click to copy"
  };

  textCopied = () => {
    const { tooltipTextAfter = "Copied!" } = this.props;
    const { tooltipText } = this.state;
    this.setState({ tooltipText: tooltipTextAfter });
    setTimeout(() => this.setState({ tooltipText }), 2000);
  };

  render() {
    const { position = TooltipPosition.right, text } = this.props;
    const { tooltipText } = this.state;
    return (
      <CopyToClipboard text={text} onCopy={() => this.textCopied()}>
        <div>
          <Tooltip
            position={position}
            enableFlip
            content={<div>{tooltipText}</div>}
          >
            <ClipboardIcon />
          </Tooltip>
        </div>
      </CopyToClipboard>
    );
  }
}
