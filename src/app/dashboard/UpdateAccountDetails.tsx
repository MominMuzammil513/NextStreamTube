"use client"
// components/UpdateAccountDetails.tsx

import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface FormData {
  email: string;
  username: string;
  fullName: string;
}

const UpdateAccountDetails = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/update-account-details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error updating account details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Update Account Details</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-300 mb-2">Full Name</label>
            <input
              id="fullName"
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
            <input
              id="username"
              {...register('username', { required: 'Username is required' })}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Updating...' : 'Update Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccountDetails;
