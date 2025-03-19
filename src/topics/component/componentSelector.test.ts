import { IComponent } from "types";
import { getPrincipalComponent } from "./componentSelector";

test("getPrincipalComponent OpenShift", () => {
  const components = [
    { id: "c1", display_name: "OpenShift 4.8.35", type: "ocp" },
    {
      id: "c2",
      display_name: "python3-dciclient 4.0.1-1.202503121102git6074135f.el8",
      type: "rpm",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "OpenShift 4.8.35",
    type: "ocp",
  });
  expect(getPrincipalComponent(components.reverse())).toEqual({
    id: "c1",
    display_name: "OpenShift 4.8.35",
    type: "ocp",
  });
});

test("getPrincipalComponent RHOS", () => {
  const components = [
    {
      id: "c1",
      display_name: "RHOS-17.1-RHEL-9-20250214.n.0",
      type: "compose",
    },
    {
      id: "c2",
      display_name: "python3-dciclient 4.0.1-1.202503121102git6074135f.el8",
      type: "rpm",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "RHOS-17.1-RHEL-9-20250214.n.0",
    type: "compose",
  });
});

test("getPrincipalComponent RHEL", () => {
  const components = [
    {
      id: "c1",
      display_name: "RHEL-8.2.0-20220311.1",
      type: "compose",
    },
    {
      id: "c2",
      display_name: "python3-dciclient 4.0.1-1.202503121102git6074135f.el8",
      type: "rpm",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "RHEL-8.2.0-20220311.1",
    type: "compose",
  });
});

test("getPrincipalComponent Microshift", () => {
  const components = [
    {
      id: "c1",
      display_name: "Microshift 4.16.0 ec.2",
      type: "repo",
    },
    {
      id: "c2",
      display_name: "python3-dciclient 4.0.1-1.202503121102git6074135f.el8",
      type: "rpm",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "Microshift 4.16.0 ec.2",
    type: "repo",
  });
});

test("nrt getPrincipalComponent doesn't returns other openshift component", () => {
  const components = [
    {
      id: "c2",
      display_name: "openshift-preflight beebfaf",
      type: "openshift-preflight",
    },
    { id: "c1", display_name: "OpenShift 4.8.35", type: "ocp" },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "OpenShift 4.8.35",
    type: "ocp",
  });
});
