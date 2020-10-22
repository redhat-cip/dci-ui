import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { ITopic } from "types";
import TopicForm from "./TopicForm";
import actions from "./topicsActions";

interface EditTopicButtonProps {
  topic: ITopic;
  [x: string]: any;
}

export default function EditTopicButton({
  topic,
  ...props
}: EditTopicButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  if (!topic) return null;

  return (
    <TopicForm
      {...props}
      title="Edit topic"
      topic={topic}
      showModalButton="Edit"
      okButton="Edit"
      submit={(t: ITopic) => {
        const { id, ...newTopic } = t;
        dispatch(
          actions.update({
            id: topic.id,
            ...newTopic,
          })
        );
      }}
    />
  );
}
