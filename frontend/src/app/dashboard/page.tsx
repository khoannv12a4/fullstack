'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardOverview from '@/components/DashboardOverview';
import UsersPage from '@/components/UsersPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('overview');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'users':
        return <UsersPage />;
      case 'overview':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPageContent()}
      </DashboardLayout>
    </ThemeProvider>
  );
}