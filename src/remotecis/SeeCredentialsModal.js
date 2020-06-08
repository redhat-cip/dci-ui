import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { UserSecretIcon } from "@patternfly/react-icons";
import copyToClipboard from "../services/copyToClipboard";

export default class SeeCredentialsModal extends Component {
  state = {
    show: false,
    copied: false,
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { remoteci } = this.props;
    const { show, copied } = this.state;

    const credentials = `
DCI_CLIENT_ID='remoteci/${remoteci.id}'
DCI_API_SECRET='${remoteci.api_secret}'
DCI_CS_URL='https://api.distributed-ci.io/'
export DCI_CLIENT_ID
export DCI_API_SECRET
export DCI_CS_URL
`;

    return (
      <React.Fragment>
        <Modal
          title={`DCI credentials for ${remoteci.name}`}
          isOpen={show}
          onClose={this.closeModal}
          isLarge
          actions={[
            <Button key="cancel" variant="secondary" onClick={this.closeModal}>
              close
            </Button>,
            <Button
              key="copy"
              onClick={(event) => {
                copyToClipboard(event, credentials);
                this.setState({ copied: true });
              }}
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </Button>,
          ]}
        >
          <pre>{credentials}</pre>
        </Modal>
        <Button onClick={this.showModal}>
          <UserSecretIcon />
        </Button>
      </React.Fragment>
    );
  }
}
