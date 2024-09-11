"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormValues {
  avatar: FileList;
}

const AvatarUpdateForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const file = data.avatar[0];
    if (!file) {
      toast.error('Please select a file.');
      return;
    }

    // Check if the file is an image
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF).');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/auth/update-avatar', {
        method: 'PATCH',
        body: formData,
        credentials: 'include', // Include cookies with request
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Avatar updated successfully');
      } else {
        toast.error(result.message || 'Failed to update avatar');
      }
    } catch (error) {
      toast.error('An error occurred while updating the avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Avatar</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="avatar">
            Choose new avatar
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            {...register('avatar', { required: 'Avatar image is required' })}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
          />
          {errors.avatar && <p className="text-red-500 text-sm mt-2">{errors.avatar.message}</p>}
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {uploading ? 'Uploading...' : 'Update Avatar'}
        </button>
      </form>
    </div>
  );
};

export default AvatarUpdateForm;
