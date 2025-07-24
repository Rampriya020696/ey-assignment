import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { api } from '../services/api';

export function CharacterDetail() {
  const { characterId } = useParams({ from: '/character/$characterId' });
  const navigate = useNavigate();

  const {
    data: character,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => api.getCharacter(Number(characterId)),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading character...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Error loading character: {error?.message || 'Unknown error'}
        </div>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Back to Characters
        </button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Character not found</div>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Back to Characters
        </button>
      </div>
    );
  }

  const statusColors = {
    Alive: 'bg-green-100 text-green-800',
    Dead: 'bg-red-100 text-red-800',
    unknown: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Characters
      </button>

      {/* Character details card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Character image */}
          <div className="md:w-1/3">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Character information */}
          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  statusColors[character.status]
                }`}
              >
                {character.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Species:</span>
                    <span className="ml-2 text-gray-900">{character.species}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className="ml-2 text-gray-900">{character.type || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Gender:</span>
                    <span className="ml-2 text-gray-900">{character.gender}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(character.created).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Origin:</span>
                    <span className="ml-2 text-gray-900">{character.origin.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Current Location:</span>
                    <span className="ml-2 text-gray-900">{character.location.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Episodes */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Episodes</h3>
              <div className="text-sm text-gray-600">
                Appears in {character.episode.length} episode{character.episode.length !== 1 ? 's' : ''}
              </div>
              <div className="mt-2 max-h-32 overflow-y-auto">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
                  {character.episode.map((episodeUrl) => {
                    const episodeNumber = episodeUrl.split('/').pop();
                    return (
                      <span
                        key={episodeUrl}
                        className="inline-flex items-center justify-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        #{episodeNumber}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 