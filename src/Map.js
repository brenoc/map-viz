import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PlacesControl from "./places/PlacesControl";
import InstitutionsControl from "./institutions/InstitutionsControl";
import CoursesControl from "./courses/CoursesControl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJlbm9jYWxhemFucyIsImEiOiI0YTBjN2M5NWQzNjJkODJlYzQyYjk5YTQ0NGE5NmIxNiJ9.GAoDtuWblQorGcnnSvVrJQ";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleTypes: ["res", "trab"]
    };

    this.mountDiv = this.mountDiv.bind(this);
  }

  handleChangeVisibleTypes = visibleTypes => {
    this.setState({ visibleTypes });
  };

  mountDiv = div => {
    if (!div) return;

    this.map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/mapbox/light-v9", //hosted style id
      center: [-51.31668, -14.4086569], // starting position
      zoom: 3.5 // starting zoom
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.visibleTypes.join() !== this.state.visibleTypes.join();
  }

  componentDidMount() {
    if (this.map._loaded) {
      this.removeSourceAndLayers();
      this.changeMapPoints();
    }
    this.map.on("load", () => {
      this.changeMapPoints();
    });
  }

  componentDidUpdate() {
    if (this.map._loaded) {
      this.removeSourceAndLayers();
      this.changeMapPoints();
    }
    this.map.on("load", () => {
      this.changeMapPoints();
    });
  }

  removeSourceAndLayers = () => {
    const map = this.map;
    map.removeSource("ide");
    map.removeLayer("clusters");
    map.removeLayer("cluster-count");
    map.removeLayer("unclustered-point");
    map.removeControl(this.nav);
    map.removeControl(this.placesControl);
  };

  changeMapPoints = () => {
    const map = this.map;

    this.nav = new mapboxgl.NavigationControl();
    map.addControl(this.nav, "top-right");

    this.institutionsControl = new InstitutionsControl({
      onChangeVisibleTypes: this.handleChangeVisibleTypes,
      visibleTypes: this.state.visibleTypes
    });
    map.addControl(this.institutionsControl, "top-left");

    this.coursesControl = new CoursesControl({
      onChangeVisibleTypes: this.handleChangeVisibleTypes,
      visibleTypes: this.state.visibleTypes
    });
    map.addControl(this.coursesControl, "top-left");

    this.placesControl = new PlacesControl({
      onChangeVisibleTypes: this.handleChangeVisibleTypes,
      visibleTypes: this.state.visibleTypes
    });
    map.addControl(this.placesControl, "top-left");

    map.addSource("ide", {
      type: "geojson",
      data: `/api/points?visibleTypes=${this.state.visibleTypes.join(",")}`,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "ide",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": {
          property: "point_count",
          type: "interval",
          stops: [[0, "#51bbd6"], [100, "#f1f075"], [750, "#f28cb1"]]
        },
        "circle-radius": {
          property: "point_count",
          type: "interval",
          stops: [[0, 20], [100, 30], [750, 40]]
        }
      }
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "ide",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "ide",
      filter: ["!has", "point_count"],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff"
      }
    });
  };

  render() {
    return (
      <div
        id="map"
        ref={this.mountDiv}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%"
        }}
      />
    );
  }
}

export default Map;
