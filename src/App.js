import React, { Component } from "react";
import Map from "./Map";
import Controllers from "./Controllers";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: []
    };
  }

  handleChangeFilters = filters => {
    this.setState({ filters });
  };

  render() {
    return (
      <div>
        <Controllers onChangeFilters={this.handleChangeFilters} />
        <Map filters={this.state.filters} />
      </div>
    );
  }
}

export default App;
