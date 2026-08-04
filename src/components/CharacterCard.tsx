import type { SwPerson, SwSpecies } from '../types';
import { idFromUrl } from '../types';
import { colorForSpecies, portraitUrlForId } from '../utils/format';

interface Props {
  person: SwPerson;
  speciesById: Map<string, SwSpecies>;
  onSelect: (person: SwPerson) => void;
}

export function speciesNameFor(person: SwPerson, speciesById: Map<string, SwSpecies>): string {
  if (person.species.length === 0) return 'Human';
  const first = speciesById.get(idFromUrl(person.species[0]));
  return first?.name ?? 'Unknown';
}

const cornerBase = 'absolute w-4 h-4 border-2 opacity-85 transition-all duration-200 group-hover:w-5.5 group-hover:h-5.5';

export function CharacterCard({ person, speciesById, onSelect }: Props) {
  const id = idFromUrl(person.url);
  const speciesName = speciesNameFor(person, speciesById);
  const color = colorForSpecies(speciesName);

  return (
    <button
      type="button"
      className="group relative text-left rounded-xl overflow-hidden border border-border bg-panel cursor-pointer transition-all duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 hover:shadow-[0_14px_28px_-14px_rgba(0,0,0,0.6),0_0_0_1px_var(--species-color)] focus-visible:shadow-[0_14px_28px_-14px_rgba(0,0,0,0.6),0_0_0_1px_var(--species-color)]"
      style={{ ['--species-color' as string]: color }}
      onClick={() => onSelect(person)}
      aria-label={`View details for ${person.name}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-grid">
        <img
          src={portraitUrlForId(id)}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-400 saturate-[0.85] group-hover:scale-108 group-hover:saturate-105"
        />
        <span
          className={`${cornerBase} top-2 left-2 border-r-0 border-b-0`}
          style={{ borderColor: 'var(--species-color)' }}
          aria-hidden="true"
        />
        <span
          className={`${cornerBase} top-2 right-2 border-l-0 border-b-0`}
          style={{ borderColor: 'var(--species-color)' }}
          aria-hidden="true"
        />
        <span
          className={`${cornerBase} bottom-2 left-2 border-r-0 border-t-0`}
          style={{ borderColor: 'var(--species-color)' }}
          aria-hidden="true"
        />
        <span
          className={`${cornerBase} bottom-2 right-2 border-l-0 border-t-0`}
          style={{ borderColor: 'var(--species-color)' }}
          aria-hidden="true"
        />
        <span
          className="absolute left-0 right-0 h-0.5 -top-[10%] opacity-0 group-hover:opacity-90 group-hover:animate-scan"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          aria-hidden="true"
        />
      </div>
      <div className="px-4 pt-3.5 pb-4">
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] tracking-wide uppercase mb-1.5"
          style={{ color }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            aria-hidden="true"
          />
          {speciesName}
        </span>
        <h3 className="font-display text-sm tracking-wide m-0 leading-snug">{person.name}</h3>
      </div>
    </button>
  );
}
