/**
 * Labelled <select> used for filters and sorting.
 * options: [{ value, label }]. An empty value means "all".
 */
export default function FilterSelect({ id, label, value, onChange, options, allLabel }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="input pr-8">
        {allLabel && <option value="">{allLabel}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
