export interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  species: string;
  onSpeciesChange: (value: string) => void;
  speciesOptions: FilterOption[];
  homeworld: string;
  onHomeworldChange: (value: string) => void;
  homeworldOptions: FilterOption[];
  film: string;
  onFilmChange: (value: string) => void;
  filmOptions: FilterOption[];
  resultCount: number;
}

const fieldClass =
  'bg-panel border border-border text-text px-3.5 py-2.5 rounded-md text-[0.88rem] focus:border-accent focus:outline-none';

const selectClass = `${fieldClass} flex-none basis-42 w-full appearance-none pr-9 cursor-pointer`;

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  allLabel,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  allLabel: string;
  options: FilterOption[];
}) {
  return (
    <div className="relative flex-none basis-42">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className={selectClass}>
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronIcon />
    </div>
  );
}

export function SearchFilterBar({
  query,
  onQueryChange,
  species,
  onSpeciesChange,
  speciesOptions,
  homeworld,
  onHomeworldChange,
  homeworldOptions,
  film,
  onFilmChange,
  filmOptions,
  resultCount,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center">
      <input
        type="search"
        placeholder="Search characters by name…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search characters by name"
        className={`${fieldClass} flex-1 basis-56 min-w-45 font-body`}
      />
      <FilterSelect
        value={species}
        onChange={onSpeciesChange}
        label="Filter by species"
        allLabel="All species"
        options={speciesOptions}
      />
      <FilterSelect
        value={homeworld}
        onChange={onHomeworldChange}
        label="Filter by homeworld"
        allLabel="All homeworlds"
        options={homeworldOptions}
      />
      <FilterSelect value={film} onChange={onFilmChange} label="Filter by film" allLabel="All films" options={filmOptions} />
      <span className="font-mono text-md text-text-muted whitespace-nowrap">{resultCount} found</span>
    </div>
  );
}