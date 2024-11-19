import { renderWithProviders } from "__tests__/renders";
import TeamCreationWizard from "./TeamCreationWizard";
import { waitFor } from "@testing-library/react";

test("team creation wizard", async () => {
  const { user, findByRole, getByText, getByRole } = renderWithProviders(
    <TeamCreationWizard />,
  );
  const onboardingANewTeamButton = await findByRole("button", {
    name: /Onboarding a new team/i,
  });
  await user.click(onboardingANewTeamButton);
  await user.type(getByRole("textbox", { name: /name/i }), "DCI team");
  await user.click(getByRole("button", { name: /next/i }));
  await user.type(
    getByRole("textbox", { name: /team members/i }),
    "rh-login-1\nrh-login-2",
  );
  await user.click(getByRole("button", { name: /next/i }));
  await waitFor(() => {
    expect(getByRole("checkbox", { name: /openshift/i })).toBeInTheDocument();
  });
  await user.click(getByRole("checkbox", { name: /openshift/i }));
  await user.click(getByRole("button", { name: /next/i }));
  await waitFor(() => {
    expect(getByText("DCI team")).toBeInTheDocument();
    expect(getByText("rh-login-1")).toBeInTheDocument();
    expect(getByText("rh-login-2")).toBeInTheDocument();
  });
});
