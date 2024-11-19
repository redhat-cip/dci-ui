import { Button } from "@patternfly/react-core";
import { Modal, ModalVariant } from "@patternfly/react-core/deprecated";
import { Wizard, WizardStep } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TeamMembersForm, { TeamMembersFormSchema } from "./TeamMembersForm";
import TeamPermissionForm from "./TeamPermissionForm";
import { Formik } from "formik";
import CreateTeamForm, { CreateTeamFormSchema } from "./CreateTeamForm";
import TeamCreationWizardReviewStep from "./TeamCreationWizardReviewStep";
import CreateTeamWithMembers from "./CreateTeamWithMembers";

const TeamCreationWizardSchema = CreateTeamFormSchema.concat(
  TeamMembersFormSchema,
);

export default function TeamCreationWizard() {
  const { isOpen, show, hide } = useModal(false);
  return (
    <div>
      <Button variant="secondary" onClick={show}>
        Onboarding a new team
      </Button>
      <Formik
        initialValues={{
          name: "",
          external: true,
          teamMembers: "",
          permissions: {},
        }}
        validationSchema={TeamCreationWizardSchema}
        onSubmit={() => {}}
      >
        {({ isValid, dirty }) => (
          <Modal
            isOpen={isOpen}
            showClose={false}
            aria-label="Team creation wizard modal"
            hasNoBodyWrapper
            onEscapePress={() => show()}
            variant={ModalVariant.medium}
          >
            <Wizard title="Team creation" onClose={hide}>
              <WizardStep
                id="wizard-step-create-team"
                name="Create team"
                footer={{ isNextDisabled: !(isValid && dirty) }}
              >
                <CreateTeamForm />
              </WizardStep>
              <WizardStep
                id="wizard-step-add-user"
                name="Add users"
                footer={{ isNextDisabled: !(isValid && dirty) }}
              >
                <TeamMembersForm />
              </WizardStep>
              <WizardStep
                id="wizard-step-set-permissions"
                name="Set permissions"
                footer={{ isNextDisabled: !(isValid && dirty) }}
              >
                <TeamPermissionForm />
              </WizardStep>
              <WizardStep
                id="wizard-step-review"
                name="Review"
                footer={{ isNextDisabled: !(isValid && dirty) }}
              >
                <TeamCreationWizardReviewStep />
              </WizardStep>
              <WizardStep
                id="wizard-step-finish"
                name="Finish"
                footer={{ nextButtonText: "Finish" }}
              >
                <CreateTeamWithMembers close={hide} />
              </WizardStep>
            </Wizard>
          </Modal>
        )}
      </Formik>
    </div>
  );
}
