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
import TopicForm from "./TopicForm";
import actions from "./actions";

export class NewTopicForm extends React.Component {
  render() {
    return (
      <TopicForm
        title="Create a new topic"
        showModalButton="Create a new topic"
        okButton="Create"
        submit={this.props.createTopic}
        className={this.props.className}
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
)(NewTopicForm);
