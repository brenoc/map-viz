from flask import Flask
import json

# https://github.com/mojodna/tessera
# https://github.com/mapbox/tilelive
# https://www.mapbox.com/studio/styles/brenocalazans/cj4z2tgaa0c3l2rrmd068akik/edit/
# https://github.com/mapbox/tippecanoe
# https://www.mapbox.com/mapbox-gl-js/style-spec/#sources

app = Flask(__name__)

with open('ide.geojson') as data_file:
    data = json.load(data_file)

mini_json = {
    'type': 'FeatureCollection',
    'features': data['features'][:50]
}


@app.route("/api/foo")
def root():
    return json.dumps(mini_json)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
