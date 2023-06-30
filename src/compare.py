import json
import jsondiff

def compare_list(list1, list2):
    return jsondiff.diff(list1, list2)

print("Opening files...")

# Read the JSON files
with open('D:/Downloads/uniVerse/src/courses/UF_Jun-30-2023_23_summer_clean.json') as f1:
    data1 = json.load(f1)

with open('D:/Downloads/uniVerse/src/pages/UF_Jun-30-2023_23_summer_clean.json') as f2:
    data2 = json.load(f2)

print("Comparing files...")

# Initialize an empty dictionary to store the cumulative differences
cumulative_diff = []

# Iterate through the courses in the JSON lists
for i in range(max(len(data1), len(data2))):
    # Compare the course dictionaries
    course1 = data1[i] if i < len(data1) else None
    course2 = data2[i] if i < len(data2) else None
    diff = compare_list(course1, course2)
    
    # If there are differences, add them to the cumulative_diff list
    if diff:
        cumulative_diff.append(diff)

print("Checking differences...")

# Check if there are any differences
if not cumulative_diff:
    print("They are the same")
else:
    print("They are different")
    print("Differences:")
    print(cumulative_diff)

print("Writing to file...")

# Write the differences to a JSON file
output_file_name = 'D:/Downloads/uniVerse/src/differences.json'
with open(output_file_name, 'w') as output_file:
    json.dump(cumulative_diff, output_file, indent=4)

print("Done!")
