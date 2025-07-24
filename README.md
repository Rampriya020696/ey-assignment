# Rick & Morty Character Browser

A modern, responsive web application for browsing Rick & Morty characters with advanced search, filtering, and sorting capabilities.

## Features

### Core Functionality
- **Character Browsing** - View detailed character information from the Rick & Morty universe
- **Real-time Search** - Search characters by name with 500ms debouncing
- **Advanced Filtering** - Filter by status (Alive/Dead/Unknown), species, and gender
- **Table Sorting** - Sort by any column (Name, Status, Species, Gender, Location)
- **Pagination** - Navigate through multiple pages of results
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### Advanced Features
- **Debounced Search** - Optimized API calls with 500ms delay
- **URL Synchronization** - All filters persist in URL for bookmarking/sharing
- **Clear Filters** - One-click reset of all search and filter criteria
- **Empty States** - Helpful messages when no results found
- **Error Handling** - Graceful error display with retry functionality
- **Loading States** - Smooth loading indicators throughout the app

## Technologies Used

### Frontend Framework & Libraries
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full IntelliSense
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first styling framework

### State Management & Data Fetching
- **TanStack React Query** - Server state management with caching
- **TanStack React Router** - Type-safe routing with search params
- **TanStack React Table** - Powerful table with sorting and pagination

### Testing Framework
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for testing

### API Integration
- **Rick & Morty API** - External REST API for character data
- **Custom API Service** - Abstracted API calls with TypeScript interfaces

## Project Structure

```
ey-assignment/
├── src/
│   ├── components/           # React components
│   │   ├── CharacterList.tsx    # Main character table with search/filter
│   │   ├── CharacterDetail.tsx  # Individual character view
│   │   └── __tests__/           # Component tests
│   ├── services/             # API and business logic
│   │   └── api.ts              # Rick & Morty API integration
│   ├── types/                # TypeScript type definitions
│   │   └── api.ts              # API response types
│   ├── test/                 # Testing configuration
│   │   ├── setup.ts            # Test environment setup
│   │   └── __mocks__/          # Mock data for testing
│   ├── App.tsx               # Root application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles
│   └── router.tsx            # Application routing configuration
├── screenshots/              # Documentation screenshots
│   ├── character-list.png       # Main character browser view
│   ├── search-filters.png       # Search and filter functionality
│   ├── character-detail.png     # Individual character details
│   ├── mobile-view.png          # Mobile responsive design
│   ├── error-states.png         # Error handling and empty states
│   └── README.md                # Screenshot taking guide
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ey-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run test`** - Run test suite
- **`npm run test:ui`** - Run tests with UI
- **`npm run test:coverage`** - Run tests with coverage report
- **`npm run type-check`** - Type checking without compilation

## Testing

The project includes comprehensive test coverage with:

- **Unit Tests** - Component logic and functionality
- **Integration Tests** - API integration and user interactions
- **UI Tests** - User interface behavior and accessibility

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:ui
```

### Test Coverage Areas
- Search functionality with debouncing
- Filter controls (status, species, gender)
- Table sorting and pagination
- Error handling and empty states
- URL synchronization
- Clear filters functionality

## UI/UX Features

### Design System
- **Clean Interface** - Modern, minimalist design
- **Responsive Layout** - Mobile-first responsive design
- **Interactive Elements** - Hover states and smooth transitions
- **Status Indicators** - Color-coded character status badges
- **Loading States** - Skeleton loading and spinners

### User Experience
- **Fast Search** - Instant visual feedback with debounced API calls
- **Intuitive Filtering** - Easy-to-use dropdown and input filters
- **Clear Visual Hierarchy** - Well-organized information layout
- **Accessibility** - Keyboard navigation and screen reader support

## Development Features

### Code Quality
- **TypeScript** - Full type safety throughout the application
- **ESLint** - Code linting for consistency and best practices
- **Component Testing** - Comprehensive React Testing Library tests
- **Git Hooks** - Pre-commit validation (if configured)

### Performance Optimizations
- **Debounced Search** - Reduces unnecessary API calls
- **React Query Caching** - Intelligent data caching and background updates
- **Optimized Builds** - Tree-shaking and code splitting with Vite
- **Efficient Re-renders** - Optimized React component updates

## API Integration

### Rick & Morty API
- **Base URL**: `https://rickandmortyapi.com/api`
- **Character Endpoint**: `/character`
- **Supported Filters**: name, status, species, gender
- **Pagination**: Built-in pagination support


