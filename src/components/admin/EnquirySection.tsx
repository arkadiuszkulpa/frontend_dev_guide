type FieldValue = string | (string | null)[] | boolean | null | undefined;

interface FieldProps {
  label: string;
  value: FieldValue;
}

function Field({ label, value }: FieldProps) {
  const displayValue = () => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Not provided</span>;
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      const filteredValue = value.filter((item): item is string => item !== null);
      if (filteredValue.length === 0) {
        return <span className="text-gray-400 italic">None</span>;
      }
      return (
        <ul className="list-disc list-inside space-y-1">
          {filteredValue.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    // Check if it's a URL
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 underline"
        >
          {value}
        </a>
      );
    }
    return value;
  };

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-gray-900">{displayValue()}</dd>
    </div>
  );
}

interface EnquirySectionProps {
  title: string;
  fields: Array<{ label: string; value: FieldValue }>;
}

export function EnquirySection({ title, fields }: EnquirySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <dl className="space-y-4">
        {fields.map((field, index) => (
          <Field key={index} label={field.label} value={field.value} />
        ))}
      </dl>
    </div>
  );
}
