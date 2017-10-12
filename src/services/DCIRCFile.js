import FileSaver from "file-saver";

export default {
  download(identity) {
    const date = new Date().toISOString();
    const content = `#!/usr/bin/env bash
# dcirc.sh file generated on https://www.distributed-ci.io/ ${date}
DCI_CLIENT_ID='${identity.id}'
DCI_API_SECRET='${identity.api_secret}'
DCI_CS_URL='https://api.distributed-ci.io/'
export DCI_CLIENT_ID
export DCI_API_SECRET
export DCI_CS_URL`;
    const blob = new Blob([content], { type: "application/x-shellscript" });
    FileSaver.saveAs(blob, `dcirc.sh`);
  }
};
