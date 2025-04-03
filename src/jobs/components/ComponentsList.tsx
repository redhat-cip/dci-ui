import { Link } from "react-router";
import { sortByName } from "services/sort";
import { IComponent } from "types";

interface ComponentsListProps {
  components: Pick<IComponent, "id" | "topic_id" | "display_name">[];
}

export function ComponentsList({ components }: ComponentsListProps) {
  return (
    <div>
      {sortByName(components.map((c) => ({ ...c, name: c.display_name }))).map(
        (component) => (
          <div
            key={component.id}
            className="pf-v6-u-mt-xs"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Link
              to={`/topics/${component.topic_id}/components/${component.id}`}
            >
              {component.display_name}
            </Link>
          </div>
        ),
      )}
    </div>
  );
}
