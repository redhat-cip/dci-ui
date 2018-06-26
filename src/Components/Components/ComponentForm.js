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
import FormModal from "../FormModal";
import { Button } from "patternfly-react";
import Formsy from "formsy-react";
import Input from "../Form/Input";
import Checkbox from "../Form/Checkbox";
import Select from "../Form/Select";
import { getComponents } from "./selectors";

export class ComponentForm extends React.Component {
  constructor(props) {
    super(props);
    const initialComponent = { name: "", parent_id: null, external: true };
    this.state = {
      canSubmit: false,
      show: false,
      component: {
        ...initialComponent,
        ...this.props.component
      }
    };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <React.Fragment>
        <FormModal
          title={this.props.title}
          okButton={this.props.okButton}
          formRef="componentForm"
          canSubmit={this.state.canSubmit}
          show={this.state.show}
          close={this.closeModal}
        >
          <Formsy
            id="componentForm"
            onValidSubmit={component => {
              this.closeModal();
              this.props.submit(component);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <Input
              label="Name"
              name="name"
              value={this.state.component.name}
              required
            />
            <Select
              label="Parent component"
              name="parent_id"
              options={this.props.components}
              value={this.state.component.parent_id}
              required
            />
            <Checkbox
              label="Partner"
              name="external"
              value={this.state.component.external}
            />
          </Formsy>
        </FormModal>
        <Button
          bsStyle="primary"
          className={this.props.className}
          onClick={this.showModal}
        >
          {this.props.showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    components: getComponents(state)
  };
}

export default connect(mapStateToProps)(ComponentForm);
