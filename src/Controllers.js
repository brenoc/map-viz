import React, { Component } from "react";
import PropTypes from "prop-types";
import PlaceType from "./PlaceType";

class Controllers extends Component {
  render() {
    const { visibleTypes, onChangeVisibleTypes } = this.props;

    return (
      <div className="mapboxgl-ctrl">
        <div>
          Locais Visíveis:
          <ul>
            <li>
              <PlaceType
                type={"res"}
                label={"Residências"}
                visibleTypes={visibleTypes}
                onChangeVisibleTypes={onChangeVisibleTypes}
              />
            </li>
            <li>
              <PlaceType
                type={"trab"}
                label={"Locais de Trabalho"}
                visibleTypes={visibleTypes}
                onChangeVisibleTypes={onChangeVisibleTypes}
              />
            </li>
            <li>
              <PlaceType
                type={"turma"}
                label={"Convênios"}
                visibleTypes={visibleTypes}
                onChangeVisibleTypes={onChangeVisibleTypes}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Controllers.propTypes = {
  visibleTypes: PropTypes.array.isRequired,
  onChangeVisibleTypes: PropTypes.func.isRequired
};

export default Controllers;
