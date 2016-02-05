# runs with the command:
# python parsedata.py WinWk1Grove.csv Grove Winter 1

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
				# print line[:7]
			# else:
			# 	print line
# Date,Payee (Individual/Business name),Item - Description,Check # ,credit/income,Open/Closed Kitchen Expense,Social Expense


def publish():
	connection = httplib.HTTPSConnection('api.parse.com', 443)
	connection.connect()
	for line in spreadsheet:
		connection.request('POST', '/1/classes/Transactions', json.dumps({
		       "HouseName": HouseName,
		       "Quarter": quarter,
		       "Week": week,
		       "TransactionDate": line[0],
		       "Payee":line[1],
		       "ItemOrDescription": line[2],
		       # "CheckNum": line[3],
		       "CreditOrIncome": float(line[4][1:]),
		       "KitchenExpense": float(line[5][1:]),
		       "SocialExpense": float(line[6][1:])
		     }), {
		       "X-Parse-Application-Id": "sBDcY6elVaGx4EHc9HYPNnCry7XOMdjuntIDztLD",
		       "X-Parse-REST-API-Key": "F5KV5T6tI1hKJZS0puRsS3FB32HUqlhRSwMdZmRm",
		       "Content-Type": "application/json"
		     })
		results = json.loads(connection.getresponse().read())
	print results


parseFile()
publish()
