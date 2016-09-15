import csv

inputfile = open('sibos_2014.csv', 'r')
outputfile = open('sibos_2014_modified.csv', 'w')

days = {
    "9/28/2014": "DAY0",
    "9/29/2014": "DAY1",
    "9/30/2014": "DAY2",
    "10/1/2014": "DAY3",
    "10/2/2014": "DAY4"}

#attendees = set()  
csvReader = csv.reader(inputfile)
writer = csv.writer(outputfile)

counter = 1

for line in csvReader:
    if counter == 1:
        writer.writerow(line + ['YEAR'] + ['DAYS'])
        counter = counter + 1
    else:
        dates = line[12]
        date = dates.split('/')
        year = date[2]
        writer.writerow(line + [year] + [days.get(dates)])

inputfile.close()
outputfile.close()
            
