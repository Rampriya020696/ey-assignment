import type { Character, CharactersResponse } from '../types/api';

const BASE_URL = 'https://rickandmortyapi.com/api';

export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: 'alive' | 'dead' | 'unknown' | '';
  species?: string;
  gender?: 'female' | 'male' | 'genderless' | 'unknown' | '';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const api = {
  getCharacters: async (filters: CharacterFilters = {}): Promise<CharactersResponse> => {
    const params = new URLSearchParams();
    
    // Add pagination
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    
    // Add search and filters
    if (filters.name) {
      params.append('name', filters.name);
    }
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    
    if (filters.species) {
      params.append('species', filters.species);
    }
    
    if (filters.gender) {
      params.append('gender', filters.gender);
    }

    const url = `${BASE_URL}/character${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch characters: ${response.status}`);
    }
    return response.json();
  },

  getCharacter: async (id: number): Promise<Character> => {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch character: ${response.status}`);
    }
    return response.json();
  },
}; 