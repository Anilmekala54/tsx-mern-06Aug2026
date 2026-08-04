import { useEffect, useRef, useState } from 'react';
import { fetchPlanet } from '../api';
import type { SwPerson, SwPlanet, SwSpecies } from '../types';
import { formatDateDDMMYYYY, formatMassKg, heightToMeters } from '../utils/format';
import { speciesNameFor } from './CharacterCard';

interface Props {
  person: SwPerson;
  speciesById: Map<string, SwSpecies>;
  onClose: () => void;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-bg-grid border border-border rounded-lg px-3 py-2.5">
      <p className="font-mono text-[0.65rem] tracking-wide uppercase text-text-muted m-0 mb-1">{label}</p>
      <p className="font-mono text-[0.95rem] m-0">{value}</p>
    </div>
  );
}

export function CharacterModal({ person, speciesById, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [homeworld, setHomeworld] = useState<SwPlanet | null>(null);
  const [homeworldError, setHomeworldError] = useState<string | null>(null);
  const [homeworldLoading, setHomeworldLoading] = useState(true);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setHomeworldLoading(true);
    setHomeworldError(null);
    fetchPlanet(person.homeworld)
      .then((planet) => {
        if (!cancelled) setHomeworld(planet);
      })
      .catch(() => {
        if (!cancelled) setHomeworldError('Could not reach the planetary registry for this homeworld.');
      })
      .finally(() => {
        if (!cancelled) setHomeworldLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [person.homeworld]);

  const speciesName = speciesNameFor(person, speciesById);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 z-50"
      onClick={onClose}
    >
      <div
        className="bg-panel border border-border-bright rounded-xl max-w-xl w-full max-h-[88vh] overflow-y-auto relative shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-7 pt-6 pb-4 border-b border-border flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl m-0 tracking-wide" id="modal-title">
              {person.name}
            </h2>
            <p className="font-mono text-text-muted text-xs mt-1.5">
              {speciesName} · {person.gender !== 'n/a' ? person.gender : 'unspecified gender'}
            </p>
          </div>
          <button
            type="button"
            className="bg-transparent border border-border text-text-muted rounded-md w-8 h-8 cursor-pointer text-base leading-none flex-shrink-0 hover:border-danger hover:text-danger"
            onClick={onClose}
            ref={closeButtonRef}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-7 pt-5 pb-7">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3.5 mb-6">
            <Stat label="Height" value={heightToMeters(person.height)} />
            <Stat label="Mass" value={formatMassKg(person.mass)} />
            <Stat label="Birth year" value={person.birth_year} />
            <Stat label="Films" value={person.films.length} />
            <Stat label="Archived" value={formatDateDDMMYYYY(person.created)} />
          </div>

          <p className="font-mono text-xs tracking-wide uppercase text-accent m-0 mb-2.5">Homeworld</p>
          <div className="bg-bg-grid border border-border rounded-lg p-4">
            {homeworldLoading && (
              <p className="font-mono text-sm text-text-muted">Fetching planetary data…</p>
            )}
            {homeworldError && <p className="font-mono text-sm text-text-muted">{homeworldError}</p>}
            {homeworld && !homeworldLoading && !homeworldError && (
              <>
                <h3 className="font-display text-base m-0 mb-3">{homeworld.name}</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3.5">
                  <Stat label="Climate" value={homeworld.climate} />
                  <Stat label="Terrain" value={homeworld.terrain} />
                  <Stat label="Residents" value={homeworld.residents.length} />
                  <Stat
                    label="Population"
                    value={homeworld.population === 'unknown' ? 'Unknown' : Number(homeworld.population).toLocaleString('en-US')}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
