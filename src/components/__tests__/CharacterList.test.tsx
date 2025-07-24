import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CharacterList } from '../CharacterList'
import { api } from '../../services/api'
import { mockCharactersResponse, mockEmptyResponse } from '../../test/__mocks__/api'

// Mock the API
vi.mock('../../services/api', () => ({
  api: {
    getCharacters: vi.fn(),
  },
}))

// Mock the router hooks
const mockNavigate = vi.fn()
const mockSearchParams = {
  page: 1,
  name: '',
  status: '',
  species: '',
  gender: '',
  sortBy: '',
  sortOrder: 'asc',
}

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockSearchParams,
}))

const mockApi = vi.mocked(api)

// Create a test wrapper with QueryClient
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper
}

describe('CharacterList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
    // Reset search params to default
    Object.assign(mockSearchParams, {
      page: 1,
      name: '',
      status: '',
      species: '',
      gender: '',
      sortBy: '',
      sortOrder: 'asc',
    })
    mockApi.getCharacters.mockResolvedValue(mockCharactersResponse)
  })

  describe('Initial Rendering', () => {
    it('renders loading state initially', () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      expect(screen.getByText('Loading characters...')).toBeInTheDocument()
    })

    it('renders character list after loading', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
        expect(screen.getByText('Morty Smith')).toBeInTheDocument()
        expect(screen.getByText('Summer Smith')).toBeInTheDocument()
      })

      expect(screen.getByText('Characters')).toBeInTheDocument()
    })

    it('calls API with correct initial parameters', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(mockApi.getCharacters).toHaveBeenCalledWith({
          page: 1,
          name: undefined,
          status: undefined,
          species: undefined,
          gender: undefined,
        })
      })
    })
  })

  describe('Search Functionality', () => {
    it('renders search input', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search characters...')
        expect(searchInput).toBeInTheDocument()
        expect(searchInput).toHaveAttribute('type', 'text')
      })
    })

    it('updates search input value when typing', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search characters...')
      await user.type(searchInput, 'Rick')

      expect(searchInput).toHaveValue('Rick')
    })

    it('triggers navigation on Enter key press', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search characters...')
      await user.type(searchInput, 'Rick')
      await user.keyboard('{Enter}')

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '/',
          search: expect.objectContaining({
            name: 'Rick',
            page: 1,
          })
        })
      )
    })
  })

  describe('Filter Functionality', () => {
    it('renders filter controls', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
      })

      expect(screen.getByLabelText('Status')).toBeInTheDocument()
      expect(screen.getByLabelText('Species')).toBeInTheDocument()
      expect(screen.getByLabelText('Gender')).toBeInTheDocument()
    })

    it('filters by status when dropdown value changes', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
      })

      const statusSelect = screen.getByLabelText('Status')
      await user.selectOptions(statusSelect, 'alive')

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '/',
          search: expect.objectContaining({
            status: 'alive',
            page: 1,
          })
        })
      )
    })

    it('updates species input value', async () => {
      const user = userEvent.setup()
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
      })

      const speciesInput = screen.getByPlaceholderText('e.g., Human, Alien')
      await user.type(speciesInput, 'Human')

      expect(speciesInput).toHaveValue('Human')
    })
  })

  describe('Clear Filters', () => {
    it('shows clear filters button when filters are active', async () => {
      // Set mock search params to have active filters
      Object.assign(mockSearchParams, { name: 'Rick' })
      
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Clear Filters')).toBeInTheDocument()
      })
    })

    it('clears filters when clear button is clicked', async () => {
      const user = userEvent.setup()
      // Set mock search params to have active filters
      Object.assign(mockSearchParams, { name: 'Rick', status: 'alive' })
      
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Clear Filters')).toBeInTheDocument()
      })

      const clearButton = screen.getByText('Clear Filters')
      await user.click(clearButton)

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '/',
          search: expect.objectContaining({
            page: 1,
            name: '',
            status: '',
            species: '',
            gender: '',
          })
        })
      )
    })
  })

  describe('Table Elements', () => {
    it('renders character data', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
        expect(screen.getByText('Morty Smith')).toBeInTheDocument()
        expect(screen.getByText('Summer Smith')).toBeInTheDocument()
      })
    })

    it('renders table with headers', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
      })

      // Check for table headers by role
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      // Check for column headers within table (not form labels)
      const tableHeaders = table.querySelectorAll('th')
      expect(tableHeaders).toHaveLength(5)
      
      // Check header text content
      expect(tableHeaders[0]).toHaveTextContent('Name')
      expect(tableHeaders[1]).toHaveTextContent('Status')
      expect(tableHeaders[2]).toHaveTextContent('Species')
      expect(tableHeaders[3]).toHaveTextContent('Gender')
      expect(tableHeaders[4]).toHaveTextContent('Location')
    })
  })

  describe('Pagination', () => {
    it('shows pagination controls', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument()
        expect(screen.getByText('Next')).toBeInTheDocument()
        expect(screen.getByText('1')).toBeInTheDocument() // Current page
      })
    })

    it('disables Previous button on first page', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        const prevButton = screen.getByText('Previous')
        expect(prevButton).toBeDisabled()
      })
    })
  })

  describe('Error Handling', () => {
    it('displays error message when API call fails', async () => {
      mockApi.getCharacters.mockRejectedValue(new Error('API Error'))
      
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Error loading characters/)).toBeInTheDocument()
        expect(screen.getByText('Try Again')).toBeInTheDocument()
      })
    })
  })

  describe('Empty State', () => {
    it('shows empty state message when no characters found', async () => {
      mockApi.getCharacters.mockResolvedValue(mockEmptyResponse)
      
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('No characters found. Try adjusting your search or filters.')).toBeInTheDocument()
      })
    })
  })

  describe('UI Elements', () => {
    it('shows refresh button', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument()
      })
    })

    it('shows search button', async () => {
      const Wrapper = createTestWrapper()
      render(
        <Wrapper>
          <CharacterList />
        </Wrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
      })

      const searchButton = screen.getByTitle('Search')
      expect(searchButton).toBeInTheDocument()
    })
  })
}) 