// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "styles";
import { ContainerFluid, Row, Col } from "components/Grid";

const Title = styled.h1`
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.black100};
`;

export default function TitleContainer({ title }) {
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

TitleContainer.propTypes = {
  title: PropTypes.string.isRequired
};
