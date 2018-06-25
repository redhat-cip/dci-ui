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
import { connect } from "../../store";
import UserForm from "./UserForm";
import actions from "./actions";

export class NewUserForm extends React.Component {
  render() {
    return (
      <UserForm
        title="Create a new user"
        showModalButton="Create a new user"
        okButton="Create"
        submit={this.props.createUser}
        className={this.props.className}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createUser: user => dispatch(actions.create(user))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NewUserForm);
