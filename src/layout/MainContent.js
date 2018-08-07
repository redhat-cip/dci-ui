import React from "react";
import { HorizontalNavigation, VerticalNavigation } from "../navigation";
import { Grid, Row, Col } from "patternfly-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RightContainer from "./RightContainer";
import Page from "./Page";
import SiteContent from "./SiteContent";

export default function MainContent({ children }) {
  return (
    <SiteContent>
      <Page>
        <Header>
          <HorizontalNavigation />
        </Header>
        <Sidebar>
          <VerticalNavigation />
        </Sidebar>
        <RightContainer>
          <Grid fluid>
            <Row>
              <Col xs={12}>{children}</Col>
            </Row>
          </Grid>
        </RightContainer>
      </Page>
    </SiteContent>
  );
}
