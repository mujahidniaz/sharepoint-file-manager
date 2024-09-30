
# SharePoint File Manager

## Overview
The SharePoint File Manager is a web application that allows users to manage files on SharePoint through a user-friendly interface. It consists of a Flask backend API for handling authentication and file operations and a React frontend for a seamless user experience.

## Features
- User authentication (login/logout).
- List files stored in SharePoint.
- Search for files based on keywords.
- Upload files to SharePoint.
- Secure session management using tokens.

## Tech Stack
- **Backend**: Flask
- **Frontend**: React
- **Authentication**: Office365 Authentication
- **File Management**: SharePoint API

## Installation

### Prerequisites
Make sure you have the following installed:
- Python 3.x
- Node.js and npm

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/username/repository.git
   cd repository/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - **Windows**:
     ```bash
     .venv\Scripts\activate
     ```
   - **Linux/Mac**:
     ```bash
     source .venv/bin/activate
     ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure SharePoint Utilities:
   - Update the `sharepoint_utils.py` file to include your SharePoint site URL and any other required configurations.

6. Run the Flask server:
   ```bash
   python api.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## API Endpoints
### Authentication
- **Login**: `POST /login`
  - Request body: 
    ```json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```
  - Response: 
    ```json
    {
      "message": "Login successful",
      "session_token": "your_session_token"
    }
    ```

- **Logout**: `POST /logout`
  - Headers: `Authorization: your_session_token`
  - Response: 
    ```json
    {
      "message": "Logout successful"
    }
    ```

### File Management
- **List Files**: `GET /list_files`
  - Headers: `Authorization: your_session_token`
  - Response: 
    ```json
    [
      {
        "name": "file1.txt",
        "url": "http://example.com/file1.txt"
      },
      ...
    ]
    ```

- **Search Files**: `POST /search_files`
  - Request body: 
    ```json
    {
      "search_word": "keyword"
    }
    ```
  - Headers: `Authorization: your_session_token`
  - Response: 
    ```json
    [
      {
        "name": "file1.txt",
        "url": "http://example.com/file1.txt"
      },
      ...
    ]
    ```

- **Upload File**: `POST /upload_file`
  - Form data: `file` (the file to upload)
  - Headers: `Authorization: your_session_token`
  - Response: 
    ```json
    {
      "message": "File uploaded successfully",
      "file_info": { ... }
    }
    ```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or create an issue for any enhancements or bugs.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author
- [Your Name](https://github.com/yourusername)

```

### Notes:
- Update the GitHub repository link and any necessary configurations for SharePoint in `sharepoint_utils.py`.
- Customize the author section with your name and relevant links.
- Make sure to include any additional details specific to your project as needed.