interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export default function Card({ title, value, subtitle, className = '' }: CardProps) {
  return (
    <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-white">
        {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
