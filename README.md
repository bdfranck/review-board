# PR Review Board

A Trello-like board for tracking Pull Requests that need review.

## Features

- 📋 **Trello-style Board**: Visual board with columns for easy tracking
- 🔍 **Unassigned PRs**: First column shows PRs with no assigned reviewers
- 👥 **Reviewer Columns**: Each team member gets their own column with assigned PRs
- 🔄 **Real-time Updates**: Refresh button to fetch latest PR data
- 🎨 **Beautiful UI**: Clean, modern interface inspired by Trello

## Usage

### Demo Mode (Recommended for Quick Preview)

Open `demo.html` to see the board with sample data:

```bash
# Using Python 3
python3 server.py
```

Then open http://localhost:8080/demo.html in your browser.

### Live Mode with Real GitHub Data

To connect to the actual GitHub API, use the included proxy server to avoid CORS issues:

```bash
# Start the proxy server
python3 server.py
```

Then open http://localhost:8080/index.html in your browser.

**Note:** The GitHub API has a rate limit of 60 requests per hour for unauthenticated requests. For production use, consider adding authentication (see Configuration section below).

## How It Works

The application:
1. Fetches open, non-draft PRs from `govalta/ui-components` repository
2. Checks each PR for requested reviewers and submitted reviews
3. Organizes PRs into columns:
   - **Needs Review**: PRs with no assigned reviewers
   - **[Reviewer Name]**: One column per reviewer with their assigned PRs

## GitHub API

This app uses the GitHub REST API without authentication. The rate limit for unauthenticated requests is 60 requests per hour. For higher limits, you can add a personal access token (not included for security reasons).

## Configuration

To use this for a different repository, edit the `CONFIG` object in `app.js`:

```javascript
const CONFIG = {
    owner: 'your-org',
    repo: 'your-repo',
    apiBase: 'https://api.github.com'
};
```

## Browser Compatibility

Works in all modern browsers that support ES6+ features:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+