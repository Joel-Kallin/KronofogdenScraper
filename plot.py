import matplotlib.pyplot as plt
import numpy as np


f = open("history.txt", "r")
data = f.readlines()
formattedData = list(map(lambda s: s.split(), data))
total = list(map(lambda d: int(d[1]), formattedData))
dates = list(map(lambda d: d[0].replace(':', '').strip(), formattedData))
y = total
x = np.arange(0, len(total))
window = 5
average_y = []
for ind in range(len(y) - window + 1):
    average_y.append(np.mean(y[ind:ind+window]))
for ind in range(window - 1):
    average_y.insert(0, np.nan)

trend = np.polyfit(x, y, 1)
trendSquared = np.polyfit(x, y, 2)


average_label = "Running average ({0} days)".format(window)

plt.figure(figsize=(10, 5))
plt.title('Executive auctions (forced sales) of real estate in Sweden')
plt.plot_date(dates, y, 'k.-', label='Original data')
##plt.plot_date(dates, average_y, 'r.-', label=average_label)
plt.plot(x, np.polyval(trend, x), label='Polyfit Linear')
plt.plot(x, np.polyval(trendSquared, x), label='Polyfit Squared')
plt.xticks(np.arange(0, len(x), 30))
plt.grid(linestyle=':')
plt.legend()
plt.savefig('trend.png', bbox_inches='tight')
