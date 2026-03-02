document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const scrapeBtn = document.getElementById('scrapeBtn');
    const btnText = scrapeBtn.querySelector('.btn-text');
    const spinner = scrapeBtn.querySelector('.spinner');
    const resultSection = document.getElementById('resultSection');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const resultMeta = document.getElementById('resultMeta');
    const errorSection = document.getElementById('errorSection');
    const errorText = document.getElementById('errorText');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Validate URL format
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    // Show loading state
    function setLoading(loading) {
        scrapeBtn.disabled = loading;
        btnText.textContent = loading ? 'Scraping...' : 'Scrape';
        spinner.classList.toggle('hidden', !loading);
    }

    // Hide all result sections
    function hideResults() {
        resultSection.classList.add('hidden');
        errorSection.classList.add('hidden');
    }

    // Display success result
    function showResult(data) {
        hideResults();
        resultTitle.textContent = data.title || 'Untitled Page';
        resultText.textContent = data.content;
        resultMeta.textContent = `URL: ${data.url}`;
        resultSection.classList.remove('hidden');
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Display error
    function showError(message) {
        hideResults();
        errorText.textContent = message;
        errorSection.classList.remove('hidden');
        
        // Scroll to error
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Handle scrape action
    async function handleScrape() {
        const url = urlInput.value.trim();
        
        // Validation
        if (!url) {
            showError('Please enter a URL');
            urlInput.focus();
            return;
        }
        
        if (!isValidUrl(url)) {
            showError('Please enter a valid URL (e.g., https://example.com)');
            urlInput.focus();
            return;
        }

        setLoading(true);
        hideResults();

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to scrape URL');
            }

            if (data.success) {
                showResult(data);
            } else {
                showError(data.error || 'Failed to extract content from this URL');
            }
        } catch (error) {
            console.error('Scrape error:', error);
            showError(error.message || 'An error occurred while scraping. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Copy content to clipboard
    async function handleCopy() {
        const content = resultText.textContent;
        
        try {
            await navigator.clipboard.writeText(content);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            showError('Failed to copy to clipboard');
        }
    }

    // Clear all results
    function handleClear() {
        urlInput.value = '';
        hideResults();
        urlInput.focus();
    }

    // Event listeners
    scrapeBtn.addEventListener('click', handleScrape);
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleScrape();
        }
    });

    copyBtn.addEventListener('click', handleCopy);
    clearBtn.addEventListener('click', handleClear);

    // Focus input on load
    urlInput.focus();
});
