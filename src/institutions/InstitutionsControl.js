import React from "react";
import ReactDOM from "react-dom";
import Institutions from "./Institutions";

class InstitutionsControl {
  constructor(props) {
    this.props = props;
  }

  onAdd() {
    this._container = document.createElement("div");

    ReactDOM.render(<Institutions {...this.props} />, this._container);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }
}

export default InstitutionsControl;
