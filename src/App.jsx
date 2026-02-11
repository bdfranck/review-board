import { useState, useEffect } from 'react'
import './App.css'

// Configuration
const CONFIG = {
  owner: 'govalta',
  repo: 'ui-components',
  useMockData: true // Set to false to use real GitHub API
};

// Mock data
const MOCK_DATA = [
  {
    number: 123,
    title: "Add new navigation component",
    user: { login: "alice", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" },
    html_url: "https://github.com/govalta/ui-components/pull/123",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 5,
    labels: [{ name: "feature", color: "0e8a16" }],
    requested_reviewers: [{ login: "bob" }],
    requested_teams: [],
    draft: false
  },
  {
    number: 124,
    title: "Fix button styling issues",
    user: { login: "charlie", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie" },
    html_url: "https://github.com/govalta/ui-components/pull/124",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 2,
    labels: [{ name: "bug", color: "d73a4a" }],
    requested_reviewers: [{ login: "diana" }],
    requested_teams: [],
    draft: false
  },
  {
    number: 125,
    title: "Update documentation for card component",
    user: { login: "bob", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" },
    html_url: "https://github.com/govalta/ui-components/pull/125",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 1,
    labels: [{ name: "documentation", color: "0075ca" }],
    requested_reviewers: [],
    requested_teams: [],
    draft: false
  },
  {
    number: 126,
    title: "Refactor modal component for better accessibility",
    user: { login: "diana", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana" },
    html_url: "https://github.com/govalta/ui-components/pull/126",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 8,
    labels: [
      { name: "enhancement", color: "a2eeef" },
      { name: "accessibility", color: "7057ff" }
    ],
    requested_reviewers: [{ login: "alice" }, { login: "bob" }],
    requested_teams: [],
    draft: false
  },
  {
    number: 127,
    title: "Add dark mode support",
    user: { login: "eve", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=eve" },
    html_url: "https://github.com/govalta/ui-components/pull/127",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 12,
    labels: [{ name: "feature", color: "0e8a16" }],
    requested_reviewers: [],
    requested_teams: [],
    draft: false
  },
  {
    number: 128,
    title: "Performance improvements for table component",
    user: { login: "alice", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" },
    html_url: "https://github.com/govalta/ui-components/pull/128",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 3,
    labels: [{ name: "performance", color: "fbca04" }],
    requested_reviewers: [{ login: "diana" }],
    requested_teams: [],
    draft: false
  },
  {
    number: 129,
    title: "Add unit tests for tooltip component",
    user: { login: "bob", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" },
    html_url: "https://github.com/govalta/ui-components/pull/129",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 0,
    labels: [{ name: "testing", color: "5319e7" }],
    requested_reviewers: [{ login: "alice" }],
    requested_teams: [],
    draft: false
  }
];

const MOCK_REVIEWS = {
  126: [{ user: { login: "alice" } }],
  128: [{ user: { login: "bob" } }]
};

// Utility function
function getTextColorForBackground(hexColor) {
  const color = parseInt(hexColor, 16);
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#172b4d' : '#fff';
}

// Card component
function Card({ pr }) {
  const createdDate = new Date(pr.created_at);
  const daysAgo = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="card" onClick={() => window.open(pr.html_url, '_blank')}>
      <div className="card-title">#{pr.number}: {pr.title}</div>
      <div className="card-meta">
        <span className="card-meta-item">📅 {daysAgo}d ago</span>
        <span className="card-meta-item">💬 {pr.comments}</span>
      </div>
      {pr.labels && pr.labels.length > 0 && (
        <div className="card-labels">
          {pr.labels.slice(0, 3).map((label, idx) => (
            <span
              key={idx}
              className="card-label"
              style={{
                backgroundColor: `#${label.color}`,
                color: getTextColorForBackground(label.color)
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      <div className="card-author">
        <img src={pr.user.avatar_url} alt={pr.user.login} className="card-author-avatar" />
        <span>{pr.user.login}</span>
      </div>
    </div>
  );
}

// Column component
function Column({ title, prs }) {
  return (
    <div className="column">
      <div className="column-header">
        <span>{title}</span>
        <span className="column-count">{prs.length}</span>
      </div>
      <div className="column-cards">
        {prs.length === 0 ? (
          <div className="empty-column">No pull requests</div>
        ) : (
          prs.map(pr => <Card key={pr.number} pr={pr} />)
        )}
      </div>
    </div>
  );
}

function App() {
  const [pullRequests, setPullRequests] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [status, setStatus] = useState('Loading...');
  const [loading, setLoading] = useState(false);

  const loadPullRequests = async () => {
    setLoading(true);
    setStatus('Loading...');
    
    try {
      if (CONFIG.useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Process mock data
        const processedPrs = MOCK_DATA.map(pr => {
          const reviews = MOCK_REVIEWS[pr.number] || [];
          const reviewedBy = new Set(reviews.map(review => review.user.login));
          
          const allReviewers = [
            ...pr.requested_reviewers.map(r => r.login),
            ...(pr.requested_teams?.map(t => t.name) || [])
          ];
          
          const hasReviewers = allReviewers.length > 0 || reviewedBy.size > 0;
          
          return {
            ...pr,
            requestedReviewers: allReviewers,
            reviewedBy: Array.from(reviewedBy),
            hasReviewers
          };
        });
        
        // Collect reviewers
        const reviewerSet = new Set();
        processedPrs.forEach(pr => {
          pr.requestedReviewers.forEach(reviewer => reviewerSet.add(reviewer));
          pr.reviewedBy.forEach(reviewer => reviewerSet.add(reviewer));
        });
        
        setPullRequests(processedPrs);
        setReviewers(Array.from(reviewerSet).sort());
        setStatus(`${processedPrs.length} PRs (Demo Mode)`);
      } else {
        // Real API call
        const response = await fetch(
          `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/pulls?state=open&per_page=100`
        );
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const prs = await response.json();
        const openPrs = prs.filter(pr => !pr.draft);
        
        // Fetch reviews for each PR
        const processedPrs = await Promise.all(openPrs.map(async (pr) => {
          try {
            const reviewsResponse = await fetch(pr.reviews_url);
            const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];
            const reviewedBy = new Set(reviews.map(review => review.user.login));
            
            const allReviewers = [
              ...pr.requested_reviewers.map(r => r.login),
              ...(pr.requested_teams?.map(t => t.name) || [])
            ];
            
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
        
        // Collect reviewers
        const reviewerSet = new Set();
        processedPrs.forEach(pr => {
          pr.requestedReviewers.forEach(reviewer => reviewerSet.add(reviewer));
          pr.reviewedBy.forEach(reviewer => reviewerSet.add(reviewer));
        });
        
        setPullRequests(processedPrs);
        setReviewers(Array.from(reviewerSet).sort());
        setStatus(`${processedPrs.length} PRs loaded`);
      }
    } catch (error) {
      console.error('Error loading pull requests:', error);
      setStatus('Error loading PRs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPullRequests();
  }, []);

  const unassignedPrs = pullRequests.filter(pr => !pr.hasReviewers);

  return (
    <div className="app">
      <div className="header">
        <h1>PR Review Board</h1>
        <div className="header-controls">
          <button 
            id="refresh-btn" 
            className="btn" 
            onClick={loadPullRequests}
            disabled={loading}
          >
            🔄 Refresh
          </button>
          <div className="status">{status}</div>
        </div>
      </div>
      
      <div className="board">
        <Column title="Needs Review" prs={unassignedPrs} />
        {reviewers.map(reviewer => {
          const reviewerPrs = pullRequests.filter(pr => 
            pr.requestedReviewers.includes(reviewer) || pr.reviewedBy.includes(reviewer)
          );
          return <Column key={reviewer} title={reviewer} prs={reviewerPrs} />;
        })}
      </div>
    </div>
  );
}

export default App
