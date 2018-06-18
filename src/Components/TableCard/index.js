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
import {
  Grid,
  Row,
  Col,
  Card,
  CardHeading,
  CardTitle,
  CardBody
} from "patternfly-react";
import Spinner from "../Loading/Spinner";

export default function TableCard({
  title,
  headerButton,
  loading,
  children,
  empty
}) {
  return (
    <Grid fluid>
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeading>
              {headerButton}
              <CardTitle>{title}</CardTitle>
            </CardHeading>
            <CardBody className={loading ? "text-center" : ""}>
              {loading ? <Spinner /> : children}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Grid>
  );
}
