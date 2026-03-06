import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function TopNav() {
  return (
    <div className="sticky top-0 z-40 flex justify-end h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
  <div className="flex items-center gap-x-4 p-1.5 cursor-pointer">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
      <span className="text-sm font-medium leading-none text-primary-700">AD</span>
    </span>
    <span className="hidden lg:flex lg:items-center">
      <span className="text-sm font-semibold leading-6 text-gray-900">
        Admin User
      </span>
    </span>
  </div>
</div>
  );
}
