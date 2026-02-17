# PR Review Board

A Trello-like board for tracking Pull Requests that need review, built with **Vite + React**.

## Features

- 📋 **Trello-style Board**: Visual board with columns for easy tracking
- 🔍 **Unassigned PRs**: First column shows PRs with no assigned reviewers
- 👥 **Reviewer Columns**: Each team member gets their own column with assigned PRs
- 🔄 **Real-time Updates**: Refresh button to fetch latest PR data
- 🎨 **Beautiful UI**: Clean, modern interface inspired by Trello
- ⚡ **Fast & Modern**: Built with Vite for blazing fast HMR (Hot Module Replacement)

## Tech Stack

- **Vite** - Next generation frontend tooling
- **React 19** - Modern React with hooks
- **Vanilla CSS** - No CSS framework needed for clean styling
- **GitHub API** - Fetches PR data in real-time

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Configuration

To change the repositories being tracked, edit the `CONFIG` object in `src/App.jsx`:

```javascript
const CONFIG = {
  repositories: [
    { owner: 'govalta', repo: 'ui-components' },
    { owner: 'GovAlta', repo: 'design-tokens' }
  ],
  useMockData: true // Set to false to use real GitHub API
};
```

**Note:** The GitHub API has a rate limit of 60 requests per hour for unauthenticated requests. For production use, consider adding authentication.

## How It Works

The application:
1. Fetches open, non-draft PRs from all configured GitHub repositories
2. Checks each PR for requested reviewers and submitted reviews
3. Organizes PRs into columns:
   - **Needs Review**: PRs with no assigned reviewers
   - **[Reviewer Name]**: One column per reviewer with their assigned PRs
4. Displays repository information on each PR card for easy identification

## Development

### Linting

```bash
npm run lint
```

### Project Structure

```
src/
  ├── App.jsx        # Main application component with board logic
  ├── App.css        # Trello-inspired styles
  ├── main.jsx       # Application entry point
  └── index.css      # Global styles
```

## Browser Compatibility

Works in all modern browsers that support ES6+ and React 19:
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+
