import React, { Component } from "react";
import PropTypes from "prop-types";
import includes from "lodash/includes";
import without from "lodash/without";
import uniq from "lodash/uniq";

class PlaceType extends Component {
  handleChange = () => {
    const { visibleTypes, type, onChangeVisibleTypes } = this.props;

    const newFilters = includes(visibleTypes, type)
      ? without(visibleTypes, type)
      : uniq(visibleTypes.concat([type]));

    onChangeVisibleTypes(newFilters);
  };

  render() {
    const { type, visibleTypes, label } = this.props;

    return (
      <label>
        <input
          type="checkbox"
          value={type}
          checked={includes(visibleTypes, type)}
          onChange={this.handleChange}
          style={{ marginRight: "1em" }}
        />
        {label}
      </label>
    );
  }
}

PlaceType.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  visibleTypes: PropTypes.array.isRequired,
  onChangeVisibleTypes: PropTypes.func.isRequired
};

export default PlaceType;
