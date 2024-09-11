"use client"

// components/RegisterForm.tsx

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  avatar: FileList;
  coverImage: FileList;
}

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    if (data.avatar[0]) formData.append('avatar', data.avatar[0]);
    if (data.coverImage[0]) formData.append('coverImage', data.coverImage[0]);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        // Redirect or reset form here if needed
        setTimeout(() => {
            router.push("/")
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error registering user');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center mt-20 overflow-auto">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-300 mb-2">Full Name</label>
            <input
              id="fullName"
              type="text"
              {...register('fullName', { required: 'Full Name is required' })}
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
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="avatar" className="block text-gray-300 mb-2">Avatar</label>
            <input
              id="avatar"
              type="file"
              {...register('avatar')}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-gray-300 mb-2">Cover Image</label>
            <input
              id="coverImage"
              type="file"
              {...register('coverImage')}
              className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
