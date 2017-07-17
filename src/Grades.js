import React, { Component } from "react";
import PropTypes from "prop-types";
import ControlBox from "./ControlBox";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

class Grades extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  handleChange = value => {
    this.setState({ value });
  };

  handleChangeComplete = value => {
    this.props.onChange(value);
  };

  render() {
    return (
      <ControlBox title={"CR"}>
        <div style={{ width: "200px", padding: "10px" }}>
          <InputRange
            step={1}
            maxValue={10}
            minValue={0}
            value={this.state.value}
            onChange={this.handleChange}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      </ControlBox>
    );
  }
}

Grades.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Grades;
