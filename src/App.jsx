import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'

// Configuration
const CONFIG = {
  repositories: [
    { owner: 'govalta', repo: 'ui-components' },
    { owner: 'GovAlta', repo: 'design-tokens' }
  ],
  useMockData: true // Set to false to use real GitHub API
};

// Mock data
const MOCK_DATA = [
  {
    number: 123,
    title: "Add new navigation component",
    user: { login: "alice", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" },
    html_url: "https://github.com/govalta/ui-components/pull/123",
    repository: "govalta/ui-components",
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
    repository: "govalta/ui-components",
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
    repository: "govalta/ui-components",
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
    repository: "govalta/ui-components",
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
    repository: "govalta/ui-components",
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
    repository: "govalta/ui-components",
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
    repository: "govalta/ui-components",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 0,
    labels: [{ name: "testing", color: "5319e7" }],
    requested_reviewers: [{ login: "alice" }],
    requested_teams: [],
    draft: false
  },
  // Design tokens repository PRs
  {
    number: 45,
    title: "Update color palette for accessibility",
    user: { login: "frank", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=frank" },
    html_url: "https://github.com/GovAlta/design-tokens/pull/45",
    repository: "GovAlta/design-tokens",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 3,
    labels: [{ name: "accessibility", color: "7057ff" }],
    requested_reviewers: [{ login: "alice" }],
    requested_teams: [],
    draft: false
  },
  {
    number: 46,
    title: "Add new spacing tokens",
    user: { login: "grace", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace" },
    html_url: "https://github.com/GovAlta/design-tokens/pull/46",
    repository: "GovAlta/design-tokens",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 1,
    labels: [{ name: "enhancement", color: "a2eeef" }],
    requested_reviewers: [],
    requested_teams: [],
    draft: false
  },
  {
    number: 47,
    title: "Fix typography token naming",
    user: { login: "henry", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=henry" },
    html_url: "https://github.com/GovAlta/design-tokens/pull/47",
    repository: "GovAlta/design-tokens",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: 5,
    labels: [{ name: "bug", color: "d73a4a" }],
    requested_reviewers: [{ login: "bob" }, { login: "diana" }],
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
  const daysAgo = useMemo(() => {
    const createdDate = new Date(pr.created_at);
    const now = new Date();
    return Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
  }, [pr.created_at]);
  
  return (
    <div className="card" onClick={() => window.open(pr.html_url, '_blank')}>
      <div className="card-header">
        <div className="card-title">#{pr.number}: {pr.title}</div>
        {pr.repository && (
          <div className="card-repo">{pr.repository}</div>
        )}
      </div>
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

  const loadPullRequests = useCallback(async () => {
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
        // Fetch PRs from all configured repositories
        const allPrsPromises = CONFIG.repositories.map(async ({ owner, repo }) => {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`
          );
          
          if (!response.ok) {
            throw new Error(`GitHub API error for ${owner}/${repo}: ${response.status}`);
          }
          
          const prs = await response.json();
          return prs.filter(pr => !pr.draft).map(pr => ({
            ...pr,
            repository: `${owner}/${repo}`
          }));
        });
        
        const allPrsArrays = await Promise.all(allPrsPromises);
        const allPrs = allPrsArrays.flat();
        
        // Fetch reviews for each PR
        const processedPrs = await Promise.all(allPrs.map(async (pr) => {
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
  }, []);

  useEffect(() => {
    loadPullRequests();
  }, [loadPullRequests]);

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
