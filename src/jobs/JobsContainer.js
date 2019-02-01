import React, { Component } from "react";
import { connect } from "react-redux";
import jobsActions from "./jobsActions";
import { getJobs } from "./jobsSelectors";
import JobSummary from "./JobSummary";
import queryString from "query-string";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import { EmptyState } from "../ui";
import Toolbar from "./toolbar/Toolbar";

export class JobsContainer extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const { page, perPage, where } = queryString.parse(location.search);
    const filters = where
      ? where.split(",").map(f => {
          const keyvalue = f.split(":");
          return {
            key: keyvalue[0],
            value: keyvalue[1]
          };
        })
      : [];
    this.state = {
      pagination: {
        page: page ? parseInt(page, 10) : 1,
        perPage: perPage ? parseInt(perPage, 10) : 20
      },
      filters
    };
  }

  componentDidMount() {
    this._fetchJobsAndChangeUrl();
  }

  _fetchJobsAndChangeUrl = () => {
    const { history, fetchJobs } = this.props;
    const { pagination, filters } = this.state;
    let url = `/jobs?page=${pagination.page}&perPage=${pagination.perPage}`;
    const where = filters.map(f => `${f.key}:${f.value}`).join(",");
    if (where) {
      url += `&where=${where}`;
    }
    history.push(url);
    fetchJobs({ pagination, filters });
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

  render() {
    const { jobs, isFetching, count, history } = this.props;
    const { filters, pagination } = this.state;
    return (
      <Page
        title="Jobs"
        loading={isFetching && isEmpty(jobs)}
        empty={!isFetching && isEmpty(jobs)}
        EmptyComponent={
          <EmptyState
            title="No job"
            info="There is no job at the moment. Edit your filters to restart a search."
          />
        }
        Toolbar={
          <Toolbar
            count={count}
            pagination={pagination}
            activeFilters={filters}
            goTo={page => this._setPageAndFetchJobs(page)}
            filterJobs={filters =>
              this.setState({ filters }, () => this._setPageAndFetchJobs(1))
            }
            clearFilters={() =>
              this.setState({ filters: [] }, () => this._setPageAndFetchJobs(1))
            }
          />
        }
      >
        <ul className="pf-c-data-list pf-u-box-shadow-md" aria-label="job list">
          {jobs.map(job => (
            <JobSummary
              seeDetailsButton
              key={`${job.id}.${job.etag}`}
              job={job}
              history={history}
            />
          ))}
        </ul>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    jobs: getJobs(state),
    count: state.jobs.count,
    isFetching: state.jobs.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJobs: ({ pagination, filters }) => {
      const params = {
        embed: "results,team,remoteci,components,topic,rconfiguration",
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage
      };
      const where = filters.map(f => `${f.key}:${f.value}`).join(",");
      if (where) {
        params.where = where;
      }
      dispatch(jobsActions.clear());
      return dispatch(jobsActions.all(params));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsContainer);
