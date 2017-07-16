import React, { Component } from "react";
import PropTypes from "prop-types";
import Autocomplete from "react-autocomplete";
import startCase from "lodash/startCase";

class AutoComplete extends Component {
  handleOnChange = (e, value) => {
    this.props.onChange(value);
  };

  render() {
    const { value, items, onChange } = this.props;

    return (
      <Autocomplete
        value={value}
        inputProps={{
          style: {
            height: "1.5em",
            padding: "0.5em",
            width: "200px"
          }
        }}
        items={items}
        getItemValue={item => item}
        shouldItemRender={(item, value) =>
          item.toLowerCase().indexOf(value.toLowerCase()) !== -1}
        onChange={this.handleOnChange}
        onSelect={onChange}
        renderItem={(item, isHighlighted) =>
          <div
            style={{
              fontSize: "13px",
              padding: "2px 6px",
              cursor: "default",
              ...(isHighlighted
                ? {
                    background: "hsl(200, 50%, 50%)",
                    color: "white"
                  }
                : {
                    background: "#fff"
                  })
            }}
            key={item}
          >
            {startCase(item)}
          </div>}
      />
    );
  }
}

AutoComplete.propTypes = {
  value: PropTypes.string.isRequired,
  item: PropTypes.array,
  onChange: PropTypes.func.isRequired
};

export default AutoComplete;
