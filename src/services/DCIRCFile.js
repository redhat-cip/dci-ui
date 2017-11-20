// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import FileSaver from "file-saver";

export default {
  download(identity, type) {
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
};
