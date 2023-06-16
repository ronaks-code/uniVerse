import sys
import requests
import json
import os
from datetime import date
import threading
import logging
import glob

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Check if 'courses' directory exists and create it if it doesn't
if not os.path.exists('courses'):
    os.makedirs('courses')

class Counter:
    def __init__(self):
        self.value = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            self.value += 1

counter = Counter()

def scrape_page(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises stored HTTPError, if one occurred.
    except requests.HTTPError as http_err:
        logging.error(f'HTTP error occurred: {http_err}')
        sys.exit(1)
        return []
    except Exception as err:
        logging.error(f'Other error occurred: {err}')
        sys.exit(1)
        return []

    try:
        data = response.json()
    except ValueError:  # includes simplejson.decoder.JSONDecodeError
        logging.error('Decoding JSON has failed')
        sys.exit(1)
        return []

    if isinstance(data, list):  # Changed this to list as you mentioned the type of data is list
        return data
    else:
        logging.info("Data is not a list.")
        sys.exit(1)
        return []  # Return an empty list if data is not a list

def save_text_to_json_file(text, filename):
    filename = os.path.join('courses', filename)  # Add 'courses' directory to the filename
    
    # Check if file exists
    try:
        if os.path.exists(filename):
            # If it exists, open it and load the existing data
            with open(filename, 'r') as f:
                existing_data = json.load(f)
        else:
            # If it doesn't exist, create an empty list to hold the data
            existing_data = []
    except json.JSONDecodeError:
        logging.error('Failed to decode JSON from file')
        sys.exit(1)
        existing_data = []

    # Remove unwanted keys from the text
    keys_to_remove = ['LASTCONTROLNUMBER', 'TOTALROWS', 'RETRIEVEDROWS']
    for item in text:
        for key in keys_to_remove:
            item.pop(key, None)

    # Add the new data to the existing data
    existing_data.extend(text)

    # Write the updated data to the file
    try:
        with open(filename, 'w') as f:
            json.dump(existing_data, f, indent=4)
    except IOError:
        logging.error('Failed to write to file')
        sys.exit(1)

def thread_handler(thread_id, controlNum_start, url, increment=16):
    filename = date.today().strftime("%b-%d-%Y") + f'_{year}_{term}_thread{thread_id}.json'
    filename = os.path.join('courses', filename)  # Add 'courses' directory to the filename

    controlNum = controlNum_start
    filename = date.today().strftime("%b-%d-%Y") + f'_{year}_{term}_thread{thread_id}.json'
    while True:  # Infinite loop, we'll break it when no more data
        full_url = url + str(controlNum)
        logging.info(f'Thread-{thread_id}: {full_url}')
        data = scrape_page(full_url)
        if not data or data[0]['RETRIEVEDROWS'] == 0:  # If data is empty or RETRIEVEDROWS is 0, we assume there's no more data and break the loop
            break
        save_text_to_json_file(data, filename)
        controlNum += 50 * increment
        counter.increment()

def merge_json_files():
    all_data = []
    files = glob.glob(os.path.join('courses', date.today().strftime("%b-%d-%Y") + f'_{year}_{term}_thread*.json'))

    for file in files:
        with open(file, 'r') as f:
            data = json.load(f)
            all_data.extend(data)

    final_filename = date.today().strftime("%b-%d-%Y") + f'_{year}_{term}.json'
    final_filename = os.path.join('courses', final_filename)
    with open(final_filename, 'w') as f:
        json.dump(all_data, f, indent=4)

    # Delete the individual thread files
    for file in files:
        try:
            os.remove(file)
        except OSError as e:
            logging.error(f'Error while deleting file {file}. Error message: {e.strerror}')
            sys.exit(1)

if __name__ == '__main__':
    # Check if correct number of arguments are given
    if len(sys.argv) != 3:
        print("Usage: script.py <term> <year>")
        sys.exit(1)

    term = sys.argv[1].lower()
    year = sys.argv[2]

    if term not in ['spring', 'summer', 'fall']:
        print("Term should be either 'spring', 'summer', or 'fall'")
        sys.exit(1)

    try:
        year = int(year)
        if year < 0 or year > 99:
            raise ValueError
    except ValueError:
        print("Year should be a two-digit number between 00 and 99")
        sys.exit(1)

    term_dict = {'spring': '1', 'summer': '5', 'fall': '8'}
    term_num = str(2) + str(year) + term_dict[term]

    url = f'https://one.ufl.edu/apix/soc/schedule/?category=RES&term={term_num}&last-control-number='
    threads = []
    for i in range(16):  # Create 16 threads
        t = threading.Thread(target=thread_handler, args=(i, 50 * i, url))
        t.start()
        threads.append(t)

    for t in threads:  # Wait for all threads to finish
        t.join()

    print(f'Total API calls: {counter.value}')

    # Merge all thread files into one final file
    merge_json_files()

