import json

# Replace 'your_file_path.json' with the actual path to your JSON file
file_path = 'beneficiaries1.json'

with open(file_path, 'r', encoding = "utf-8") as file:
    data = json.load(file)

# Create a dictionary to store document IDs based on gnDivision
index_dict = {}

# Counter for indexing
index_counter = 1

# Assuming data is a list of dictionaries
for document in data:
    gn_division = document.get('gnDivision')
    document_id = document.get('id')

    if gn_division == 'Siraddikulam (Moved from Naddankandal)':
        index_dict[index_counter] = document_id
        index_counter += 1

# Print the indexed documents
for index, document_id in index_dict.items():
    print(f"Index: {index}, Document ID: {document_id}")
