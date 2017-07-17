from flask import Flask, request, Response
from flask_caching import Cache
import json
import time

app = Flask(__name__)
cache = Cache(
    app, config={
        'CACHE_TYPE': 'filesystem',
        'CACHE_DIR': './.cache'
    })

with open('data.geojson') as data_file:
    data = json.load(data_file)

features = data['features']


@app.route("/api/points")
@cache.cached(timeout=50, query_string=True)
def root():
    visibleTypes = request.args.get('visibleTypes')
    course = request.args.get('course')
    institution = request.args.get('institution')

    response_data = {
        'type': 'FeatureCollection',
        'features': filterPoints(visibleTypes, course, institution)
    }

    resp = Response(json.dumps(response_data))
    resp.headers['x-cached-at'] = time.ctime()

    return resp


@app.route("/api/courses")
@cache.cached(timeout=50)
def courses():
    response_data = {
        'courses': getCourses()
    }

    resp = Response(json.dumps(response_data))
    resp.headers['x-cached-at'] = time.ctime()

    return resp


def getCourses():
    return list(set(map(getCourse, features)))


def getCourse(feature):
    return feature['properties']['prod_ds']


@app.route("/api/institutions")
@cache.cached(timeout=50)
def institutions():
    response_data = {
        'institutions': getInstitutions()
    }

    resp = Response(json.dumps(response_data))
    resp.headers['x-cached-at'] = time.ctime()

    return resp


def getInstitutions():
    return list(set(map(getInstitution, features)))


def getInstitution(feature):
    return feature['properties']['conveniado']


@cache.memoize(timeout=5)
def filterPoints(visibleTypes):
    visibleTypes = visibleTypes.split(',') if visibleTypes else []

    return list(map(simplify, filter(createFilters(visibleTypes), features)))


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


def createFilters(filters):
    def filterFn(feature):
        for _filter in filters:
            filterFn = getFilterFunction(_filter)
            result = filterFn(feature)
            if result is True:
                return True
        return False
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
