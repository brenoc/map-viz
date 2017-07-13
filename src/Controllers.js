import React, { Component } from "react";
import PropTypes from "prop-types";

class Controllers extends Component {
  render() {
    setTimeout(() => {
      this.props.onChangeFilters(["res", "turma"]);
    }, 10000);
    return <div />;
  }
}

Controllers.propTypes = {
  onChangeFilters: PropTypes.func.isRequired
};

export default Controllers;
