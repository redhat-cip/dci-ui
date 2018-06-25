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
import React from "react";
import { Button } from "patternfly-react";
import ConfirmModal from "../ConfirmModal";
import { connect } from "../../store";
import actions from "./actions";

export class DeleteUserButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { user } = this.props;
    return (
      <React.Fragment>
        <ConfirmModal
          title={`Delete user ${user.name}`}
          okButton={`Yes delete ${user.name}`}
          cancelButton="oups no!"
          show={this.state.show}
          close={this.closeModal}
          onValidSubmit={() => {
            this.closeModal();
            this.props.deleteUser(user);
          }}
        >
          {`Are you sure you want to delete ${user.name}?`}
        </ConfirmModal>
        <Button
          bsStyle="danger"
          className={this.props.className}
          onClick={this.showModal}
        >
          <i className="fa fa-trash" />
        </Button>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteUser: user => dispatch(actions.delete(user))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(DeleteUserButton);
