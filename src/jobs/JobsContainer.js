import React, { Component } from "react";
import { connect } from "react-redux";
import {
  PaginationRow,
  Row,
  Col,
  Card,
  CardHeading,
  CardTitle,
  CardBody,
  ListView
} from "patternfly-react";
import jobsActions from "./jobsActions";
import teamsActions from "../teams/teamsActions";
import { getJobs } from "./jobsSelectors";
import { getTeams } from "../teams/teamsSelectors";
import JobSummary from "./JobSummary";
import queryString from "query-string";
import { isEmpty } from "lodash";
import { MainContentWithLoader } from "../layout";
import FilterJobs from "./FilterJobs";

export class JobsContainer extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const { page, perPage, remoteci_id } = queryString.parse(location.search);
    this.state = {
      pagination: {
        page: page ? parseInt(page, 10) : 1,
        perPage: perPage ? parseInt(perPage, 10) : 10,
        perPageOptions: [10, 20, 50]
      },
      remoteci_id
    };
  }

  componentDidMount() {
    const { fetchTeams } = this.props;
    fetchTeams();
    this._fetchJobsAndChangeUrl(this.state);
  }

  _fetchJobsAndChangeUrl = () => {
    const { history, fetchJobs } = this.props;
    const { pagination, remoteci_id } = this.state;
    let url = `/jobs?page=${pagination.page}&perPage=${pagination.perPage}`;
    if (remoteci_id) {
      url += `&remoteci_id=${remoteci_id}`;
    }
    history.push(url);
    fetchJobs({ pagination, remoteci_id });
  };

  _setPageAndFetchJobs = page => {
    this.setState(
      prevState => {
        return {
          pagination: {
            ...prevState.pagination,
            page
          }
        };
      },
      () => this._fetchJobsAndChangeUrl()
    );
  };

  _onPerPageSelect = perPage => {
    this.setState(
      prevState => {
        return {
          pagination: {
            ...prevState.pagination,
            page: 1,
            perPage
          }
        };
      },
      () => this._fetchJobsAndChangeUrl()
    );
  };

  _setRemoteciAndFetchJobs = remoteci_id => {
    this.setState(
      prevState => {
        return {
          pagination: {
            ...prevState.pagination,
            page: 1
          },
          remoteci_id
        };
      },
      () => this._fetchJobsAndChangeUrl()
    );
  };

  render() {
    const { jobs, isFetching, teams, count, history } = this.props;
    const { pagination, remoteci_id } = this.state;
    const { page, perPage } = pagination;
    const nbPages = Math.ceil(count / perPage);
    const itemsStart = (page - 1) * perPage + 1;
    const itemsEnd = page * perPage > count ? count : page * perPage;
    return (
      <MainContentWithLoader loading={isFetching && isEmpty(jobs)}>
        <Row>
          <Col xs={12} md={9} lg={10}>
            <PaginationRow
              viewType="list"
              pageInputValue={page}
              pagination={pagination}
              amountOfPages={nbPages}
              itemCount={count}
              itemsStart={itemsStart}
              itemsEnd={itemsEnd}
              onPerPageSelect={this._onPerPageSelect}
              onFirstPage={() => this._setPageAndFetchJobs(1)}
              onLastPage={() => this._setPageAndFetchJobs(nbPages)}
              onPreviousPage={() => this._setPageAndFetchJobs(page - 1)}
              onNextPage={() => this._setPageAndFetchJobs(page + 1)}
              className="bgWhite"
            />
            <ListView className="mt-3">
              {jobs.map(job => (
                <JobSummary
                  key={`${job.id}.${job.etag}`}
                  job={job}
                  history={history}
                />
              ))}
            </ListView>
            {remoteci_id && isEmpty(jobs) ? (
              <p>There is no job for this remoteci</p>
            ) : null}
          </Col>
          <Col xs={12} md={3} lg={2}>
            <Card>
              <CardHeading>
                <CardTitle>Filter by remoteci</CardTitle>
              </CardHeading>
              <CardBody>
                <FilterJobs
                  teams={teams}
                  remoteciId={remoteci_id}
                  selectRemoteci={remoteciId =>
                    this._setRemoteciAndFetchJobs(remoteciId)
                  }
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </MainContentWithLoader>
    );
  }
}

function mapStateToProps(state) {
  return {
    jobs: getJobs(state),
    count: state.jobs.count,
    teams: getTeams(state),
    isFetching: state.jobs.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJobs: ({ pagination, remoteci_id }) => {
      const params = {
        embed: "results,team,remoteci,components,metas,topic,rconfiguration",
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage
      };
      if (remoteci_id) {
        params.where = `remoteci_id:${remoteci_id}`;
      }
      dispatch(jobsActions.clear());
      return dispatch(jobsActions.all(params));
    },
    fetchTeams: () => dispatch(teamsActions.all({ embed: "remotecis" }))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsContainer);
