/** Controlled text input for live search. The parent owns the value. */
export default function SearchBar({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  return (
    <div className="relative">
      <label className="sr-only" htmlFor="list-search">
        {label}
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        id="list-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
        autoComplete="off"
      />
    </div>
  )
}
