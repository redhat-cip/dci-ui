import React, { Component } from "react";
import { connect } from "react-redux";
import { PaginationRow, Row, Col } from "patternfly-react";
import jobsActions from "./jobsActions";
import teamsActions from "../teams/teamsActions";
import { getJobs, paginate } from "./jobsSelectors";
import { getTeams } from "../teams/teamsSelectors";
import JobClickableSummary from "./JobClickableSummary";
import queryString from "query-string";
import { isEmpty } from "lodash";
import { MainContentWithLoader } from "../layout";
import FiltersContainer from "./FiltersContainer";

import styled from "styled-components";
import { Colors } from "../ui";

const ColWhite = styled(Col)`
  box-shadow: 0 1px 1px rgba(3, 3, 3, 0.175);
  background-color: ${Colors.white};
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
    0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
`;

export class JobsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: 1,
        perPage: 10,
        perPageOptions: [10, 20, 50]
      },
      remoteci_id: null
    };
  }

  componentDidMount() {
    const { location, fetchJobs, fetchTeams } = this.props;
    const { page = 1, perPage = 10, remoteci_id } = queryString.parse(
      location.search
    );
    const pagination = {
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
      perPageOptions: [10, 20, 50]
    };
    this.setState({ pagination, remoteci_id });
    fetchJobs({ pagination, remoteci_id });
    fetchTeams();
  }

  setPageAnFetchJobs(page) {
    this.setState(
      prevState => {
        return {
          pagination: {
            ...prevState.pagination,
            page
          }
        };
      },
      () => this.props.fetchJobs(this.state)
    );
  }

  onPerPageSelect = nbElement => {
    this.setState(
      prevState => {
        return {
          pagination: {
            ...prevState.pagination,
            page: 1,
            perPage: nbElement
          }
        };
      },
      () => this.props.fetchJobs(this.state)
    );
  };

  render() {
    const { jobs, isFetching, teams, count, history } = this.props;
    const { pagination, remoteci_id } = this.state;
    const { page, perPage } = pagination;
    const nbPages = Math.round(count / perPage);
    const offset = (page - 1) * perPage;
    return (
      <MainContentWithLoader loading={isFetching && isEmpty(jobs)}>
        <Row>
          <Col xs={12} md={9} lg={10}>
            <PaginationRow
              viewType="list"
              pageInputValue={page}
              pagination={this.state.pagination}
              amountOfPages={nbPages ? nbPages : 1}
              itemCount={count}
              itemsStart={count > offset + 1 ? offset + 1 : 1}
              itemsEnd={count < perPage ? count : offset + perPage}
              onPerPageSelect={this.onPerPageSelect}
              onFirstPage={() => this.setPageAnFetchJobs(1)}
              onLastPage={() => this.setPageAnFetchJobs(nbPages)}
              onPreviousPage={() =>
                this.setPageAnFetchJobs(this.state.pagination.page - 1)
              }
              onNextPage={() =>
                this.setPageAnFetchJobs(this.state.pagination.page + 1)
              }
              className="bgWhite mb-3"
            />
            {paginate(jobs, this.state.pagination).map((job, i) => (
              <JobClickableSummary key={job.etag} job={job} history={history} />
            ))}
            {remoteci_id && isEmpty(jobs) ? (
              <p>There is no job for this remoteci</p>
            ) : null}
          </Col>
          <ColWhite xs={12} md={3} lg={2}>
            <FiltersContainer
              teams={teams}
              history={history}
              remoteci_id={remoteci_id}
            />
          </ColWhite>
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
        embed: "results,remoteci,components,metas,topic,rconfiguration",
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage
      };
      if (remoteci_id) {
        params.where = `remoteci_id:${remoteci_id}`;
      }
      return dispatch(jobsActions.all(params));
    },
    fetchTeams: () => dispatch(teamsActions.all({ embed: "remotecis" }))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsContainer);
