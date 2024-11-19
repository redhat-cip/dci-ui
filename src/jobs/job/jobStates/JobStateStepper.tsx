import { IJobStateWithDuration } from "types";
import {
  ProgressStepper,
  ProgressStep,
  Button,
  Card,
  CardBody,
} from "@patternfly/react-core";

interface JobStateStepperProps {
  jobStates: IJobStateWithDuration[];
  jobStateSelected: (jobState: IJobStateWithDuration) => void;
  [x: string]: any;
}

export default function JobStateStepper({
  jobStates,
  jobStateSelected,
  ...props
}: JobStateStepperProps) {
  return (
    <Card {...props}>
      <CardBody>
        <ProgressStepper isCenterAligned className="pf-v6-u-pb-0 pf-v6-u-pt-md">
          {jobStates.map((jobState, i) => (
            <ProgressStep
              key={i}
              variant={jobState.pipelineStatus}
              id={jobState.status}
            >
              <Button
                variant="link"
                onClick={() => {
                  jobStateSelected(jobState);
                }}
              >
                {jobState.status}
              </Button>
            </ProgressStep>
          ))}
        </ProgressStepper>
      </CardBody>
    </Card>
  );
}
