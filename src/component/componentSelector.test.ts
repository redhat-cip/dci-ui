import { IComponent } from "types";
import { getPrincipalComponent } from "./componentSelector";

test("getPrincipalComponent OpenShift", () => {
  const components = [
    { id: "c1", display_name: "OpenShift 4.8.35" },
    {
      id: "c2",
      display_name: "python3-openshift 0.11.2-1.el8",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "OpenShift 4.8.35",
  });
  expect(getPrincipalComponent(components.reverse())).toEqual({
    id: "c1",
    display_name: "OpenShift 4.8.35",
  });
});

test("getPrincipalComponent RHOS", () => {
  const components = [
    {
      id: "c1",
      display_name: "16.2-RHEL-8",
    },
    {
      id: "c2",
      display_name: "python3-swift 0.11.2-1.el8",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "16.2-RHEL-8",
  });
});

test("getPrincipalComponent RHEL", () => {
  const components = [
    {
      id: "c1",
      display_name: "RHEL-8.2.0-20220311.1",
    },
    {
      id: "c2",
      display_name: "python3-swift 0.11.2-1.el8",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "RHEL-8.2.0-20220311.1",
  });
});

test("getPrincipalComponent Microshift", () => {
  const components = [
    {
      id: "c1",
      display_name: "Microshift 4.16.0 ec.2",
    },
  ] as IComponent[];

  expect(getPrincipalComponent(components)).toEqual({
    id: "c1",
    display_name: "Microshift 4.16.0 ec.2",
  });
});
