import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty, uniqBy } from "lodash";
import { Page } from "layout";
import {
  Button,
  Card,
  CardBody,
  TextContent,
  PageSection,
  PageSectionVariants,
  Text,
  Tabs,
  Tab
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { EmptyState, FilterWithSearch } from "ui";
import {
  getProductsWithTeams,
  getTopicsWithTeams,
  getTeams,
  grantTeamProductPermission,
  grantTeamTopicPermission,
  removeTeamProductPermission,
  removeTeamTopicPermission
} from "./permissionsActions";

class AllowTeamToDownloadResource extends Component {
  state = {
    resource: null,
    team: null
  };
  render() {
    const { teams, resources, resource_name, onClick } = this.props;
    const { resource, team } = this.state;
    return (
      <div className="pf-u-my-xl">
        Allow{" "}
        <FilterWithSearch
          placeholder={isEmpty(team) ? "..." : team.name}
          filter={team}
          filters={teams}
          onFilterValueSelected={team => this.setState({ team: team })}
        />{" "}
        to download every components from{" "}
        <FilterWithSearch
          placeholder={isEmpty(resource) ? "..." : resource.name}
          filter={resource}
          filters={resources}
          onFilterValueSelected={resource =>
            this.setState({ resource: resource })
          }
        />
        {` ${resource_name}`}
        <Button
          variant="primary"
          className="pf-u-ml-xl"
          isDisabled={isEmpty(resource) || isEmpty(team)}
          onClick={() => onClick(team, resource)}
        >
          Confirm
        </Button>
      </div>
    );
  }
}

export class PermissionsPage extends Component {
  state = {
    activeTabKey: 0,
    isLoading: true,
    products: [],
    topics: [],
    teams: []
  };
  componentDidMount() {
    const { getTopicsWithTeams, getProductsWithTeams, getTeams } = this.props;
    Promise.all([
      getTopicsWithTeams(),
      getProductsWithTeams(),
      getTeams()
    ]).then(values =>
      this.setState({
        topics: values[0],
        products: values[1],
        teams: values[2],
        isLoading: false
      })
    );
  }
  handleTabClick = (event, tabIndex) => {
    this.setState({
      activeTabKey: tabIndex
    });
  };

  addTeamToResource = (resources_name, team, resource) => {
    this.setState(prevState => ({
      [resources_name]: prevState[resources_name].map(r => {
        if (r.id === resource.id) {
          r.teams = uniqBy([...r.teams, team], "id");
        }
        return r;
      })
    }));
  };

  removeTeamFromResource = (resources_name, team, resource) => {
    this.setState(prevState => ({
      [resources_name]: prevState[resources_name].map(r => {
        if (r.id === resource.id) {
          r.teams = r.teams.filter(t => t.id !== team.id);
        }
        return r;
      })
    }));
  };

  render() {
    const {
      currentUser,
      grantTeamProductPermission,
      grantTeamTopicPermission,
      removeTeamProductPermission,
      removeTeamTopicPermission
    } = this.props;
    const { isLoading, teams, topics, products } = this.state;
    const topicsNotExportControlReady = currentUser.isSuperAdmin
      ? topics
      : topics.filter(topic => !topic.export_control);
    return (
      <Page
        loading={isLoading}
        empty={!isLoading && isEmpty(teams)}
        HeaderSection={
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Permissions</Text>
              <Text component="p">
                On this page, you can grant teams permissions to access
                products.
                <br />
                Make sure the team has the rights before giving it permission to
                download components from a product.
              </Text>
            </TextContent>
          </PageSection>
        }
        EmptyComponent={
          <EmptyState
            title="There is no teams. You cannot manage permissions"
            info="Contact DCI administrator"
          />
        }
      >
        <Card>
          <CardBody>
            <Tabs
              activeKey={this.state.activeTabKey}
              onSelect={this.handleTabClick}
            >
              <Tab eventKey={0} title="Products Teams Permissions">
                <TextContent className="pf-u-mt-lg">
                  <Text component="p">
                    By giving access to a product, a team can download all GA
                    topics.
                    <br />
                    If you want to give access to a non-GA topic, you can use
                    the Products Topics Permissions tab.
                  </Text>
                </TextContent>
                <AllowTeamToDownloadResource
                  teams={teams}
                  resources={products}
                  resource_name="product"
                  onClick={(team, product) => {
                    grantTeamProductPermission(team, product).then(() =>
                      this.addTeamToResource("products", team, product)
                    );
                  }}
                />
                {products.map(product => (
                  <TextContent
                    key={`${product.id}.${product.etag}`}
                    className="pf-u-mt-lg"
                  >
                    <Text component="h1">{product.name}</Text>
                    <Text component="p">
                      List of teams that have access to {product.name}
                    </Text>
                    <table
                      class="pf-c-table pf-m-grid-md pf-m-compact"
                      role="grid"
                    >
                      <tbody>
                        {product.teams.map(team => (
                          <tr key={`${team.id}.${team.etag}`}>
                            <td className="pf-u-pl-0 pf-m-width-30">
                              {team.name}
                            </td>
                            <td className="pf-m-width-70">
                              <Button
                                variant="danger"
                                icon={<TrashIcon />}
                                onClick={() =>
                                  removeTeamProductPermission(
                                    team,
                                    product
                                  ).then(() =>
                                    this.removeTeamFromResource(
                                      "products",
                                      team,
                                      product
                                    )
                                  )
                                }
                              >
                                remove {team.name} permission
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TextContent>
                ))}
              </Tab>
              <Tab eventKey={1} title="Topics Teams Permissions">
                <TextContent className="pf-u-mt-lg">
                  <Text component="p">
                    By giving access to a topic not export control ready, a team
                    can download all components from this topic.
                    <br />
                    Make sure the team has the rights before giving it
                    permission to download a product.
                  </Text>
                </TextContent>
                <AllowTeamToDownloadResource
                  teams={teams}
                  resources={topicsNotExportControlReady}
                  resource_name="topic"
                  onClick={(team, topic) => {
                    grantTeamTopicPermission(team, topic).then(() =>
                      this.addTeamToResource("topics", team, topic)
                    );
                  }}
                />
                {topicsNotExportControlReady.map(topic => (
                  <TextContent
                    key={`${topic.id}.${topic.etag}`}
                    className="pf-u-mt-lg"
                  >
                    <Text component="h1">{topic.name}</Text>
                    <Text component="p">
                      List of teams that have access to {topic.name}
                    </Text>
                    <table
                      class="pf-c-table pf-m-grid-md pf-m-compact"
                      role="grid"
                    >
                      <tbody>
                        {topic.teams.map(team => (
                          <tr key={`${team.id}.${team.etag}`}>
                            <td className="pf-u-pl-0 pf-m-width-30">
                              {team.name}
                            </td>
                            <td className="pf-m-width-70">
                              <Button
                                variant="danger"
                                icon={<TrashIcon />}
                                onClick={() => {
                                  removeTeamTopicPermission(team, topic).then(
                                    () =>
                                      this.removeTeamFromResource(
                                        "topics",
                                        team,
                                        topic
                                      )
                                  );
                                }}
                              >
                                remove {team.name} permission
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TextContent>
                ))}
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTeams: () => dispatch(getTeams()),
    getTopicsWithTeams: () => dispatch(getTopicsWithTeams()),
    getProductsWithTeams: () => dispatch(getProductsWithTeams()),
    grantTeamProductPermission: (team, topic) =>
      dispatch(grantTeamProductPermission(team, topic)),
    grantTeamTopicPermission: (team, topic) =>
      dispatch(grantTeamTopicPermission(team, topic)),
    removeTeamProductPermission: (team, topic) =>
      dispatch(removeTeamProductPermission(team, topic)),
    removeTeamTopicPermission: (team, topic) =>
      dispatch(removeTeamTopicPermission(team, topic))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionsPage);
