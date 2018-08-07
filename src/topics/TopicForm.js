import React, { Component } from "react";
import { connect } from "react-redux";
import FormModal from "../FormModal";
import { Button } from "patternfly-react";
import Formsy from "formsy-react";
import { Input, Select, TextareaJSON, HiddenInput } from "../form";
import { getProducts } from "../products/productSelectors";
import { getTopics } from "./topicsSelectors";
import { isEmpty } from "lodash";

export class TopicForm extends Component {
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
            <HiddenInput
              id="topic-form__etag"
              name="etag"
              value={this.state.topic.etag}
            />
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
              name="next_topic_id"
              options={topics}
              value={this.state.topic.next_topic_id}
            />
            {isEmpty(products) ? null : (
              <Select
                id="topic-form__product_id"
                label="Product"
                name="product_id"
                options={products}
                value={this.state.topic.product_id || products[0].id}
                required
              />
            )}
            <TextareaJSON
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
