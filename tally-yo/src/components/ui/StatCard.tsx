interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  className?: string;
}

export default function StatCard({ title, value, subtitle, className = 'text-primary' }: StatCardProps) {
  return (
    <div className="card p-2 sm:p-4 min-w-[200px] w-[200px] sm:w-[300px] flex-shrink-0">
      <h3 className="text-xs sm:text-sm text-gray-400 mb-1">{title}</h3>
      <p className={`text-lg sm:text-2xl lg:text-3xl font-bold ${className}`}>
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
