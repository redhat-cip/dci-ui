import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardHeading,
  CardTitle,
  CardBody
} from "patternfly-react";
import { updateCurrentUser, logout } from "../currentUser/currentUserActions";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { MainContent } from "../layout";

export class ProfileContainer extends Component {
  render() {
    const { currentUser, updateCurrentUser, logout } = this.props;
    return (
      <MainContent>
        <Row>
          <Col xs={12} md={6} lg={4}>
            <Card>
              <CardHeading>
                <CardTitle>Personal information</CardTitle>
              </CardHeading>
              <CardBody>
                <ProfileForm
                  key={`ProfileForm.${currentUser.id}.${currentUser.etag}`}
                  currentUser={currentUser}
                  submit={newCurrentUser => updateCurrentUser(newCurrentUser)}
                />
              </CardBody>
            </Card>
          </Col>
          {currentUser.isReadOnly ? null : (
            <Col xs={12} md={6} lg={4}>
              <Card>
                <CardHeading>
                  <CardTitle>Change your password</CardTitle>
                </CardHeading>
                <CardBody>
                  <ChangePasswordForm
                    key={`ChangePasswordForm.${currentUser.id}.${currentUser.etag}`}
                    currentUser={currentUser}
                    submit={newCurrentUser => {
                      updateCurrentUser(newCurrentUser)
                        .catch(error => console.log(error))
                        .then(() => logout());
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </MainContent>
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
    updateCurrentUser: currentUser => dispatch(updateCurrentUser(currentUser)),
    logout: () => dispatch(logout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileContainer);
