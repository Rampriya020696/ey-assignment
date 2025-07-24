import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { CharacterList } from './components/CharacterList';
import { CharacterDetail } from './components/CharacterDetail';


// Root route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Rick & Morty Characters</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  ),
});

// Character list route with search parameters
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      name: (search.name as string) || '',
      status: (search.status as 'alive' | 'dead' | 'unknown' | '') || '',
      species: (search.species as string) || '',
      gender: (search.gender as 'female' | 'male' | 'genderless' | 'unknown' | '') || '',
      sortBy: (search.sortBy as string) || '',
      sortOrder: (search.sortOrder as 'asc' | 'desc') || 'asc',
    };
  },
  component: CharacterList,
});

// Character detail route
const characterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$characterId',
  component: CharacterDetail,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, characterRoute]);

// Create the router
export const router = createRouter({ routeTree }); 