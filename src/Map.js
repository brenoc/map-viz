import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CustomReactControl from "./CustomReactControl";
import Places from "./Places";
import Institutions from "./Institutions";
import Courses from "./Courses";
import Grades from "./Grades";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJlbm9jYWxhemFucyIsImEiOiI0YTBjN2M5NWQzNjJkODJlYzQyYjk5YTQ0NGE5NmIxNiJ9.GAoDtuWblQorGcnnSvVrJQ";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleTypes: ["res", "trab", "turma"],
      course: "",
      institution: "",
      grade: { min: 0, max: 10 }
    };

    this.mountDiv = this.mountDiv.bind(this);
  }

  handleChangeVisibleTypes = visibleTypes => {
    this.setState({ visibleTypes });
  };

  handleChangeCourse = course => {
    this.setState({ course });
  };

  handleChangeInstitution = institution => {
    this.setState({ institution });
  };

  handleChangeGrade = grade => {
    this.setState({ grade });
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
    return (
      nextState.visibleTypes.join() !== this.state.visibleTypes.join() ||
      nextState.course !== this.state.course ||
      nextState.institution !== this.state.institution ||
      nextState.grade.min !== this.state.grade.min ||
      nextState.grade.max !== this.state.grade.max
    );
  }

  componentDidMount() {
    if (this.map._loaded) {
      this.removeSourceAndLayers();
      this.changeMapPoints();
    }
    this.map.on("load", () => {
      this.changeMapPoints();
      this.addControls();
    });
  }

  componentDidUpdate() {
    if (this.map._loaded) {
      this.removeSourceAndLayers();
      this.changeMapPoints();
    }
    this.map.on("load", () => {
      this.changeMapPoints();
      this.addControls();
    });
  }

  removeSourceAndLayers = () => {
    const map = this.map;
    map.removeSource("ide");
    map.removeLayer("clusters");
    map.removeLayer("cluster-count");
    map.removeLayer("turma-point");
    map.removeLayer("unclustered-point");
  };

  addControls = () => {
    const map = this.map;

    this.nav = new mapboxgl.NavigationControl();
    map.addControl(this.nav, "top-right");

    this.institutionsControl = new CustomReactControl(Institutions, {
      onChange: this.handleChangeInstitution,
      value: this.state.institution
    });
    map.addControl(this.institutionsControl, "top-left");

    this.coursesControl = new CustomReactControl(Courses, {
      onChange: this.handleChangeCourse,
      value: this.state.course
    });
    map.addControl(this.coursesControl, "top-left");

    this.gradesControl = new CustomReactControl(Grades, {
      onChange: this.handleChangeGrade,
      value: this.state.grade
    });
    map.addControl(this.gradesControl, "top-left");

    this.placesControl = new CustomReactControl(Places, {
      onChangeVisibleTypes: this.handleChangeVisibleTypes,
      visibleTypes: this.state.visibleTypes
    });
    map.addControl(this.placesControl, "top-left");
  };

  changeMapPoints = () => {
    const map = this.map;
    const { visibleTypes, course, institution, grade } = this.state;

    map.addSource("ide", {
      type: "geojson",
      data: `/api/points?visibleTypes=${visibleTypes.join(
        ","
      )}&course=${course}&institution=${institution}&minGrade=${grade.min}&maxGrade=${grade.max}`,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50
    });

    map.addLayer({
      id: "turma-point",
      type: "circle",
      source: "ide",
      filter: ["==", "cep_type", "turma"],
      paint: {
        "circle-color": "#f00",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff"
      }
    });

    const clusterFilter = [
      "all",
      ["!=", "cep_type", "turma"],
      ["has", "point_count"]
    ];

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "ide",
      filter: clusterFilter,
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
      filter: clusterFilter,
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
      filter: ["all", ["!has", "point_count"], ["!=", "cep_type", "turma"]],
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
