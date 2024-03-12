import React from 'react';

const Loader = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
