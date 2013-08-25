#!/usr/bin/env python

from math import sin, cos, atan2, sqrt, pi
import json
import urllib
import requests
import os
from flask import Flask, request, make_response, render_template

# The radius of Earth in km
earthRadius = 6.371e3

# Location of White Bear Yard, 144a Clerkenwell Road, London, EC1R 5DF, UK.
# found with http://itouchmap.com/latlong.html
givenAddress = {'lat': 51.522199, 'lng': -0.109762}

def geodesicdistance(point1, point2Lat, point2Lng):
    # Geodesic distance between two points on the Earth 
    # computed using Vincenty inverse problem formula 
    lat1, lng1 = point1['lat']*pi/180.0, point1['lng']*pi/180.0
    lat2, lng2 = point2Lat*pi/180.0, point2Lng*pi/180.0
    print lat1, lng1
    print lat2, lng2    
    a = cos(lat2)*sin(abs(lng2 - lng1))
    b = cos(lat1)*sin(lat2)-sin(lat1)*cos(lat2)*cos(abs(lng2 - lng1))
    c = sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(abs(lng2 - lng1))
    return earthRadius*atan2(sqrt(a*a+b*b),c)

def getDistance(lat,lng):
    # This function returns the distance in km between   
    # the user current location and the given address 
    distance = geodesicdistance(givenAddress, lat, lng)
    return distance

def parseQ(args):
  # Parse the query
  query = args.get('q')
  return (query)

def createResponse(code, message, distance):
    # It creates a response to give back to the html page
    return {'status': {'code': code,'message': message},
            'result': {'distance': distance}}


app = Flask(__name__)

'''
#Heroku deployment, uncomment it for remote deployment 
@app.route("/")
def renderIndex():
    return render_template("index.html")
'''

@app.route("/geodesicDistance")
def geodesicDistance():
    query = parseQ(request.args)
    if query:
        # Split the query string to extrapolate the latitude and the longitude
        lat = float(query.split(',')[0]) 
        lng = float(query.split(',')[1])
        distance = getDistance(lat,lng)
        if distance:
            response = createResponse(200,'Query made', distance )
        else:
            response = createResponse(200,'Invalid query', distance ) 

    else:
        response = createResponse(204,'No query made',0)                               
    http_response = make_response(json.dumps(response))
    http_response.headers['Content-type'] = 'application/json'
    http_response.headers['Access-Control-Allow-Origin'] = '*'
    return http_response


    
@app.errorhandler(404)
def pageNotFound(error):
    response = createResponse(404,'404 error','')
    http_response = make_response((json.dumps(response),404))
    http_response.headers['Content-type'] = 'application/json'
    http_response.headers['Access-Control-Allow-Origin'] = '*'
    return http_response



if __name__=="__main__":
  host = '127.0.0.1'
  # It binds to the environment port, otherwise it binds to the 5000 port
  port = int(os.environ.get('PORT', 5000))
  debug = True
  app.run(debug=debug, host=host, port=port)
  # Comment the above line and uncomment the below line for Heroku deployment
  #app.run(debug=debug)  

