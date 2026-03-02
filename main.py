from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
import asyncio
from crawl4ai import AsyncWebCrawler
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Web Scraper",
    description="Extract clean text content from URLs using crawl4ai",
    version="1.0.0"
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class ScrapeRequest(BaseModel):
    url: HttpUrl

class ScrapeResponse(BaseModel):
    url: str
    title: str
    content: str
    success: bool
    error: str | None = None

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/scrape", response_model=ScrapeResponse)
async def scrape_url(scrape_request: ScrapeRequest):
    url = str(scrape_request.url)
    logger.info(f"Scraping URL: {url}")
    
    try:
        browser_config = BrowserConfig(
            headless=True,
            verbose=False
        )
        
        crawler_config = CrawlerRunConfig(
            word_count_threshold=10,
            excluded_tags=['nav', 'footer', 'aside', 'script', 'style'],
            remove_overlay_elements=True,
            process_iframes=False
        )
        
        async with AsyncWebCrawler(config=browser_config) as crawler:
            result = await crawler.arun(
                url=url,
                config=crawler_config
            )
            
            if result.success:
                return ScrapeResponse(
                    url=url,
                    title=result.metadata.get("title", "No title"),
                    content=result.markdown or result.cleaned_html or "No content extracted",
                    success=True,
                    error=None
                )
            else:
                return ScrapeResponse(
                    url=url,
                    title="",
                    content="",
                    success=False,
                    error=result.error_message or "Unknown error occurred"
                )
                
    except Exception as e:
        logger.error(f"Error scraping {url}: {str(e)}")
        return ScrapeResponse(
            url=url,
            title="",
            content="",
            success=False,
            error=str(e)
        )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "web-scraper"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
