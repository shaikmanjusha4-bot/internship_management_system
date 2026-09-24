import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-600 font-medium text-sm animate-pulse">{message}</p>
    </div>
  );
};

export default Loading;
