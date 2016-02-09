import json,httplib,urllib
import sys
import matplotlib.pyplot as plt
import numpy as np

CATEGORY = "KitchenExpense"
RULE = "$gt"
VALUE = 0

def query(category, rule, value):
	connection = httplib.HTTPSConnection('api.parse.com', 443)
	params = urllib.urlencode({"where":json.dumps({
	       category: {
	         rule: value
	       }
	     })})
	connection.connect()
	connection.request('GET', '/1/classes/Transactions?%s' % params, '', {
	       "X-Parse-Application-Id": "sBDcY6elVaGx4EHc9HYPNnCry7XOMdjuntIDztLD",
	       "X-Parse-REST-API-Key": "F5KV5T6tI1hKJZS0puRsS3FB32HUqlhRSwMdZmRm"
	     })
	result = json.loads(connection.getresponse().read())
	return result

def get_weekly_data(result):
	data = {}
	result = result[result.keys()[0]]
	for entry in result:
		week = entry["Week"]
		if week not in data:
			data[week] = 0
		data[week] += entry['KitchenExpense']+entry['SocialExpense']
	return data

def get_type_data(result):
	data = {}
	data['KitchenExpense'] = 0
	data['SocialExpense'] = 0
	result = result[result.keys()[0]]
	for entry in result:
		data['KitchenExpense'] += entry['KitchenExpense']
		data['SocialExpense'] += entry['SocialExpense']
	return data

def get_house_data(result):
	data = {}
	result = result[result.keys()[0]]
	for entry in result:
		house = entry['HouseName']
		if house not in data:
			data[house] = 0
		data[house] += entry['KitchenExpense']+entry['SocialExpense']
	return data

# gets map from week to spending for that week
def histogram(params):
	category = "HouseName"
	rule = "$in"
	value = [get_house_name(params)]
	result = query(category, rule, value)
	split = get_split(params)
	if split == "time":
		data = get_weekly_data(result)
	if split == "type":
		data = get_type_data(result)
	if split == "house":
		data = get_house_data(result)
		# print data
	categories = data.keys()
	fig, ax = plt.subplots()
	colors = ['gray', 'cyan', 'lightblue', 'darkblue']
	spending = data.values()

	ticks = []
	for i in range(len(categories)):
		ticks.append(i+0.5)

	bars = ax.bar(range(len(categories)), height=spending, width=1, color = colors, linewidth = 0)
	ax.set_ylabel('Spending')
	ax.set_xticks(ticks)
	ax.set_xticklabels(categories)
	plt.savefig("test.png", dpi=100)

def pie_chart(params):
	category = "HouseName"
	rule = "$in"
	value = [get_house_name(params)]
	result = query(category, rule, value)
	split = get_split(params)
	data = {}
	if split == "time":
		data = get_weekly_data(result)
	if split == "type":
		data = get_type_data(result)
	if split == "house":
		data = get_house_data(result)
	sizes = data.values()
	sizes = np.array(data.values())
	denom = 1/np.sum(sizes)
	sizes = np.multiply(sizes, denom)
	colors = ['white', 'cyan', 'lightblue', 'darkblue']
	plt.pie(sizes, labels = data.keys(), colors = colors, shadow = True)
	plt.savefig("test.png", dpi=100)


def get_param(to_find, params):
	for param in params:
		split = param.find('=')
		if param[:split] == to_find:
			return param[split+1:]

def get_split(params):
	return get_param("split", params)

def get_house_name(params):
	return get_param("house", params)

def get_chart_type(params):
	return get_param("chartType", params)
	

# expected parameters for one house, weekly spending, histogram =
# "house=HOUSENAME"
# "chartType=histogram"
# "split=time" -> could also be type to chart social vs. kitchen instead of weeks
# python cloud_interface_test.py house=Grove chartType=pie_chart split=time
def run():
	# category = sys.argv[1]
	# rule = "$"+sys.argv[2]
	# value = sys.argv[3]

	# if value.replace(".","").replace("-","").isdigit():
	# 	value = float(value)

	# result = query(category, rule, value)
	# print result

	#print "here"
	params = sys.argv[1:]#["house=Grove", "chartType=histogram", "split=type"]sys.argv
	chart_type = get_chart_type(params)
	#print params
	if chart_type == "histogram":
		histogram(params)
	elif chart_type == "pie_chart":

		pie_chart(params)
	else:
		print "invalid chart type"

run()














