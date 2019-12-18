import React, { Component } from "react";
import { connect } from "react-redux";
import TopicForm from "./TopicForm";
import actions from "./topicsActions";
import { EditAltIcon } from "@patternfly/react-icons";

export class EditTopicButton extends Component {
  render() {
    const { topic, editTopic, ...props } = this.props;
    return (
      <TopicForm
        {...props}
        title="Edit topic"
        topic={topic}
        showModalButton={<EditAltIcon />}
        okButton="Edit"
        submit={newTopic => {
          editTopic({
            id: topic.id,
            ...newTopic
          });
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

export default connect(null, mapDispatchToProps)(EditTopicButton);
