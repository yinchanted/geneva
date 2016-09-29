import csv

inputfile = open('sibos2016_4.csv', 'r')
outputfile = open('sibos2016_4modified.csv', 'w')

days = {
    "9/26/16": "DAY1",
    "9/27/16": "DAY2",
    "9/28/16": "DAY3",
    "9/29/16": "DAY4"}

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
        writer.writerow(line + ['20'+year] + [days.get(dates)])

inputfile.close()
outputfile.close()
            
