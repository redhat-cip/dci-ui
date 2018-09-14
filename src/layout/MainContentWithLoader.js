import React from "react";
import { BlinkLogo } from "../ui";
import MainContent from "./MainContent";
import FullHeightDiv from "./FullHeightDiv";

export default function MainContentWithLoader({ loading, children }) {
  return (
    <MainContent>
      {loading ? (
        <FullHeightDiv>
          <BlinkLogo />
        </FullHeightDiv>
      ) : (
        children
      )}
    </MainContent>
  );
}
