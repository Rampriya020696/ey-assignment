import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock fetch globally
Object.defineProperty(globalThis, 'fetch', {
  value: vi.fn(),
  writable: true,
})

// Mock router functions
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearch: () => ({
      page: 1,
      name: '',
      status: '',
      species: '',
      gender: '',
      sortBy: '',
      sortOrder: 'asc',
    }),
  }
}) 