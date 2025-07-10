import { useState } from "react";
import { Label } from "@patternfly/react-core";
import { Link } from "react-router";
import { CubesIcon, EyeIcon, EyeSlashIcon } from "@patternfly/react-icons";
import styled from "styled-components";
import type { IComponent } from "types";
import { sortByMainComponentType } from "services/sort";

const Component = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
interface ComponentsListInJobRowProps {
  components: IComponent[];
}
export default function ComponentsListInJobRow({
  components,
}: ComponentsListInJobRowProps) {
  const [showMore, setShowMore] = useState(false);
  const maxNumberElements = Math.min(4, components.length);
  const showMoreButton = components.length > maxNumberElements;
  const sortedComponents = sortByMainComponentType(
    components.map((c) => ({ ...c, name: c.display_name })),
  );
  const nFirstComponents = sortedComponents.slice(0, maxNumberElements);
  const remainingComponents = sortedComponents.slice(maxNumberElements);
  return (
    <div>
      {nFirstComponents.map((component) => (
        <Component key={component.id} className="pf-v6-u-mt-xs">
          <Link to={`/components/${component.id}`}>
            <CubesIcon className="pf-v6-u-mr-xs" />
            {component.display_name}
          </Link>
        </Component>
      ))}
      {showMore ? (
        <>
          {remainingComponents.map((component) => (
            <Component key={component.id} className="pf-v6-u-mt-xs">
              <Link to={`/components/${component.id}`}>
                <CubesIcon className="pf-v6-u-mr-xs" />
                {component.display_name}
              </Link>
            </Component>
          ))}
          <Label
            isCompact
            onClick={() => setShowMore(false)}
            className="pf-v6-u-mt-xs"
            icon={<EyeSlashIcon />}
          >
            Show less
          </Label>
        </>
      ) : (
        showMoreButton && (
          <Label
            isCompact
            onClick={() => setShowMore(true)}
            className="pf-v6-u-mt-xs"
            icon={<EyeIcon />}
          >
            Show all
          </Label>
        )
      )}
    </div>
  );
}
