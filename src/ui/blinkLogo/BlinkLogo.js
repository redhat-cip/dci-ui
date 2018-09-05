import React, { Component } from "react";
import DCIGeckoPawImage from "./dci-gecko-paw.svg";
import styled, { keyframes } from "styled-components";

const blink = keyframes`
 0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const BlinkImg = styled.img`
  width: 64px;
  height: 64px;
  animation: ${blink} normal 2s infinite ease-in-out;
  display: block;
  margin: auto auto;
`;

export default class BlinkLogo extends Component {
  render() {
    const { className } = this.props;
    return (
      <BlinkImg
        id="dci-blink-gecko-paw"
        src={DCIGeckoPawImage}
        alt="Distributed CI"
        className={className}
      />
    );
  }
}
