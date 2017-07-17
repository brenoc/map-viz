import React, { Component } from "react";
import PropTypes from "prop-types";
import PlaceType from "./PlaceType";
import ControlBox from "./ControlBox";

class Controllers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleTypes: props.visibleTypes
    };
  }

  handleChangeVisibleTypes = visibleTypes => {
    this.setState({ visibleTypes });
    this.props.onChangeVisibleTypes(visibleTypes);
  };

  render() {
    const { visibleTypes } = this.state;

    return (
      <ControlBox title={"Locais Visíveis"}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            <PlaceType
              type={"res"}
              label={"Residências"}
              visibleTypes={visibleTypes}
              onChangeVisibleTypes={this.handleChangeVisibleTypes}
            />
          </li>
          <li>
            <PlaceType
              type={"trab"}
              label={"Locais de Trabalho"}
              visibleTypes={visibleTypes}
              onChangeVisibleTypes={this.handleChangeVisibleTypes}
            />
          </li>
          <li>
            <PlaceType
              type={"turma"}
              label={"Convênios"}
              visibleTypes={visibleTypes}
              onChangeVisibleTypes={this.handleChangeVisibleTypes}
            />
          </li>
        </ul>
      </ControlBox>
    );
  }
}

Controllers.propTypes = {
  visibleTypes: PropTypes.array.isRequired,
  onChangeVisibleTypes: PropTypes.func.isRequired
};

export default Controllers;
