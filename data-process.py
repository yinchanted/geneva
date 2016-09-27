import csv

inputfile = open('sibos2016_21.csv', 'r')
outputfile = open('sibos2016_21modified.csv', 'w')

days = {
    "9/26/2016": "DAY1",
    "9/27/2016": "DAY2"}

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
            
