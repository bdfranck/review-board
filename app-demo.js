// Configuration
const CONFIG = {
    owner: 'govalta',
    repo: 'ui-components',
    demoMode: true
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

// Load pull requests (using mock data in demo mode)
async function loadPullRequests() {
    const statusEl = document.getElementById('status');
    const boardEl = document.getElementById('board');
    
    statusEl.textContent = 'Loading...';
    boardEl.innerHTML = '<div class="loading">Loading pull requests...</div>';
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const prs = MOCK_DATA;
        
        // Process PRs with review data
        pullRequests = prs.map(pr => {
            const reviews = MOCK_REVIEWS[pr.number] || [];
            const reviewedBy = new Set(reviews.map(review => review.user.login));
            
            const allReviewers = [
                ...pr.requested_reviewers.map(r => r.login),
                ...pr.requested_teams?.map(t => t.name) || []
            ];
            
            const hasReviewers = allReviewers.length > 0 || reviewedBy.size > 0;
            
            return {
                ...pr,
                requestedReviewers: allReviewers,
                reviewedBy: Array.from(reviewedBy),
                hasReviewers
            };
        });
        
        // Collect all unique reviewers
        reviewers = new Set();
        pullRequests.forEach(pr => {
            pr.requestedReviewers.forEach(reviewer => reviewers.add(reviewer));
            pr.reviewedBy.forEach(reviewer => reviewers.add(reviewer));
        });
        
        renderBoard();
        statusEl.textContent = `${pullRequests.length} PRs (Demo Mode)`;
    } catch (error) {
        console.error('Error loading pull requests:', error);
        boardEl.innerHTML = `
            <div class="error">
                <strong>Error loading pull requests:</strong><br>
                ${error.message}
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
