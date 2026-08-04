import type { SwFilm, SwPerson, SwPlanet, SwSpecies } from './types';

const BASE_URL = 'https://swapi.info/api';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError('Network error - the API server appears to be unreachable.');
  }
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// swapi.info returns the full collection in a single array (no server-side
// paging), so pagination for the UI is implemented client-side once the
// full list has been fetched.
export function fetchAllPeople(): Promise<SwPerson[]> {
  return getJson<SwPerson[]>(`${BASE_URL}/people`);
}

export function fetchAllSpecies(): Promise<SwSpecies[]> {
  return getJson<SwSpecies[]>(`${BASE_URL}/species`);
}

export function fetchAllFilms(): Promise<SwFilm[]> {
  return getJson<SwFilm[]>(`${BASE_URL}/films`);
}

export function fetchAllPlanets(): Promise<SwPlanet[]> {
  return getJson<SwPlanet[]>(`${BASE_URL}/planets`);
}

export function fetchPlanet(url: string): Promise<SwPlanet> {
  return getJson<SwPlanet>(url);
}

export { ApiError };
