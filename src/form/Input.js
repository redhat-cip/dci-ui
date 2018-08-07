import React, {Component} from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class Input extends Component {
  changeValue = event => {
    this.props.setValue(event.currentTarget.value);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name, type } = this.props;
    return (
      <div className="form-group">
        <label className="control-label" htmlFor={name}>
          {label}
        </label>
        <input
          id={id || name}
          name={name}
          className="form-control"
          onChange={this.changeValue}
          type={type}
          value={this.props.getValue() || ""}
        />
        <span className="help-block">{errorMessage}</span>
      </div>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string
};

Input.defaultProps = {
  type: "text"
};

export default withFormsy(Input);
