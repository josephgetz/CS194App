# runs with the command:
# python parsedata.py spreadsheet.csv Roth Fall 8

import json,httplib

import sys

filename=sys.argv[1]
HouseName=sys.argv[2]
quarter=sys.argv[3]
week=int(sys.argv[4])
spreadsheet=[]

def parseFile():
	with open(filename) as f:
		for line in f:
			line=line.strip().split(',')
			if '/' in line[0]:
				spreadsheet.append(line[:7])
				print line[:7]

			# else:
			# 	print line



def publish():
	connection = httplib.HTTPSConnection('api.parse.com', 443)
	connection.connect()
	connection.request('POST', '/1/classes/GameScore', json.dumps({
	       "HouseName": HouseName,
	       "quarter": quarter,
	       "Week": week,
	       "Data": spreadsheet
	     }), {
	       "X-Parse-Application-Id": "sBDcY6elVaGx4EHc9HYPNnCry7XOMdjuntIDztLD",
	       "X-Parse-REST-API-Key": "F5KV5T6tI1hKJZS0puRsS3FB32HUqlhRSwMdZmRm",
	       "Content-Type": "application/json"
	     })
	results = json.loads(connection.getresponse().read())
	print results


parseFile()
publish()
