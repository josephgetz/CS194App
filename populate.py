import sys
import pymongo

# python populate.py grove_wk1.txt Grove Winter 1

URL = "mongodb://127.0.0.1:3001/meteor"

filename=sys.argv[1]
HouseName=sys.argv[2]
quarter=sys.argv[3]
week=int(sys.argv[4])
spreadsheet=[]

def parseFile():
	with open(filename,'rU') as f:
		for line in f.readlines():
			if '\t' in line:
				line=line.strip().split('\t')
			else:
				line=line.strip().split(',')
			if '/' in line[0]:
				spreadsheet.append(line[:7])
				
	to_return = []
	
	for line in spreadsheet:
		data = {"HouseName": HouseName, \
				"Quarter": quarter, \
				"Week": week, \
				"TransactionDate": line[0], \
				"Payee":line[1], \
				"ItemOrDescription": line[2], \
				"CreditOrIncome": float(line[4][line[4].index('$')+1:].replace('"','').replace(',','')), \
				"KitchenExpense": float(line[5][line[5].index('$')+1:].replace('"','').replace(',','')), \
				"SocialExpense": float(line[6][line[6].index('$')+1:].replace('"','').replace(',',''))}
		to_return.append(data)
	return to_return


def run():
	client = pymongo.MongoClient(URL)
	db = client.meteor
	collection = db.database
	new_entries = parseFile()
	for entry in new_entries:
		a = collection.insert(entry)
		print a

run()





