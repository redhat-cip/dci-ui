import React, { Component } from "react";
import { Button, Flex } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input } from "form";

export default class JobSelectorForm extends Component {
  constructor(props) {
    super(props);
    const { initialData } = this.props;
    const { base_job_id = null, job_id = null } = initialData;

    this.state = {
      canSubmit: false,
      base_job_id,
      job_id
    };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { submit } = this.props;
    const { base_job_id, job_id, canSubmit } = this.state;
    return (
      <Formsy
        id="performance-job-selector-form"
        className="pf-c-form"
        onValidSubmit={submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <Flex>
          <Input
            id="performance-job-selector-form__base_job_id"
            label="First job id"
            name="base_job_id"
            type="text"
            value={base_job_id}
            required
          />
          <Input
            id="performance-job-selector-form__job_id"
            label="Second job id"
            name="job_id"
            type="text"
            value={job_id}
            required
          />
          <Flex breakpointMods={[{ modifier: "align-self-flex-end" }]}>
            <Button
              type="submit"
              variant="primary"
              isDisabled={!canSubmit}
              className="pf-u-mb-xs"
            >
              See performance results
            </Button>
          </Flex>
        </Flex>
      </Formsy>
    );
  }
}
