import React from "react";
import styled from "styled-components";
import { colors } from "styles";
import { ContainerFluid, Row, Col } from "components/Grid";

const Title = styled.h1`
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.black100};
`;

export default function({ title }) {
  return (
    <ContainerFluid>
      <Row>
        <Col>
          <Title>{title}</Title>
        </Col>
      </Row>
    </ContainerFluid>
  );
}
