import React, { Component } from "react";
import Formsy from "formsy-react";
import { Input, Checkbox, HiddenInput } from "ui/form";
import { Form } from "@patternfly/react-core";

export default class TeamForm extends Component {
  render() {
    const {
      id = "team-form",
      team,
      onValidSubmit,
      onValid,
      onInvalid,
      ...props
    } = this.props;
    return (
      <Formsy
        id={id}
        onValidSubmit={newTeam =>
          onValidSubmit({
            ...newTeam,
            state: newTeam.state ? "active" : "inactive"
          })
        }
        onValid={onValid}
        onInvalid={onInvalid}
        {...props}
      >
        <Form>
          {team.etag && (
            <HiddenInput id={`${id}__etag`} name="etag" value={team.etag} />
          )}
          <Input
            id={`${id}__name`}
            label="Name"
            name="name"
            value={team.name}
            required
          />
          <Checkbox
            id={`${id}__state`}
            label="Active"
            name="state"
            value={team.state === "active"}
          />
          <Checkbox
            id={`${id}__external`}
            label="Partner"
            name="external"
            value={team.external}
          />
        </Form>
      </Formsy>
    );
  }
}
