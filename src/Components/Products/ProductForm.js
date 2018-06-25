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
import Select from "../Form/Select";
import { getProducts } from "./selectors";
import { getTeams } from "../Teams/selectors";

export class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    const initialProduct = { name: "" };
    this.state = {
      canSubmit: false,
      show: false,
      product: {
        ...initialProduct,
        ...this.props.product
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
    const {
      title,
      okButton,
      submit,
      className,
      showModalButton,
      teams
    } = this.props;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="product-form"
          canSubmit={this.state.canSubmit}
          show={this.state.show}
          close={this.closeModal}
        >
          <Formsy
            id="product-form"
            onValidSubmit={product => {
              this.closeModal();
              submit(product);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <Input
              label="Name"
              name="name"
              value={this.state.product.name}
              required
            />
            <Input
              label="Description"
              name="description"
              value={this.state.product.description}
            />
            {_.isEmpty(teams) ? null : (
              <Select
                id="product-form__team"
                label="Team Owner"
                name="team_id"
                options={teams}
                value={this.state.product.team_id || teams[0].id}
                required
              />
            )}
          </Formsy>
        </FormModal>
        <Button
          bsStyle="primary"
          className={className}
          onClick={this.showModal}
        >
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    teams: getTeams(state)
  };
}

export default connect(mapStateToProps)(ProductForm);
