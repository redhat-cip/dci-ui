import React, {Component} from "react";
import { connect } from "react-redux";
import TopicForm from "./TopicForm";
import actions from "./topicsActions";

export class EditTopicButton extends Component {
  render() {
    return (
      <TopicForm
        title="Edit topic"
        topic={this.props.topic}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        submit={topic => {
          const newTopic = {
            id: this.props.topic.id,
            ...topic
          };
          this.props.editTopic(newTopic);
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
