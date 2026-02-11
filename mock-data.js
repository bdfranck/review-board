// Mock data for demonstration
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

// Mock reviews data
const MOCK_REVIEWS = {
    126: [{ user: { login: "alice" } }],
    128: [{ user: { login: "bob" } }]
};
