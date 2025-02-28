export function getPrincipalComponent<T extends { display_name: string }>(
  components: T[],
) {
  return (
    components.find((component) => {
      const name = component.display_name.toLowerCase();
      return (
        /^openshift/.test(name) ||
        /^microshift/.test(name) ||
        name.indexOf("rhel-") !== -1 ||
        name.indexOf("rhos-") !== -1
      );
    }) || null
  );
}
