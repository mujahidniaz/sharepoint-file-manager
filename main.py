import os
from io import BytesIO

import docx
from office365.sharepoint.client_context import ClientContext
from office365.runtime.auth.user_credential import UserCredential

# Replace these variables with your own values
username = ''
password = ''
site_url = ''
folder_url = ''  # Adjust the folder path as necessary

SITE_URL = ''
FOLDER_URL = ''  # Adjust the folder path as necessary

credentials = UserCredential(username, password)
ctx = ClientContext(site_url).with_credentials(credentials)

folder = ctx.web.get_folder_by_server_relative_url(folder_url)
files = folder.files
ctx.load(files)
ctx.execute_query()
print(files)


def search_in_docx(content, search_word):
    file_like_object = BytesIO(content)
    doc = docx.Document(file_like_object)
    results = []
    for para_num, para in enumerate(doc.paragraphs, start=1):
        if search_word in para.text:
            results.append((para_num, para.text))
    return results


for file in files:
    print(file.properties)
    print(f"Name: {file.properties['Name']}")
    print(f"URL: {file.properties['ServerRelativeUrl']}")
    print(f"Title: {file.properties.get('Title', 'No title')}")
    print(f"Created: {file.properties['TimeCreated']}")
    print(f"Modified: {file.properties['TimeLastModified']}")

    # Get the link to open the file in the web
    web_url = file.properties['LinkingUri']
    print(f"Web URL: {web_url}")

    # Reading file content
    file_response = file.open_binary(ctx, server_relative_url=file.properties['ServerRelativeUrl'])
    file_name = file.properties['Name']
    local_file_path = os.path.join(r'C:\Users\mujah\SourceCodes\Sharepoint-Poc', file_name)
    found = search_in_docx(file_response.content, "AI")
    print(found)
    # with open(local_file_path, 'wb') as local_file:
    #     local_file.write(file_response.content)
    # print(f"Downloaded: {local_file_path}")
    # print("=" * 40)
