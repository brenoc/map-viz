import React, { Component } from "react";
import PropTypes from "prop-types";
import Autocomplete from "react-autocomplete";
import startCase from "lodash/startCase";
import Fuse from "fuse.js";

class AutoComplete extends Component {
  constructor(props) {
    super(props);

    const items = this.transformItems(props.items);
    this.state = {
      items,
      allItems: items
    };

    this.createFuse(this.state.items);
    if (window.myItems) {
      window.myItems2 = this.state.items;
    }
    window.myItems = window.myItems || this.state.items;

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  transformItems = items => {
    return items
      .map(item => ({
        label: startCase(item),
        value: item
      }))
      .sort(this.sortItems);
  };

  sortItems(a, b) {
    return a.label.localeCompare(b.label);
  }

  createFuse = items => {
    this.fuse = new Fuse(items, {
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["label", "value"],
      shouldSort: true
    });
  };

  componenWillReceiveProps(nextProps) {
    const newItems = this.transformItems(nextProps.items);

    this.createFuse(newItems);

    this.setState({
      items: newItems
    });
  }

  handleOnChange = (e, value) => {
    const emptiedValue =
      this.props.value && this.props.value.length > 0 && value === "";
    if (emptiedValue) {
      this.setState({
        items: this.state.allItems
      });
      this.props.onSelect(value);
      return;
    }

    const result = this.fuse.search(value);
    this.setState({
      items: result
    });
    this.props.onChange(value);
  };

  handleOnSelect = value => {
    this.props.onSelect(value);
  };

  render() {
    const { value } = this.props;
    const { items } = this.state;

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
        getItemValue={item => item.value}
        onChange={this.handleOnChange}
        onSelect={this.handleOnSelect}
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
            key={item.value}
          >
            {item.label}
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
