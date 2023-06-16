import json

def make_hashable(element):
    if isinstance(element, dict):
        return tuple((k, make_hashable(v)) for k, v in element.items())
    elif isinstance(element, list):
        return tuple(make_hashable(x) for x in element)
    else:
        return element

def load_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    return data

def check_duplicates(data):
    data = [make_hashable(x) for x in data]
    unique_data = [x for x in set(data)]
    if len(unique_data) != len(data):
        print(f"There are {len(data) - len(unique_data)} duplicate items.")
    else:
        print("No duplicates found.")

if __name__ == '__main__':
    data = load_json('Jun-15-2023_23_fall.json')
    check_duplicates(data)

# TODO: The code below is to show what segments are duplicated in a specific file
# import json
# from collections import Counter

# def make_hashable(element):
#     if isinstance(element, dict):
#         return tuple((k, make_hashable(v)) for k, v in element.items())
#     elif isinstance(element, list):
#         return tuple(make_hashable(x) for x in element)
#     else:
#         return element

# def load_json(filename):
#     with open(filename, 'r') as f:
#         data = json.load(f)
#     return data

# def check_duplicates(data):
#     data_hashable = [make_hashable(x) for x in data]
#     element_counts = Counter(data_hashable)
    
#     most_common = element_counts.most_common(1)
#     if most_common and most_common[0][1] > 1:
#         item, count = most_common[0]
#         print(f"The most duplicated item is {dict(item)}, which appears {count} times.")
#     else:
#         print("No duplicates found.")

# if __name__ == '__main__':
#     data = load_json('Jun-15-2023_23_fall.json')
#     check_duplicates(data)