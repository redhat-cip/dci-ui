import { renderWithProviders } from "utils/test-utils";
import TeamCreationWizard from "./TeamCreationWizard";
import { act, waitFor } from "@testing-library/react";

test("team creation wizard", async () => {
  const { user, findByRole, getByText, getByRole } = renderWithProviders(
    <TeamCreationWizard />,
  );

  const onboardingANewTeamButton = await findByRole("button", {
    name: /Onboarding a new team/i,
  });
  user.click(onboardingANewTeamButton);

  const nameTextbox = await findByRole("textbox", { name: /Name/i });
  await act(async () => {
    user.type(nameTextbox, "DCI team");
  });
  await waitFor(() => expect(nameTextbox).toHaveValue("DCI team"));

  const nextButton = await findByRole("button", { name: /Next/i });
  await waitFor(() => expect(nextButton).not.toBeDisabled());
  user.click(nextButton);
  await waitFor(() => expect(getByText("Team members")).toBeInTheDocument());
  const teamMembersTextarea = await findByRole("textbox", {
    name: /Team members/i,
  });
  user.type(teamMembersTextarea, "rh-login-1\nrh-login-2");
  await waitFor(() =>
    expect(teamMembersTextarea).toHaveValue("rh-login-1\nrh-login-2"),
  );
  user.click(nextButton);
  await waitFor(() =>
    expect(getByText("Product permissions")).toBeInTheDocument(),
  );
  const checkboxOpenShift = await findByRole("checkbox", {
    name: /OpenShift/i,
  });
  user.click(checkboxOpenShift);
  await waitFor(() => expect(checkboxOpenShift).toBeChecked());
  user.click(nextButton);

  await waitFor(() => {
    expect(getByText("DCI team")).toBeInTheDocument();
    expect(getByText("rh-login-1")).toBeInTheDocument();
    expect(getByText("rh-login-2")).toBeInTheDocument();
    expect(getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});
