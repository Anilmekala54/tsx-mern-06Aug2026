import { useMemo, useState } from 'react';
import type { SwapiData } from '../hooks/useSwapiData';
import type { SwPerson } from '../types';
import { idFromUrl } from '../types';
import { CharacterCard, speciesNameFor } from './CharacterCard';
import { CharacterModal } from './CharacterModal';
import { Pagination } from './Pagination';
import { SearchFilterBar, type FilterOption } from './SearchFilterBar';

const PAGE_SIZE = 12;

export function CharacterBrowser({ data }: { data: SwapiData }) {
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState('');
  const [homeworld, setHomeworld] = useState('');
  const [film, setFilm] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SwPerson | null>(null);

  const speciesOptions: FilterOption[] = useMemo(() => {
    const names = new Set<string>();
    data.people.forEach((p) => names.add(speciesNameFor(p, data.speciesById)));
    return Array.from(names)
      .sort()
      .map((name) => ({ value: name, label: name }));
  }, [data.people, data.speciesById]);

  const homeworldOptions: FilterOption[] = useMemo(() => {
    const urls = new Set<string>();
    data.people.forEach((p) => urls.add(p.homeworld));
    return Array.from(urls)
      .map((url) => ({ value: url, label: data.planetsByUrl.get(url)?.name ?? `Unknown (${idFromUrl(url)})` }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data.people, data.planetsByUrl]);

  const filmOptions: FilterOption[] = useMemo(
    () =>
      Array.from(data.filmsByUrl.values())
        .sort((a, b) => a.episode_id - b.episode_id)
        .map((f) => ({ value: f.url, label: `Ep. ${f.episode_id}: ${f.title}` })),
    [data.filmsByUrl],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.people.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (species && speciesNameFor(p, data.speciesById) !== species) return false;
      if (homeworld && p.homeworld !== homeworld) return false;
      if (film && !p.films.includes(film)) return false;
      return true;
    });
  }, [data.people, data.speciesById, query, species, homeworld, film]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  function updateFilterAndResetPage<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <>
      <SearchFilterBar
        query={query}
        onQueryChange={updateFilterAndResetPage(setQuery)}
        species={species}
        onSpeciesChange={updateFilterAndResetPage(setSpecies)}
        speciesOptions={speciesOptions}
        homeworld={homeworld}
        onHomeworldChange={updateFilterAndResetPage(setHomeworld)}
        homeworldOptions={homeworldOptions}
        film={film}
        onFilmChange={updateFilterAndResetPage(setFilm)}
        filmOptions={filmOptions}
        resultCount={filtered.length}
      />

      {pageItems.length === 0 ? (
        <p className="text-center py-15 px-5 text-text-muted font-mono text-sm">
          No characters match your search and filters.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {pageItems.map((person) => (
            <CharacterCard key={person.url} person={person} speciesById={data.speciesById} onSelect={setSelected} />
          ))}
        </div>
      )}

      <Pagination page={clampedPage} totalPages={totalPages} onChange={setPage} />

      {selected && <CharacterModal person={selected} speciesById={data.speciesById} onClose={() => setSelected(null)} />}
    </>
  );
}
