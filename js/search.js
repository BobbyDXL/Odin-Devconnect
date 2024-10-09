// This object will store the content of all searchable pages
const pageContent = {};

// Function to fetch and store page content
async function fetchPageContent(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const content = doc.body.textContent;
        pageContent[url] = content.toLowerCase();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
    }
}

// Fetch content of all searchable pages
async function initializeSearch() {
    const pages = [
        'index.html',
        'faq.html',
        'exploreresources.html',
        'forum.html',
        'resources.html',
        'about.html',
        'login.html',
        'search.html',
        'termsandconditions.html',
        'privacypolicy.html',
        // Add more pages as needed
    ];

    await Promise.all(pages.map(page => fetchPageContent(page)));
}

// Perform the search
function performSearch(query) {
    query = query.toLowerCase();
    const results = [];

    for (const [url, content] of Object.entries(pageContent)) {
        if (content.includes(query)) {
            results.push({ url, title: url.split('.')[0] });
        }
    }

    displayResults(results);
}

// Display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    const resultsList = results.map(result => `
        <li>
            <a href="${result.url}">${result.title}</a>
        </li>
    `).join('');

    resultsContainer.innerHTML = `<ul>${resultsList}</ul>`;
}

// Initialize search when the page loads
document.addEventListener('DOMContentLoaded', initializeSearch);

// Handle search form submission
document.addEventListener('submit', (event) => {
    if (event.target.id === 'search-form') {
        event.preventDefault();
        const query = document.getElementById('search-input').value;
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }
});
