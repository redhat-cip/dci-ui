import { IComponent } from "types";
import { getPrincipalComponent } from "./componentSelector";

test("getPrincipalComponent OpenShift", () => {
  const components = [
    { canonical_project_name: "OpenShift 4.8.35", name: "4.8.35" },
    {
      canonical_project_name: "python3-openshift 0.11.2-1.el8",
      name: "python3-openshift 0.11.2-1.el8",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    canonical_project_name: "OpenShift 4.8.35",
    name: "4.8.35",
  });
  expect(getPrincipalComponent(components.reverse())).toEqual({
    canonical_project_name: "OpenShift 4.8.35",
    name: "4.8.35",
  });
});

test("getPrincipalComponent RHOS", () => {
  const components = [
    {
      canonical_project_name: "16.2-RHEL-8",
      name: "RHOS-16.2-RHEL-8-20220329.n.2",
    },
    {
      canonical_project_name: "python3-swift 0.11.2-1.el8",
      name: "python3-swift 0.11.2-1.el8",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    canonical_project_name: "16.2-RHEL-8",
    name: "RHOS-16.2-RHEL-8-20220329.n.2",
  });
});

test("getPrincipalComponent RHEL", () => {
  const components = [
    {
      canonical_project_name: "RHEL-8.2.0-20220311.1",
      name: "RHEL-8.2.0-20220311.1",
    },
    {
      canonical_project_name: "python3-swift 0.11.2-1.el8",
      name: "python3-swift 0.11.2-1.el8",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    canonical_project_name: "RHEL-8.2.0-20220311.1",
    name: "RHEL-8.2.0-20220311.1",
  });
});
