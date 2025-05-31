# Company Data API

A web-based interface for accessing and filtering company recruitment information. This project provides a clean, responsive UI to search and view company data from a JSON database, as well as an API for developers to integrate with their applications.

## Features

- **Web Interface**
  - Search companies by name, industry, or location
  - Filter companies by industry, recruitment status, and company size
  - View companies in grid or list layout
  - Detailed company information in modal popups
  - Responsive design for all device sizes

- **API**
  - RESTful API access with authentication
  - Multiple endpoints for different data needs
  - Comprehensive documentation
  - API key management system
  - Rate limiting to prevent abuse

## Project Structure

```
company-data-api/
│
├── index.html         # Main HTML file for web interface
├── styles.css         # CSS styles
├── script.js          # JavaScript functionality for web interface
├── data/              # Data directory
│   └── database.json  # Company database
├── api/               # API directory
│   ├── index.html     # API landing page and endpoint handler
│   ├── api.js         # API functionality
│   ├── documentation.html # API documentation
│   ├── manage-keys.html  # API key management
│   └── test.html      # API testing tool
└── README.md          # This file
```

## Setup Instructions

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/company-data-api.git
   cd company-data-api
   ```

2. If you have Python installed, you can run a simple HTTP server:
   ```bash
   # For Python 3
   python -m http.server
   
   # For Python 2
   python -m SimpleHTTPServer
   ```

3. Open your browser and navigate to `http://localhost:8000`

Alternatively, you can use any local development server like Live Server extension in VS Code.

## API Usage

### API Documentation

Comprehensive API documentation is available at `/api/documentation.html`. The documentation includes:

- Authentication instructions
- Available endpoints
- Request parameters
- Response formats
- Error handling
- Code examples in multiple languages (JavaScript, Python, Java, Kotlin)

### API Key Management

To use the API, you need an API key. You can manage your API keys at `/api/manage-keys.html`.

For demonstration purposes, a demo API key is available:
```
demo-key-123456
```

### API Endpoints

The following endpoints are available:

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /api/?endpoint=companies&api_key=YOUR_API_KEY` | Get all companies | None |
| `GET /api/?endpoint=company&id=ID&api_key=YOUR_API_KEY` | Get a specific company by ID | `id`: Company ID |
| `GET /api/?endpoint=search&term=TERM&api_key=YOUR_API_KEY` | Search for companies | `term`: Search term |
| `GET /api/?endpoint=industries&api_key=YOUR_API_KEY` | Get all unique industries | None |
| `GET /api/?endpoint=sizes&api_key=YOUR_API_KEY` | Get all unique company sizes | None |
| `GET /api/?endpoint=stats&api_key=YOUR_API_KEY` | Get API statistics | None |

### Testing the API

You can test the API using the built-in testing tool at `/api/test.html`. This tool allows you to:

- Test all available endpoints
- Validate API keys
- See the response data in a formatted view

## Hosting on GitHub Pages

Follow these steps to host the project on GitHub Pages:

1. Create a new GitHub repository
   - Go to [GitHub](https://github.com) and sign in
   - Click on the "+" icon in the top right corner and select "New repository"
   - Name your repository (e.g., "company-data-api")
   - Choose public visibility
   - Click "Create repository"

2. Initialize Git in your local project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/samyak2403/company-data-api.git
   git branch -M main
   git push -u origin main
   ```

4. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to the "GitHub Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait a few minutes for your site to be published

5. Your site will be available at:
   ```
   https://samyak2403.github.io/company-data-api/
   ```

## Customizing the Data

To use your own company data:

1. Modify the `data/database.json` file with your company information
2. Ensure your JSON structure matches the expected format:
   ```json
   [
     {
       "companies": {
         "companyId": 1,
         "name": "Company Name",
         "industry": "Industry Type",
         "headquarters": "Location",
         "size": "Company Size",
         "isRecruiting": true,
         "recruitmentStatus": "Active",
         "website": "https://example.com",
         "description": "Company description"
       }
     },
     ...
   ]
   ```

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript (ES6+)
- Font Awesome for icons
- LocalStorage for API key management

## API Integration Examples

### JavaScript
```javascript
async function getCompanies() {
  const apiKey = 'demo-key-123456';
  const response = await fetch(`https://samyak2403.github.io/company-data-api/api/?endpoint=companies&api_key=${apiKey}`);
  const data = await response.json();
  
  if (data.status === 200) {
    console.log('Companies:', data.data);
    return data.data;
  } else {
    console.error('Error:', data.error);
    return null;
  }
}
```

### Python
```python
import requests

def get_companies():
    api_key = 'demo-key-123456'
    url = f'https://samyak2403.github.io/company-data-api/api/?endpoint=companies&api_key={api_key}'
    
    response = requests.get(url)
    data = response.json()
    
    if data.get('status') == 200:
        print(f"Companies: {len(data['data'])} found")
        return data['data']
    else:
        print(f"Error: {data.get('error')}")
        return None
```

## Browser Compatibility

The Company Data API is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For any questions or suggestions, please open an issue on the GitHub repository.
