import React from "react";
import ReactDOM from "react-dom";
import Courses from "./Courses";

class CoursesControl {
  constructor(props) {
    this.props = props;
  }

  onAdd() {
    this._container = document.createElement("div");

    ReactDOM.render(<Courses {...this.props} />, this._container);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }
}

export default CoursesControl;
