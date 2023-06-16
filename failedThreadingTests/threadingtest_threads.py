import requests
import json
import os
from datetime import date
import concurrent.futures
import threading

def scrape_page(url):
    response = requests.get(url)
    data = response.json()
    print(type(data))  # This will print the type of data you are receiving
    if isinstance(data, list):  # Changed this to list as you mentioned the type of data is list
        return data
    else:
        print("Data is not a list.")
        return []  # Return an empty list if data is not a list

def save_text_to_json_file(text, filename, lock):
    # Check if file exists
    if os.path.exists(filename):
        # If it exists, open it and load the existing data
        with open(filename, 'r') as f:
            existing_data = json.load(f)
    else:
        # If it doesn't exist, create an empty list to hold the data
        existing_data = []

    # Add the new data to the existing data
    existing_data.extend(text)

    # Write the updated data to the file using the lock to ensure thread safety
    with lock:
        with open(filename, 'w') as f:
            json.dump(existing_data, f, indent=4)

def main():
    filename = date.today().strftime("%b-%d-%Y") + '.json'
    url = 'https://one.ufl.edu/apix/soc/schedule/?category=RES&term=2238&last-control-number='
    controlNum = 50
    threads = []
    lock = threading.Lock()  # Create a lock for thread synchronization
    with concurrent.futures.ThreadPoolExecutor() as executor:
        while True:  # Infinite loop, we'll break it when no more data
            full_url = url + str(controlNum)
            print(full_url)
            future = executor.submit(scrape_page, full_url)
            threads.append(future)
            controlNum += 50
            # Wait for all threads to finish
            for thread in threads:
                thread.result()
            # Check if there's any more data
            data = future.result()
            if not data or data[0]['RETRIEVEDROWS'] == 0:  # If data is empty or RETRIEVEDROWS is 0, we assume there's no more data and break the loop
                break
            # Save the data to a JSON file with thread safety
            save_text_to_json_file(data, filename, lock)

if __name__ == '__main__':
    main()
