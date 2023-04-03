import { CubesIcon } from "@patternfly/react-icons";
import styled from "styled-components";
import { Label } from "@patternfly/react-core";
import { IComponent } from "types";
import { Link } from "react-router-dom";

const ComponentContainer = styled.div`
  width: 100%
  padding:1em;
  display:flex;
  align-items:center;
  border: 1px solid #d2d2d2;
  border-radius: 0.5em;
  margin-bottom: 1em;
`;

const IconBox = styled.div`
  padding: 0 1em;
`;

const ComponentInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.5em;
`;

interface ComponentProps {
  component: IComponent;
}

export default function Component({ component }: ComponentProps) {
  const { id, display_name, type, tags = [], topic_id } = component;
  return (
    <ComponentContainer>
      <IconBox>
        <CubesIcon />
      </IconBox>
      <ComponentInfo>
        <Link to={`/topics/${topic_id}/components/${id}`}>{display_name}</Link>
        <div>{type}</div>
        <div>
          {tags &&
            tags.map((tag, i) => (
              <Label isCompact key={i} className="mt-xs mr-xs" color="blue">
                {tag}
              </Label>
            ))}
        </div>
      </ComponentInfo>
    </ComponentContainer>
  );
}
