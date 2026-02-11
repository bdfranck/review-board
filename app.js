// Configuration
const CONFIG = {
    owner: 'govalta',
    repo: 'ui-components',
    // Use proxy when running via server.js, direct API otherwise
    apiBase: window.location.hostname === 'localhost' ? '/api' : 'https://api.github.com'
};

// State
let pullRequests = [];
let reviewers = new Set();

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadPullRequests();
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadPullRequests();
    });
});

// Fetch pull requests from GitHub API
async function loadPullRequests() {
    const statusEl = document.getElementById('status');
    const boardEl = document.getElementById('board');
    
    statusEl.textContent = 'Loading...';
    boardEl.innerHTML = '<div class="loading">Loading pull requests...</div>';
    
    try {
        // Fetch open pull requests
        const response = await fetch(
            `${CONFIG.apiBase}/repos/${CONFIG.owner}/${CONFIG.repo}/pulls?state=open&per_page=100`
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const prs = await response.json();
        
        // Filter out draft PRs and fetch reviews for each PR
        const openPrs = prs.filter(pr => !pr.draft);
        
        // Fetch reviews and requested reviewers for each PR
        pullRequests = await Promise.all(openPrs.map(async (pr) => {
            try {
                const reviewsResponse = await fetch(pr.url + '/reviews');
                const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];
                
                // Get unique reviewers who have submitted reviews
                const reviewedBy = new Set(reviews.map(review => review.user.login));
                
                // Combine requested reviewers and those who have reviewed
                const allReviewers = [
                    ...pr.requested_reviewers.map(r => r.login),
                    ...pr.requested_teams?.map(t => t.name) || []
                ];
                
                // Determine if PR has no reviewers
                const hasReviewers = allReviewers.length > 0 || reviewedBy.size > 0;
                
                return {
                    ...pr,
                    requestedReviewers: allReviewers,
                    reviewedBy: Array.from(reviewedBy),
                    hasReviewers
                };
            } catch (error) {
                console.error(`Error fetching reviews for PR #${pr.number}:`, error);
                return {
                    ...pr,
                    requestedReviewers: pr.requested_reviewers.map(r => r.login),
                    reviewedBy: [],
                    hasReviewers: pr.requested_reviewers.length > 0
                };
            }
        }));
        
        // Collect all unique reviewers
        reviewers = new Set();
        pullRequests.forEach(pr => {
            pr.requestedReviewers.forEach(reviewer => reviewers.add(reviewer));
            pr.reviewedBy.forEach(reviewer => reviewers.add(reviewer));
        });
        
        renderBoard();
        statusEl.textContent = `${pullRequests.length} PRs loaded`;
    } catch (error) {
        console.error('Error loading pull requests:', error);
        boardEl.innerHTML = `
            <div class="error">
                <strong>Error loading pull requests:</strong><br>
                ${error.message}<br><br>
                Make sure you have access to the repository and the GitHub API is available.
            </div>
        `;
        statusEl.textContent = 'Error';
    }
}

// Render the board with columns
function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    
    // Column 1: Unassigned PRs (no reviewers)
    const unassignedPrs = pullRequests.filter(pr => !pr.hasReviewers);
    renderColumn('Needs Review', unassignedPrs, boardEl);
    
    // Columns for each reviewer
    const sortedReviewers = Array.from(reviewers).sort();
    sortedReviewers.forEach(reviewer => {
        const reviewerPrs = pullRequests.filter(pr => 
            pr.requestedReviewers.includes(reviewer) || pr.reviewedBy.includes(reviewer)
        );
        renderColumn(reviewer, reviewerPrs, boardEl);
    });
}

// Render a single column
function renderColumn(title, prs, boardEl) {
    const column = document.createElement('div');
    column.className = 'column';
    
    const header = document.createElement('div');
    header.className = 'column-header';
    header.innerHTML = `
        <span>${title}</span>
        <span class="column-count">${prs.length}</span>
    `;
    
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'column-cards';
    
    if (prs.length === 0) {
        cardsContainer.innerHTML = '<div class="empty-column">No pull requests</div>';
    } else {
        prs.forEach(pr => {
            const card = createCard(pr);
            cardsContainer.appendChild(card);
        });
    }
    
    column.appendChild(header);
    column.appendChild(cardsContainer);
    boardEl.appendChild(column);
}

// Create a card for a pull request
function createCard(pr) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => window.open(pr.html_url, '_blank');
    
    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = `#${pr.number}: ${pr.title}`;
    
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    
    // Add metadata
    const createdDate = new Date(pr.created_at);
    const daysAgo = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
    
    meta.innerHTML = `
        <span class="card-meta-item">📅 ${daysAgo}d ago</span>
        <span class="card-meta-item">💬 ${pr.comments}</span>
    `;
    
    const author = document.createElement('div');
    author.className = 'card-author';
    author.innerHTML = `
        <img src="${pr.user.avatar_url}" alt="${pr.user.login}" class="card-author-avatar">
        <span>${pr.user.login}</span>
    `;
    
    // Add labels if any
    if (pr.labels && pr.labels.length > 0) {
        const labels = document.createElement('div');
        labels.className = 'card-labels';
        pr.labels.slice(0, 3).forEach(label => {
            const labelEl = document.createElement('span');
            labelEl.className = 'card-label';
            labelEl.textContent = label.name;
            labelEl.style.backgroundColor = `#${label.color}`;
            // Calculate if we need dark or light text based on background color
            const color = parseInt(label.color, 16);
            const r = (color >> 16) & 255;
            const g = (color >> 8) & 255;
            const b = color & 255;
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            labelEl.style.color = brightness > 128 ? '#172b4d' : '#fff';
            labels.appendChild(labelEl);
        });
        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(labels);
        card.appendChild(author);
    } else {
        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(author);
    }
    
    return card;
}
