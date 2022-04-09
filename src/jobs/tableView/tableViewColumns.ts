import { JobsTableListColumn } from "types";

const columnLabels: { [k in JobsTableListColumn]: string } = {
  id: "Id",
  name: "Name",
  config: "Config",
  team: "Team",
  remoteci: "Remoteci",
  topic: "Topic",
  component: "Component",
  components: "Components",
  tests: "Tests",
  tags: "Tags",
  created_at: "Created at",
  duration: "Duration",
  last_run: "Last run",
};

export default columnLabels;
