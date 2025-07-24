import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch, Link } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { useState, useMemo, useEffect } from 'react';
import { api, type CharacterFilters } from '../services/api';
import type { Character } from '../types/api';

const columnHelper = createColumnHelper<Character>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <div 
        className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
        title={`View ${info.getValue()} details`}
      >
        {info.getValue()}
      </div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const statusColors = {
        Alive: 'bg-green-100 text-green-800',
        Dead: 'bg-red-100 text-red-800',
        unknown: 'bg-gray-100 text-gray-800',
      };
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            statusColors[status]
          }`}
        >
          {status}
        </span>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor('species', {
    header: 'Species',
    cell: (info) => (
      <div className="text-gray-500">{info.getValue()}</div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor('gender', {
    header: 'Gender',
    cell: (info) => (
      <div className="text-gray-500">{info.getValue()}</div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor('location.name', {
    header: 'Location',
    cell: (info) => (
      <div className="text-gray-500 truncate max-w-32" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
    enableSorting: true,
  }),
];

export function CharacterList() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/' });
  const { page, name, status, species, gender, sortBy, sortOrder } = searchParams;

  const [sorting, setSorting] = useState<SortingState>([
    { id: sortBy, desc: sortOrder === 'desc' },
  ]);

  // Debounced search state for immediate UI feedback
  const [searchInput, setSearchInput] = useState(name);
  const [speciesInput, setSpeciesInput] = useState(species);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== name) {
        handleSearch({ name: searchInput });
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput]); // Only re-run when searchInput changes

  // Debounce species input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (speciesInput !== species) {
        handleSearch({ species: speciesInput });
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [speciesInput]); // Only re-run when speciesInput changes

  // Update searchInput when URL name parameter changes (e.g., from browser back/forward)
  useEffect(() => {
    setSearchInput(name);
  }, [name]);

  // Update speciesInput when URL species parameter changes (e.g., from browser back/forward)
  useEffect(() => {
    setSpeciesInput(species);
  }, [species]);

  const filters: CharacterFilters = useMemo(() => ({
    page,
    name: name || undefined,
    status: status || undefined,
    species: species || undefined,
    gender: gender || undefined,
  }), [page, name, status, species, gender]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['characters', filters],
    queryFn: () => api.getCharacters(filters),
  });

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    enableSorting: true,
    manualSorting: false, // Client-side sorting
  });

  const buildSearchParams = (updates: Partial<CharacterFilters> = {}) => {
    return {
      page: updates.page !== undefined ? updates.page : (updates.page === undefined && Object.keys(updates).length > 0 ? 1 : page),
      name: updates.name !== undefined ? updates.name : name,
      status: updates.status !== undefined ? updates.status : status,
      species: updates.species !== undefined ? updates.species : species,
      gender: updates.gender !== undefined ? updates.gender : gender,
      sortBy: updates.sortBy !== undefined ? updates.sortBy : sortBy,
      sortOrder: updates.sortOrder !== undefined ? updates.sortOrder : sortOrder,
    };
  };

  const handleSearch = (newFilters: Partial<CharacterFilters>) => {
    const params = buildSearchParams({ ...newFilters, page: 1 });
    navigate({ to: '/', search: params as any });
  };

  const handlePageChange = (newPage: number) => {
    const params = buildSearchParams({ page: newPage });
    navigate({ to: '/', search: params as any });
  };

  const handleRowClick = (character: Character) => {
    navigate({ to: `/character/${character.id}` });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSpeciesInput('');
    navigate({ 
      to: '/',
      search: {
        page: 1,
        name: '',
        status: '',
        species: '',
        gender: '',
        sortBy: '',
        sortOrder: 'asc',
      } as any
    });
  };

  const hasActiveFilters = name || status || species || gender;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading characters...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Error loading characters: {error?.message || 'Unknown error'}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by name
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch({ name: searchInput });
                  }
                }}
                placeholder="Search characters..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
                             <button
                 onClick={() => handleSearch({ name: searchInput })}
                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                 title="Search"
               >
                 🔍
               </button>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => handleSearch({ status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Species Filter */}
          <div>
            <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
              Species
            </label>
            <input
              id="species"
              type="text"
              value={speciesInput}
              onChange={(e) => setSpeciesInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch({ species: speciesInput });
                }
              }}
              placeholder="e.g., Human, Alien"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Gender Filter */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => handleSearch({ gender: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {data?.info.count} results found
            </div>
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded hover:border-red-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Characters 
          {data?.info.pages && data?.info.pages > 1 && (
            <span className="text-gray-500"> (Page {page} of {data?.info.pages})</span>
          )}
        </h2>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isFetching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : null}
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? '↕️'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  No characters found. Try adjusting your search or filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.info.pages && data?.info.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {data?.results?.length ?? 0} of {data?.info.count} characters
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!data?.info.prev}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
              {page}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!data?.info.next}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 