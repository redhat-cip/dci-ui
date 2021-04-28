import { useState } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { UserSecretIcon } from "@patternfly/react-icons";
import copyToClipboard from "../services/copyToClipboard";

interface SeeCredentialsModalProps {
  credentials: {
    id: string;
    api_secret: string;
    name: string;
  };
  role: "remoteci" | "feeder";
}

export default function SeeCredentialsModal({
  credentials,
  role,
}: SeeCredentialsModalProps) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const content = `
DCI_CLIENT_ID='${role}/${credentials.id}'
DCI_API_SECRET='${credentials.api_secret}'
DCI_CS_URL='https://api.distributed-ci.io/'
export DCI_CLIENT_ID
export DCI_API_SECRET
export DCI_CS_URL
`;

  const contentNoSecret = `
DCI_CLIENT_ID='${role}/${credentials.id}'
DCI_API_SECRET='*********************************'
DCI_CS_URL='https://api.distributed-ci.io/'
export DCI_CLIENT_ID
export DCI_API_SECRET
export DCI_CS_URL
`;

  return (
    <>
      <Modal
        title={`DCI credentials for ${credentials.name}`}
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
              copyToClipboard(event, content);
              setCopied(true);
            }}
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </Button>,
        ]}
      >
        <pre>{contentNoSecret}</pre>
      </Modal>
      <Button onClick={() => setShow(true)}>
        <UserSecretIcon />
      </Button>
    </>
  );
}
