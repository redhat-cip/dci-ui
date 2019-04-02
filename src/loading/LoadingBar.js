import React from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";

const loading = keyframes`
  from {left: -200px; width: 30%;}
  50% {width: 30%;}
  70% {width: 70%;}
  80% { left: 50%;}
  95% {left: 120%;}
  to {left: 100%;}
`;

const Loader = styled.div`
  height: 4px;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  &:before {
    display: block;
    position: absolute;
    content: "";
    left: -200px;
    width: 200px;
    height: 4px;
    background-color: #2980b9;
    animation: ${loading} 2s linear infinite;
  }
`;

export function Alerts({ isLoading }) {
  if (isLoading) return <Loader />;
  return null;
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.isLoading
  };
}

export default connect(mapStateToProps)(Alerts);
