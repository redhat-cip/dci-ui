import React from "react";
import { BlinkLogo } from "../ui";
import MainContent from "./MainContent";
import styled from "styled-components";

const FullHeightDiv = styled.div`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function MainContentWithLoader({ loading, children }) {
  return (
    <MainContent>
      {loading ? (
        <FullHeightDiv>
          {" "}
          <BlinkLogo />
        </FullHeightDiv>
      ) : (
        children
      )}
    </MainContent>
  );
}
