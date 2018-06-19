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
import {
  Grid,
  Row,
  Col,
  Card,
  CardHeading,
  CardTitle,
  CardBody
} from "patternfly-react";
import Spinner from "./Loading/Spinner";

export default class TableCard extends React.Component {
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeading>
                {this.props.HeaderButton}
                <CardTitle>{this.props.title}</CardTitle>
              </CardHeading>
              <CardBody className={this.props.loading ? "text-center" : ""}>
                {this.props.loading ? <Spinner /> : null}
                {!this.props.loading && this.props.empty
                  ? this.props.EmptyComponent
                  : null}
                {!this.props.loading && !this.props.empty
                  ? this.props.children
                  : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}

TableCard.propTypes = {
  title: PropTypes.string.isRequired,
  HeaderButton: PropTypes.element,
  loading: PropTypes.bool,
  empty: PropTypes.bool,
  EmptyComponent: PropTypes.element
};
