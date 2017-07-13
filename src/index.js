import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

// Rodar:
// tippecanoe -o ide.mbtiles ide.geojson -f -Bg

// Backend:
// npm install -g tessera tilelive mbtiles
// tessera mbtiles://./ide.mbtiles

// Tentar usar clusters de novo:
// https://blog.mapbox.com/clustering-millions-of-points-on-a-map-with-supercluster-272046ec5c97

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJlbm9jYWxhemFucyIsImEiOiI0YTBjN2M5NWQzNjJkODJlYzQyYjk5YTQ0NGE5NmIxNiJ9.GAoDtuWblQorGcnnSvVrJQ";

const map = new mapboxgl.Map({
  container: "root", // container id
  style: "mapbox://styles/mapbox/light-v9", //hosted style id
  center: [-51.31668, -14.4086569], // starting position
  zoom: 3.5 // starting zoom
});

map.on("load", function() {
  map.addSource("ide", {
    type: "vector",
    url: "/index.json",
  });

  map.addLayer({
    "id": "ideTurma",
    "type": "circle",
    "source": "ide",
    "source-layer": "idegeojson",
    minzoom: 0,
    "filter": [
      "==",
      "cep_type",
      "turma"
    ],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "circle-color": "hsla(119, 100%, 50%, 1)"
    }
  })

  map.addLayer({
    "id": "ideResidencia",
    "type": "circle",
    "source": "ide",
    "source-layer": "idegeojson",
    minzoom: 0,
    "filter": [
      "==",
      "cep_type",
      "res"
    ],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "circle-color": "hsla(227, 100%, 50%, 0.5)"
    }
  })

  map.addLayer({
    "id": "ideTrabalho",
    "type": "circle",
    "source": "ide",
    "source-layer": "idegeojson",
    minzoom: 0,
    "filter": [
      "==",
      "cep_type",
      "trab"
    ],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "circle-color": "hsla(0, 100%, 50%, 0.5)"
    }
  })
});
