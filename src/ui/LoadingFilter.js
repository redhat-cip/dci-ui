import React, { Component } from "react";
import RotatingSpinnerIcon from "./RotatingSpinnerIcon";

export default class LoadingFilter extends Component {
  render() {
    const { placeholder, className, ...props } = this.props;
    return (
      <div className={`pf-c-dropdown ${className}`} {...props}>
        <button className="pf-c-dropdown__toggle" aria-expanded="false">
          <span className="pf-c-dropdown__toggle-text">{placeholder}</span>
          <RotatingSpinnerIcon className="pf-c-dropdown__toggle-icon" />
        </button>
      </div>
    );
  }
}
