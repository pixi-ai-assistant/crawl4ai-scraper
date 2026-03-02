# Web Scraper

A clean, modern web scraping application built with FastAPI and crawl4ai. Extract clean text content from any URL without HTML clutter.

## Features

- 🚀 FastAPI backend for high-performance async processing
- 🤖 crawl4ai integration for intelligent content extraction
- 🎨 **Terminal-inspired dark UI** with monospace fonts and neon accents
- 🔧 **Smart URL fixing** - automatically corrects malformed relative URLs
- 📋 One-click copy to clipboard
- ⚡ Real-time validation and error handling
- 🎯 Removes navigation, footers, ads, and other clutter

## Installation

1. **Clone or create the project directory:**
```bash
cd web-scraper
```

2. **Create a virtual environment (recommended):**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Install Playwright browsers (required by crawl4ai):**
```bash
playwright install chromium
```

## Usage

1. **Start the server:**
```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload
```

2. **Open your browser and navigate to:**
```
http://localhost:8000
```

3. **Enter a URL** in the input field and click "Scrape" to extract clean text content.

## API Endpoints

- `GET /` - Main web interface
- `POST /api/scrape` - Scrape a URL and return clean content
  - Request body: `{"url": "https://example.com"}`
  - Response: `{"url": "...", "title": "...", "content": "...", "success": true/false, "error": "..."}`
- `GET /api/health` - Health check endpoint

## Project Structure

```
.
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── templates/
│   └── index.html         # Main UI template
└── static/
    ├── css/
    │   └── style.css      # Application styles
    └── js/
        └── app.js         # Frontend JavaScript
```

## Configuration

The scraper can be configured in `main.py`:

- `word_count_threshold`: Minimum words per text block (default: 10)
- `excluded_tags`: HTML tags to exclude (nav, footer, aside, script, style)
- `remove_overlay_elements`: Remove modal popups and overlays
- `headless`: Run browser in headless mode (default: True)

## Browser Support

The application uses Playwright with Chromium for web scraping. Make sure you have:

- Python 3.8+
- Playwright browsers installed (`playwright install chromium`)
- Sufficient system resources (2GB+ RAM recommended)

## Troubleshooting

**Error: Browser not found**
- Run: `playwright install chromium`

**Error: Timeout while scraping**
- Some websites block scrapers. Try a different URL.
- Check your internet connection.

**Slow performance**
- First scrape may be slower as Playwright initializes
- Subsequent scrapes will be faster

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

- [crawl4ai](https://github.com/unclecode/crawl4ai) - Web crawling and scraping library
- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [Playwright](https://playwright.dev/) - Browser automation
