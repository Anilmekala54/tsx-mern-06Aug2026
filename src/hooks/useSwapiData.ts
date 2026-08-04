import { useCallback, useEffect, useState } from 'react';
import { ApiError, fetchAllFilms, fetchAllPeople, fetchAllPlanets, fetchAllSpecies } from '../api';
import type { SwFilm, SwPerson, SwPlanet, SwSpecies } from '../types';
import { idFromUrl } from '../types';

export interface SwapiData {
  people: SwPerson[];
  speciesById: Map<string, SwSpecies>;
  filmsByUrl: Map<string, SwFilm>;
  planetsByUrl: Map<string, SwPlanet>;
}

interface State {
  data: SwapiData | null;
  loading: boolean;
  error: string | null;
}

export function useSwapiData() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    Promise.all([fetchAllPeople(), fetchAllSpecies(), fetchAllFilms(), fetchAllPlanets()])
      .then(([people, species, films, planets]) => {
        if (cancelled) return;
        const speciesById = new Map(species.map((s) => [idFromUrl(s.url), s]));
        const filmsByUrl = new Map(films.map((f) => [f.url, f]));
        const planetsByUrl = new Map(planets.map((p) => [p.url, p]));
        setState({ data: { people, speciesById, filmsByUrl, planetsByUrl }, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : 'Something went wrong loading Star Wars data.';
        setState({ data: null, loading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return { ...state, reload };
}
