import { JobsTableListColumn } from "types";

const columnLabels: { [k in JobsTableListColumn]: string } = {
  name: "Name",
  status: "Status",
  config: "Config",
  team: "Team",
  remoteci: "Remoteci",
  topic: "Topic",
  component: "Component",
  components: "Components",
  tags: "Tags",
  duration: "Duration",
  last_run: "Last run",
};

export default columnLabels;
