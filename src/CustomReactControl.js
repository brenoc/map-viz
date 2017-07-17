import React from "react";
import ReactDOM from "react-dom";

class CustomReactControl {
  constructor(Component, props) {
    this.Component = Component;
    this.props = props;
  }

  onAdd() {
    this._container = document.createElement("div");
    const Component = this.Component;

    ReactDOM.render(<Component {...this.props} />, this._container);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }
}

export default CustomReactControl;
