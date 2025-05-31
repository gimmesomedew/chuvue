import { LineChart, Line, PieChart, Pie, ResponsiveContainer, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useFinancialData } from '../hooks/useFinancialData';
import StatCard from './ui/StatCard';
import LoadingSpinner from './ui/LoadingSpinner';

const lineChartData = [
  { month: 'Jan', wages: 2100, expenses: 1800 },
  { month: 'Feb', wages: 2300, expenses: 1900 },
  { month: 'Mar', wages: 2500, expenses: 2100 },
  { month: 'Apr', wages: 2800, expenses: 2400 },
];

const pieChartData = [
  { name: 'Salary', value: 1500 },
  { name: 'Freelance', value: 800 },
  { name: 'Side Projects', value: 200 },
];

const COLORS = ['#A689FA', '#33C3F0', '#6366F1'];

export default function Dashboard() {
  const { user } = useAuth();
  const { totalWages, totalExpenses, isLoading: isFinancialLoading } = useFinancialData(user);

  return (
    <div className="p-4 lg:p-8 max-w-screen-2xl mx-auto">
      {/* Header - Hidden on desktop as it's in the sidebar */}
      <div className="flex justify-center items-center mb-6 lg:hidden">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
      </div>

      {/* Welcome Section - Visible only on desktop */}
      <div className="hidden lg:block mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-400">Here's an overview of your finances</p>
      </div>

      {/* Summary Cards */}
      {isFinancialLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <StatCard title="Wages (YTD)" value={totalWages} className="text-primary" />
        <StatCard title="Expenses (YTD)" value={totalExpenses} className="text-secondary" />
        <StatCard title="Net Savings" value={totalWages - totalExpenses} className="text-green-500" />
        <StatCard title="Budget Status" value={85} className="text-yellow-500" />
      </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Wages vs Expenses</h3>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wages" 
                  stroke="#A689FA" 
                  strokeWidth={2}
                  dot={{ fill: '#A689FA' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#33C3F0" 
                  strokeWidth={2}
                  dot={{ fill: '#33C3F0' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Deposits by Category</h3>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {pieChartData.map(({ name }, index) => (
              <div key={name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-400">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
