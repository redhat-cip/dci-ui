import React, { Component } from "react";
import { connect } from "react-redux";
import TopicForm from "./TopicForm";
import actions from "./topicsActions";

export class EditTopicButton extends Component {
  render() {
    const { topic, editTopic, ...props } = this.props;
    return (
      <TopicForm
        {...props}
        title="Edit topic"
        topic={topic}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        submit={topic => {
          const newTopic = {
            id: topic.id,
            ...topic
          };
          editTopic(newTopic);
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editTopic: topic => dispatch(actions.update(topic))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditTopicButton);
