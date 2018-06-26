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
import Textarea from "../Form/TextareaJSON";
import { getProducts } from "../Products/selectors";
import { getTopics } from "./selectors";
import _ from "lodash";

export class TopicForm extends React.Component {
  constructor(props) {
    super(props);
    const initialTopic = { name: "" };
    this.state = {
      canSubmit: false,
      show: false,
      topic: {
        ...initialTopic,
        ...this.props.topic
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
      topics,
      products,
      className,
      showModalButton
    } = this.props;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="topic-form"
          canSubmit={this.state.canSubmit}
          show={this.state.show}
          close={this.closeModal}
        >
          <Formsy
            id="topic-form"
            onValidSubmit={topic => {
              this.closeModal();
              submit(topic);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <Input
              id="topic-form__name"
              label="Name"
              name="name"
              value={this.state.topic.name}
              required
            />
            <Select
              id="topic-form__next_topic"
              label="Next topic"
              name="next_topic"
              options={topics}
              value={this.state.topic.next_topic}
            />
            {_.isEmpty(products) ? null : (
              <Select
                id="topic-form__product_id"
                label="Product"
                name="product_id"
                options={products}
                value={this.state.topic.product_id || products[0].id}
                required
              />
            )}
            <Textarea
              id="topic-form__component_types"
              label="Component types"
              name="component_types"
              required
              validations="isJSON"
              validationError="Component types should be a valid JSON"
              value={this.state.topic.component_types || []}
            />
          </Formsy>
        </FormModal>
        <Button
          id="topics-screen__show-modal-button"
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
    topics: getTopics(state)
  };
}

export default connect(mapStateToProps)(TopicForm);
