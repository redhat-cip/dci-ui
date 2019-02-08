import React, { Component } from "react";
import { connect } from "react-redux";
import TopicForm from "./TopicForm";
import actions from "./topicsActions";

export class NewTopicButton extends Component {
  render() {
    const {createTopic,className}=this.props
    return (
      <TopicForm
        title="Create a new topic"
        showModalButton="Create a new topic"
        okButton="Create"
        submit={createTopic}
        className={className}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTopic: topic => dispatch(actions.create(topic))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NewTopicButton);
