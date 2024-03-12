import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700">The page you're looking for doesn't exist.</p>
      <Button className="mt-5 bg-cyan-800 text-white" onClick={()=> navigate('/dashboard')}>Go to Dashboard</Button>
    </div>
  );
};

export default NotFoundPage;
