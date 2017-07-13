import React, { Component } from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJlbm9jYWxhemFucyIsImEiOiI0YTBjN2M5NWQzNjJkODJlYzQyYjk5YTQ0NGE5NmIxNiJ9.GAoDtuWblQorGcnnSvVrJQ";

class Map extends Component {
  constructor(props) {
    super(props);

    this.mountDiv = this.mountDiv.bind(this);
  }

  mountDiv = div => {
    if (!div) return;

    this.map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/mapbox/light-v9", //hosted style id
      center: [-51.31668, -14.4086569], // starting position
      zoom: 3.5 // starting zoom
    });
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.filters.join() !== this.props.filters.join();
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
  };

  changeMapPoints = () => {
    const map = this.map;

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-left");

    map.addSource("ide", {
      type: "geojson",
      data: `/api/points?filters=${this.props.filters.join(",")}`,
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

Map.propTypes = {
  filters: PropTypes.array
};

export default Map;
