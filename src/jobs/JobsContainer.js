import React, { Component } from "react";
import { connect } from "react-redux";
import { PaginationRow, Row, Col } from "patternfly-react";
import actions from "./jobsActions";
import { getJobs, paginate } from "./jobsSelectors";
import JobClickableSummary from "./JobClickableSummary";
import queryString from "query-string";
import { isEmpty } from "lodash";
import { MainContentWithLoader } from "../layout";
import TrendsContainer from "../trends/TrendsContainer";


export class JobsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: 1,
        perPage: 10,
        perPageOptions: [10, 20, 50]
      },
      };
  }

  componentDidMount() {
    const { page = 1, perPage = 10 } = queryString.parse(
      this.props.location.search
    );
    const pagination = {
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
      perPageOptions: [10, 20, 50]
    };
    this.setState({ pagination });
    this.props.fetchJobs({ pagination });
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
    const { jobs, isFetching, count, history } = this.props;
    const { page, perPage } = this.state.pagination;
    const nbPages = Math.round(count / perPage);
    const offset = (page - 1) * perPage;
    return (
      <MainContentWithLoader loading={isFetching && isEmpty(jobs)}>
        <TrendsContainer/>
        <Row>
          <Col xs={12}>
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
    isFetching: state.jobs.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJobs: ({ pagination }) => {
      const params = {
        embed: "results,remoteci,components,metas,topic,rconfiguration",
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage
      };
      return dispatch(actions.all(params));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsContainer);
