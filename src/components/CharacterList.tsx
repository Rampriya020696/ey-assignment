import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { api } from '../services/api';
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
  }),
  columnHelper.accessor('species', {
    header: 'Species',
    cell: (info) => (
      <div className="text-gray-500">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('gender', {
    header: 'Gender',
    cell: (info) => (
      <div className="text-gray-500">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('location.name', {
    header: 'Location',
    cell: (info) => (
      <div className="text-gray-500 truncate max-w-32" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
  }),
];

export function CharacterList() {
  const navigate = useNavigate();
  const { page } = useSearch({ from: '/' });

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => api.getCharacters(page),
  });

  const table = useReactTable({
    data: data?.results?.slice(0, 10) ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage } });
  };

  const handleRowClick = (character: Character) => {
    navigate({ to: `/character/${character.id}` });
  };

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
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Characters (Page {page} of {data?.info.pages})
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {Math.min(data?.results?.length ?? 0, 10)} of {data?.info.count} characters (10 per page)
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
    </div>
  );
} 