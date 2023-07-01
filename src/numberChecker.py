import json

with open('D:/Downloads/uniVerse/src/courses/UF_Jun-30-2023_23_summer_clean.json') as f1:
    data1 = json.load(f1)

counter = 0

for i in range(len(data1)):
    sections = data1[i]['sections']
    for section in sections:
        if 'number' in section and len(str(section['number'])) > 4:
            counter += 1
            print(data1[i]['code'] + ": " + str(section['number']))

print(counter)