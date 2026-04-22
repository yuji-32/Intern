import Field from "./Field";

export default function RatingSelect({ label, value, onChange }) {
  return (
    <Field label={label}>
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </Field>
  );
}