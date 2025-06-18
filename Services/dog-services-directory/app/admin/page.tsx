import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg">Welcome to the admin dashboard. Use the side panel to access admin functions.</p>
      </div>
    </AdminLayout>
  );
} 