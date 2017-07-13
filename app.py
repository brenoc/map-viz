from flask import Flask, request
import json

# https://github.com/mojodna/tessera
# https://github.com/mapbox/tilelive
# https://www.mapbox.com/studio/styles/brenocalazans/cj4z2tgaa0c3l2rrmd068akik/edit/
# https://github.com/mapbox/tippecanoe
# https://www.mapbox.com/mapbox-gl-js/style-spec/#sources

app = Flask(__name__)

with open('data.geojson') as data_file:
    data = json.load(data_file)

features = data['features']


@app.route("/api/points")
def root():
    filters = (request.args.get('filters').split(
        ',') if request.args.get('filters') else [])

    response = {
        'type': 'FeatureCollection',
        'features': list(map(simplify, filter(createFilter(filters), features)))
    }

    return json.dumps(response)


def simplify(feature):
    return {
        "properties": {
            "cep_type": feature['properties']['cep_type'],
        },
        "type": "Feature",
        "geometry": {
            "coordinates": feature['geometry']['coordinates'],
            "type": "Point"
        }
    }


def createFilter(filters):
    def filterFn(feature):
        for _filter in filters:
            filterFn = getFilterFunction(_filter)
            result = filterFn(feature)
            if result is True:
                return False
        return True
    return filterFn


def resFilter(feature):
    return feature['properties']['cep_type'] == 'res'


def trabFilter(feature):
    return feature['properties']['cep_type'] == 'trab'


def turmaFilter(feature):
    return feature['properties']['cep_type'] == 'turma'


def noFilter(feature):
    return True


def getFilterFunction(_filter):
    return {
        'res': resFilter,
        'trab': trabFilter,
        'turma': turmaFilter
    }.get(_filter, noFilter)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
