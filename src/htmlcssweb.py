import requests
from bs4 import BeautifulSoup
import os

# URL of the website to scrape
url = "https://www.gt-scheduler.org/"

# Send a GET request to fetch the HTML content
response = requests.get(url)
html_content = response.content

# Create a BeautifulSoup object to parse the HTML
soup = BeautifulSoup(html_content, 'html.parser')

# Find all HTML elements
html_elements = soup.find_all()

# Find all linked CSS files
css_files = []
link_tags = soup.find_all('link', rel='stylesheet')
for link_tag in link_tags:
    href = link_tag.get('href')
    if href.endswith('.css'):
        css_files.append(href)

# Fetch the contents of CSS files
css_content = []
for css_file in css_files:
    css_url = url + css_file if css_file.startswith('/') else url + '/' + css_file
    css_response = requests.get(css_url)
    css_content.append(css_response.content)

# Find all inline CSS elements
inline_styles = soup.find_all(style=True)

# Create a folder to store the output files
output_folder = "scraped_data"
os.makedirs(output_folder, exist_ok=True)

# Save HTML elements to a file
with open(os.path.join(output_folder, "html_elements.txt"), 'w', encoding='utf-8') as file:
    file.write("HTML Elements:\n")
    for element in html_elements:
        file.write(str(element) + '\n')

# Save linked CSS files to a file
with open(os.path.join(output_folder, "linked_css_files.txt"), 'w', encoding='utf-8') as file:
    file.write("Linked CSS Files:\n")
    for css_file in css_files:
        file.write(css_file + '\n')

# Save inline CSS elements to a file
with open(os.path.join(output_folder, "inline_css_elements.txt"), 'w', encoding='utf-8') as file:
    file.write("Inline CSS Elements:\n")
    for style in inline_styles:
        file.write(str(style) + '\n')

# Save CSS content from linked files to separate files
for i, css in enumerate(css_content):
    file_path = os.path.join(output_folder, f"css_content_{i}.css")
    with open(file_path, 'wb') as file:
        file.write(css)

print("Scraping completed. Results saved in the 'scraped_data' folder.")
