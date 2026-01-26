interface StatsCardProps {
  label: string;
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  gray: 'bg-gray-50 text-gray-700 border-gray-200',
};

export function StatsCard({ label, value, color = 'gray' }: StatsCardProps) {
  return (
    <div className={`rounded-xl border-2 p-6 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
