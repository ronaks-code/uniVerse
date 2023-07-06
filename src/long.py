import json

# The names of the files to process
filenames = [
    'D:/Downloads/uniVerse/src/courses/UF_Jun-30-2023_23_summer_clean.json', 
    'D:/Downloads/uniVerse/src/courses/UF_Jun-30-2023_23_spring_clean.json', 
    'D:/Downloads/uniVerse/src/courses/UF_Jun-30-2023_23_fall_clean.json']

# Initialize variables to keep track of the longest name and the corresponding course code
longest_name = ""
longest_name_course_code = ""

# Iterate over the filenames
for filename in filenames:
    # Load the JSON data from the current file
    with open(filename, 'r') as file:
        courses = json.load(file)

    # Iterate over the courses
    for course in courses:
        # If the current course's name is longer than the longest name found so far
        if len(course['name']) > len(longest_name):
            # Update the longest name and the corresponding course code
            longest_name = course['name']
            longest_name_course_code = course['code']

# Print the course code with the longest name
print(f"The course code with the longest name is: {longest_name_course_code}")

