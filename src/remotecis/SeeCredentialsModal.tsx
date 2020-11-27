import React, { useState } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { UserSecretIcon } from "@patternfly/react-icons";
import copyToClipboard from "../services/copyToClipboard";
import { IRemoteci } from "types";

interface SeeCredentialsModalProps {
  remoteci: IRemoteci;
}

export default function SeeCredentialsModal({
  remoteci,
}: SeeCredentialsModalProps) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const credentials = `
DCI_CLIENT_ID='remoteci/${remoteci.id}'
DCI_API_SECRET='${remoteci.api_secret}'
DCI_CS_URL='https://api.distributed-ci.io/'
export DCI_CLIENT_ID
export DCI_API_SECRET
export DCI_CS_URL
`;

  return (
    <>
      <Modal
        title={`DCI credentials for ${remoteci.name}`}
        isOpen={show}
        onClose={() => setShow(false)}
        variant="large"
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => setShow(false)}
          >
            close
          </Button>,
          <Button
            key="copy"
            onClick={(event) => {
              copyToClipboard(event, credentials);
              setCopied(true);
            }}
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </Button>,
        ]}
      >
        <pre>{credentials}</pre>
      </Modal>
      <Button onClick={() => setShow(true)}>
        <UserSecretIcon />
      </Button>
    </>
  );
}
