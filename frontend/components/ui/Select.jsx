export function Select({ name, value, onChange, options, renderOption }) {
  return (
    <select name={name} value={value} onChange={onChange}>
      {options.map((option) => {
        const label = renderOption ? renderOption(option) : option;
        const key = typeof option === "string" ? option : option.value || option.id;
        const optionValue = typeof option === "string" ? option : option.value || option.id;
        return (
          <option key={key} value={optionValue}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
