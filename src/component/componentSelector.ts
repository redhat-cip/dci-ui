import { IComponent } from "types";

export function getPrincipalComponent(components: IComponent[]) {
  return (
    components.find((component) => {
      const name = component.display_name.toLowerCase();
      return (
        /^openshift/.test(name) ||
        name.indexOf("rhel-") !== -1 ||
        name.indexOf("rhos-") !== -1
      );
    }) || null
  );
}
