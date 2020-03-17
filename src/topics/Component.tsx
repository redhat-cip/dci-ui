import React from "react";
import { isEmpty } from "lodash";
import { CubesIcon } from "@patternfly/react-icons";
import styled from "styled-components";
import { Badge } from "@patternfly/react-core";

type ComponentDTO = {
  name: string;
  type: string;
  data: {
    version: string;
    arches: string[];
    channel: string;
    tags: string[];
  };
};

const ComponentContainer = styled.div`
  width: 100%
  padding:1em;
  display:flex;
  align-items:center;
  border-bottom: ${(props: { isLast: boolean }) =>
    props.isLast ? "none" : "1px solid #d2d2d2"};
`;

const ComponentIcon = styled(CubesIcon)`
  margin-right: 1em;
`;

const ComponentInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Component = ({
  component,
  isLast
}: {
  component: ComponentDTO;
  isLast: boolean;
}) => {
  const { name, data } = component;
  const { version = null, arches = [], channel = null, tags = [] } = data;
  return (
    <ComponentContainer isLast={isLast}>
      <ComponentIcon />
      <ComponentInfo>
        <div>{name}</div>
        {isEmpty(version) &&
        isEmpty(arches) &&
        isEmpty(channel) &&
        isEmpty(tags) ? null : (
          <div>
            <Badge className="pf-u-mr-sm pf-u-mb-sm">version: {version}</Badge>
            {channel && (
              <Badge className="pf-u-mr-sm pf-u-mb-sm">
                channel: {channel}
              </Badge>
            )}
            {arches.map((arch, i) => (
              <Badge key={i} className="pf-u-mr-sm pf-u-mb-sm">
                {arch}
              </Badge>
            ))}
            {tags.map((tag, i) => (
              <Badge key={i} className="pf-u-mr-sm pf-u-mb-sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </ComponentInfo>
    </ComponentContainer>
  );
};

export default Component;
