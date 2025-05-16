interface StatCardProps {
  title: string;
  value: number;
  className?: string;
}

export default function StatCard({ title, value, className = 'text-primary' }: StatCardProps) {
  return (
    <div className="card">
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className={`text-2xl lg:text-3xl font-bold ${className}`}>
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}
