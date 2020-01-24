import React, { Component } from "react";
import { Button, Form } from "@patternfly/react-core";
import { map, trim } from "lodash";
import Formsy from "formsy-react";
import { TextArea } from "ui/form";

export default class JobSelectorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false
    };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { submit, initialData } = this.props;
    const { canSubmit } = this.state;
    const { jobs_ids = [] } = initialData;
    return (
      <Formsy
        id="performance-job-selector-form"
        onValidSubmit={v => {
          const trimedLines = map(v.jobs_ids.split("\n"), trim);
          submit({ jobs_ids: trimedLines });
        }}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <Form>
          <TextArea
            id="performance-job-selector-form__jobs_ids"
            label="Jobs ids"
            name="jobs_ids"
            placeholder="List of jobs you want to compare. One job per line. First job id is used as a base."
            required
            value={jobs_ids.join("\n")}
          />
          <Button
            type="submit"
            variant="primary"
            isDisabled={!canSubmit}
            className="pf-u-mb-xs"
          >
            See performance results
          </Button>
        </Form>
      </Formsy>
    );
  }
}
