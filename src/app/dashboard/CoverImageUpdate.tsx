"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormValues {
  coverImage: FileList;
}

const CoverImageUpdateForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const file = data.coverImage[0];
    if (!file) {
      toast.error('Please select a file.');
      return;
    }

    // Check if the file is an image (JPEG, PNG, GIF)
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF).');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('coverImage', file);

    try {
      const response = await fetch('/api/auth/update-cover-image', {
        method: 'PATCH',
        body: formData,
        credentials: 'include', // Include cookies with the request
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Cover image updated successfully');
      } else {
        toast.error(result.message || 'Failed to update cover image');
      }
    } catch (error) {
      toast.error('An error occurred while updating the cover image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Cover Image</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="coverImage">
            Choose new cover image
          </label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            {...register('coverImage', { required: 'Cover image is required' })}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
          />
          {errors.coverImage && (
            <p className="text-red-500 text-sm mt-2">{errors.coverImage.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {uploading ? 'Uploading...' : 'Update Cover Image'}
        </button>
      </form>
    </div>
  );
};

export default CoverImageUpdateForm;
