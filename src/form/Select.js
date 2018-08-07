import React, {Component} from "react";
import PropTypes from "prop-types";
import { withFormsy } from "formsy-react";

class Select extends Component {
  changeValue = event => {
    this.props.setValue(event.currentTarget.value || null);
  };

  render() {
    const errorMessage = this.props.getErrorMessage();
    const { id, label, name, required, options } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select
          id={id || name}
          name={name}
          value={this.props.getValue() || ""}
          onChange={this.changeValue}
          className="form-control"
        >
          {required ? null : <option value="" />}
          {options.map((option, i) => (
            <option key={i} value={option.id} name={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="help-block">{errorMessage}</span>
      </div>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
};

export default withFormsy(Select);
