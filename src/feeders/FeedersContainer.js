import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon } from "patternfly-react";
import PropTypes from "prop-types";
import _ from "lodash";
import { getFeeders } from "./feedersSelectors";
import DCICard from "../DCICard";
import actions from "./feedersActions";
import { CopyButton } from "../ui";
import { EmptyState } from "../ui";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { MainContent } from "../layout";
import { downloadRCFile } from "../services/runcom";

export class FeedersContainer extends Component {
  componentDidMount() {
    this.props.fetchFeeders();
  }

  render() {
    const { feeders, isFetching } = this.props;
    return (
      <MainContent>
        <DCICard
          title="Feeders"
          loading={isFetching && _.isEmpty(feeders)}
          empty={!isFetching && _.isEmpty(feeders)}
          EmptyComponent={
            <EmptyState
              title="There is no feeder"
              info="See documentation to create a new feeder"
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Name</th>
                <th>Label</th>
                <th>Team Owner</th>
                <th className="text-center" title="Download run commands file">
                  Download rc file
                </th>
                <th>Description</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeders.map((feeder, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={feeder.id} />
                  </td>
                  <td>
                    <a href={`/feeders/${feeder.id}`}>{feeder.name}</a>
                  </td>
                  <td>{feeder.label}</td>
                  <td>{feeder.team.name}</td>
                  <td className="text-center">
                    <Button onClick={() => downloadRCFile(feeder, "feeder")}>
                      <Icon type="fa" name="download" /> feederrc.sh
                    </Button>
                  </td>
                  <td>{feeder.description}</td>
                  <td>{feeder.from_now}</td>
                  <td className="text-center">
                    <ConfirmDeleteButton
                      name="feeder"
                      resource={feeder}
                      whenConfirmed={feeder => this.props.deleteFeeder(feeder)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DCICard>
      </MainContent>
    );
  }
}

FeedersContainer.propTypes = {
  feeders: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchFeeders: PropTypes.func,
  deleteFeeder: PropTypes.func
};

function mapStateToProps(state) {
  return {
    feeders: getFeeders(state),
    isFetching: state.feeders.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFeeders: () => dispatch(actions.all({ embed: "team" })),
    deleteFeeder: feeder => dispatch(actions.delete(feeder))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedersContainer);
