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
    minGrade = request.args.get('minGrade')
    maxGrade = request.args.get('maxGrade')

    response_data = {
        'type': 'FeatureCollection',
        'features': filterPoints(visibleTypes, course, institution, minGrade, maxGrade)
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
def filterPoints(visibleTypes, course, institution, minGrade, maxGrade):
    visibleTypes = visibleTypes.split(',') if visibleTypes else []

    return list(map(simplify, filter(createFilters(visibleTypes, course, institution, minGrade, maxGrade), features)))


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


def createFilters(filters, course, institution, minGrade, maxGrade):
    def filterFn(feature):
        for _filter in filters:
            filterFn = getFilterFunction(_filter)
            result = filterFn(feature)

            validCourse = True
            if course != '':
                validCourse = courseFilter(feature, course)

            validInstitution = True
            if institution != '':
                validInstitution = institutionFilter(feature, institution)

            validGrade = fitMinAndMaxGrade(feature, minGrade, maxGrade)

            if result is True and validCourse and validInstitution and validGrade:
                return True

        return False
    return filterFn


def fitMinAndMaxGrade(feature, minGrade, maxGrade):
    grade = feature['properties']['cr_curso']
    return grade >= float(minGrade) and grade <= float(maxGrade)


def courseFilter(feature, course):
    return feature['properties']['prod_ds'] == course


def institutionFilter(feature, institution):
    return feature['properties']['conveniado'] == institution


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
        'turma': turmaFilter,
    }.get(_filter, noFilter)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
