import matplotlib.pyplot as plt
import numpy as np

categories = ['Open Kitchen', 'Closed Kitchen', 'Dorm', 'Other']
spending = [400.0, 800.0, 200.0, 350.0]
spending_2 = [200.0, 700.0, 500.0, 500.0]
weekly_dorm_spending = [100.0, 50.0, 60.0, 120.0, 75.0, 88.0, 230.0, 90.0, 40.0, 200.0]

def get_sizes(list_):
	sizes = []
	total_spending = sum(list_)
	for val in list_:
		sizes.append(val/total_spending*100)
	return sizes

#Pass in int corresponding to array position of entry to pop out
#If none, pass in -1
def pie_chart(highlighted):
    sizes = get_sizes(spending)
    colors = ['white', 'cyan', 'lightblue', 'darkblue']
    explode = [0, 0, 0, 0]
    if highlighted > -1 and highlighted < len(explode):
        explode[highlighted] = 0.1
    plt.pie(sizes, explode = explode, labels = categories, colors = colors, shadow = True)
    plt.show()

def bar_chart():
	num_entries = np.arange(len(categories))
	fig, ax = plt.subplots()
	colors = ['gray', 'cyan', 'lightblue', 'darkblue']
	bars = ax.bar(num_entries+1, spending, width=1, color = colors, linewidth = 0)
	ax.set_ylabel('Spending')
	ax.set_xticks(num_entries+1.5)
	ax.set_xticklabels(categories)
	plt.show()

def bar_chart_comparison():
	num_entries = np.arange(len(categories))
	fig, ax = plt.subplots()
	bars1 = ax.bar(num_entries, spending, width=0.45, color = "lightblue", linewidth = 0)
	bars2 = ax.bar(num_entries+0.45, spending_2, width=0.45, color = "darkblue", linewidth = 0)
	ax.set_ylabel('Spending')
	ax.set_xticks(num_entries+.4)
	ax.set_xticklabels(categories)
	plt.show()

def line_graph():
	fig, ax = plt.subplots()
	line, = plt.plot(weekly_dorm_spending)
	plt.show()
	ax.set_xlabel("Week")


pie_chart(2)







