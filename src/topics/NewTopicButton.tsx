import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { ITopic } from "types";
import TopicForm from "./TopicForm";
import actions from "./topicsActions";

interface NewTopicButtonProps {
  [x: string]: any;
}

export default function NewTopicButton({ ...props }: NewTopicButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <TopicForm
      title="Create a new topic"
      showModalButton="Create a new topic"
      okButton="Create"
      submit={(topic: ITopic) => dispatch(actions.create(topic))}
      {...props}
    />
  );
}
