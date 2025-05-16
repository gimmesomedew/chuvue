import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import * as Portal from '@radix-ui/react-portal';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Wages from './pages/Wages';
import NewDeposit from './pages/NewDeposit';
import DepositTypes from './pages/DepositTypes';
import Expenses from './pages/Expenses';
import NewExpense from './pages/NewExpense';
import ExpenseCategories from './pages/ExpenseCategories';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Portal.Root />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '0.5rem',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="wages" element={<Wages />} />
            <Route path="wages/new" element={<NewDeposit />} />
          <Route path="wages/edit-deposit/:id" element={<NewDeposit />} />
          <Route path="deposit-types" element={<DepositTypes />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/new" element={<NewExpense />} />
          <Route path="/expenses/edit/:id" element={<NewExpense />} />
          <Route path="/expense-categories" element={<ExpenseCategories />} />
            <Route path="expenses" element={<div className="p-4">Expenses Page (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
