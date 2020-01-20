import React from "react";
import { useDispatch } from "react-redux";
import TopicForm from "./TopicForm";
import actions from "./topicsActions";

const EditTopicButton = ({ topic, ...props }) => {
  const dispatch = useDispatch();
  if (!topic) return null;

  return (
    <TopicForm
      {...props}
      title="Edit topic"
      topic={topic}
      showModalButton="Edit"
      okButton="Edit"
      submit={newTopic =>
        dispatch(
          actions.update({
            id: topic.id,
            ...newTopic
          })
        )
      }
    />
  );
};

export default EditTopicButton;
