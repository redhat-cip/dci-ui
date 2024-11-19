import {
  Banner,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useFormikContext } from "formik";
import { TeamCreationWizardValues } from "./TeamCreationWizardTypes";
import { splitTeamMembersString } from "./TeamMembersForm";

export default function TeamCreationWizardReviewStep() {
  const { values, isValid, dirty } =
    useFormikContext<TeamCreationWizardValues>();
  const productsAuthorized = Object.values(values.permissions);
  return (
    <div>
      {!(isValid && dirty) ? (
        <Banner screenReaderText="Team creation wizard form error" color="red">
          <Flex spaceItems={{ default: "spaceItemsSm" }}>
            <FlexItem>
              <ExclamationCircleIcon />
            </FlexItem>
            <FlexItem>There are errors in your team creation form</FlexItem>
          </Flex>
        </Banner>
      ) : (
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Team name</DescriptionListTerm>
            <DescriptionListDescription>
              {values.name}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Content access</DescriptionListTerm>
            <DescriptionListDescription>
              {values.has_pre_release_access
                ? "pre release content access"
                : "no pre release content access"}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>List of users</DescriptionListTerm>
            <DescriptionListDescription>
              <ul>
                {splitTeamMembersString(values.teamMembers).map(
                  (memberEmail, index) => (
                    <li key={index}>{memberEmail}</li>
                  ),
                )}
              </ul>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Permissions</DescriptionListTerm>
            <DescriptionListDescription>
              {productsAuthorized.length > 0
                ? `The ${
                    values.name
                  } team will have access to all components from ${productsAuthorized
                    .map((p) => p.name)
                    .join(" and ")} product${
                    productsAuthorized.length > 1 ? "s" : ""
                  }`
                : `The ${values.name} team does not have access to any product. Are you sure ?`}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      )}
    </div>
  );
}
