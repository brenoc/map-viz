import React, { Component } from "react";
import PropTypes from "prop-types";

class ControlBox extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div
        className="mapboxgl-ctrl"
        style={{ background: "#fff", padding: "10px", borderRadius: "4px" }}
      >
        <h3 style={{ marginTop: 0 }}>
          {title}
        </h3>
        {children}
      </div>
    );
  }
}

ControlBox.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default ControlBox;
