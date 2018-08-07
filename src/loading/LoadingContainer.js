import React, { Component } from "react";
import { Cover, BlinkLogo } from "../ui";
import { SiteContent } from "../layout";

export default class LoadingContainer extends Component {
  render() {
    return (
      <SiteContent>
        <Cover>
          <BlinkLogo />
        </Cover>
      </SiteContent>
    );
  }
}
