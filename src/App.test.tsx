import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DEMO_PASSWORD, DEMO_USERNAME } from './auth/mockJwt';
import type { SwFilm, SwPerson, SwPlanet, SwSpecies } from './types';

const tatooine: SwPlanet = {
  name: 'Tatooine',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  residents: ['https://swapi.info/api/people/1', 'https://swapi.info/api/people/2'],
  films: [],
  created: '2014-12-09T13:50:49.641000Z',
  edited: '2014-12-20T20:58:18.411000Z',
  url: 'https://swapi.info/api/planets/1',
};

const aNewHope: SwFilm = {
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl: '...',
  director: 'George Lucas',
  producer: 'Gary Kurtz',
  release_date: '1977-05-25',
  characters: ['https://swapi.info/api/people/1'],
  planets: [],
  starships: [],
  vehicles: [],
  species: [],
  created: '',
  edited: '',
  url: 'https://swapi.info/api/films/1',
};

const humanSpecies: SwSpecies = {
  name: 'Human',
  classification: 'mammal',
  designation: 'sentient',
  average_height: '180',
  skin_colors: 'varies',
  hair_colors: 'varies',
  eye_colors: 'varies',
  average_lifespan: '120',
  homeworld: 'https://swapi.info/api/planets/1',
  language: 'Galactic Basic',
  people: [],
  films: [],
  created: '',
  edited: '',
  url: 'https://swapi.info/api/species/1',
};

const luke: SwPerson = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.info/api/planets/1',
  films: ['https://swapi.info/api/films/1'],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.info/api/people/1',
};

const leia: SwPerson = {
  ...luke,
  name: 'Leia Organa',
  height: '150',
  mass: '49',
  gender: 'female',
  url: 'https://swapi.info/api/people/2',
};

function mockFetchImplementation(url: string): Promise<Response> {
  const respond = (body: unknown) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    } as Response);

  if (url === 'https://swapi.info/api/people') return respond([luke, leia]);
  if (url === 'https://swapi.info/api/species') return respond([humanSpecies]);
  if (url === 'https://swapi.info/api/films') return respond([aNewHope]);
  if (url === 'https://swapi.info/api/planets') return respond([tatooine]);
  if (url === 'https://swapi.info/api/planets/1') return respond(tatooine);

  return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve(null) } as Response);
}

describe('Character modal', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(mockFetchImplementation));
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens with the correct information for the selected character', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Log in through the mocked auth flow.
    await user.type(screen.getByLabelText(/username/i), DEMO_USERNAME);
    await user.type(screen.getByLabelText(/^password$/i), DEMO_PASSWORD);
    await user.click(screen.getByRole('button', { name: /enter archive/i }));

    // Wait for the character list to load.
    const leiaCard = await screen.findByRole('button', { name: /view details for leia organa/i });
    const lukeCard = screen.getByRole('button', { name: /view details for luke skywalker/i });
    expect(lukeCard).toBeInTheDocument();

    // Open Leia's card specifically, to prove the modal binds to the clicked person.
    await user.click(leiaCard);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Leia Organa' })).toBeInTheDocument();
    // 150cm -> 1.50 m, distinguishing it from Luke's 172cm.
    expect(within(dialog).getByText('1.50 m')).toBeInTheDocument();
    expect(within(dialog).getByText('49 kg')).toBeInTheDocument();
    expect(within(dialog).getByText('19BBY')).toBeInTheDocument();

    await waitFor(() => {
      expect(within(dialog).getByText('Tatooine')).toBeInTheDocument();
    });
  });
});
