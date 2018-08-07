import FileSaver from "file-saver";

export function downloadRCFile(identity, type) {
  const date = new Date().toISOString();
  const fileName = `${type}rc.sh`;
  const content = `#!/usr/bin/env bash
# ${fileName} file generated on https://www.distributed-ci.io/ ${date}
DCI_CLIENT_ID='${type}/${identity.id}'
DCI_API_SECRET='${identity.api_secret}'
DCI_CS_URL='https://api.distributed-ci.io/'
export DCI_CLIENT_ID
export DCI_API_SECRET
export DCI_CS_URL`;
  const blob = new Blob([content], { type: "application/x-shellscript" });
  FileSaver.saveAs(blob, fileName);
}
