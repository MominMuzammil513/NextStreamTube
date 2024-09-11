"use client"
// components/ChangePasswordForm.tsx

import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface FormData {
  currentPassword: string;
  newPassword: string;
}

const ChangePasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        // Optionally, redirect or reset form here
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error changing password');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-300 mb-2">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              {...register('currentPassword', { required: 'Current password is required' })}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-300 mb-2">New Password</label>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword', { required: 'New password is required' })}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
