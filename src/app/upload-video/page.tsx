"use client"
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';

type FormData = {
  videoFile: FileList;
  thumbnail: FileList;
  title: string;
  description: string;
  // duration: number;
  // views: number;
  isPublished: boolean;
  isFeatured: boolean;
  category: string;
  tags: string;
  // ownerId: string;
};

const VideoUploadForm = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFileType = (file: File | null, type: string) => {
    if (!file) return true;
    const fileTypes = type === 'video' ? ['video/mp4', 'video/webm', 'video/ogg'] : ['image/jpeg', 'image/png', 'image/gif'];
    return fileTypes.includes(file.type);
  };

  const onSubmit = async (data: FormData) => {
    if (!validateFileType(data.videoFile[0], 'video')) {
      setError('videoFile', { type: 'manual', message: 'Invalid video file type' });
      return;
    }
    if (!validateFileType(data.thumbnail[0], 'image')) {
      setError('thumbnail', { type: 'manual', message: 'Invalid image file type' });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('videoFile', data.videoFile[0]);
    formData.append('thumbnail', data.thumbnail[0]);
    formData.append('title', data.title);
    formData.append('description', data.description);
    // formData.append('duration', data.duration.toString());
    // formData.append('views', data.views.toString());
    formData.append('isPublished', data.isPublished.toString());
    formData.append('isFeatured', data.isFeatured.toString());
    formData.append('category', data.category);
    formData.append('tags', data.tags);
    // formData.append('ownerId', data.ownerId);

    try {
      const response = await fetch('/api/auth/video/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 201) {
        toast.success('Video uploaded successfully');
      } else {
        toast.error('Error uploading video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="max-w-2xl mx-auto p-8 bg-gray-900 text-white shadow-lg rounded-lg">
      <div className="mb-6">
        <label htmlFor="videoFile" className="block text-sm font-medium">Video File:</label>
        <input
          id="videoFile"
          type="file"
          {...register('videoFile', { required: true })}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
        {errors.videoFile && <span className="text-red-400 text-sm">{errors.videoFile.message || 'This field is required'}</span>}
      </div>

      <div className="mb-6">
        <label htmlFor="thumbnail" className="block text-sm font-medium">Thumbnail:</label>
        <input
          id="thumbnail"
          type="file"
          {...register('thumbnail', { required: true })}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
        {errors.thumbnail && <span className="text-red-400 text-sm">{errors.thumbnail.message || 'This field is required'}</span>}
      </div>

      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium">Title:</label>
        <input
          id="title"
          type="text"
          {...register('title', { required: true })}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
        {errors.title && <span className="text-red-400 text-sm">{errors.title.message || 'This field is required'}</span>}
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium">Description:</label>
        <textarea
          id="description"
          {...register('description', { required: true })}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
        {errors.description && <span className="text-red-400 text-sm">{errors.description.message || 'This field is required'}</span>}
      </div>

      {/* <div className="mb-6">
        <label htmlFor="duration" className="block text-sm font-medium">Duration (seconds):</label>
        <input
          id="duration"
          type="number"
          {...register('duration', { required: true, valueAsNumber: true })}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
        {errors.duration && <span className="text-red-400 text-sm">{errors.duration.message || 'This field is required'}</span>}
      </div> */}

      {/* <div className="mb-6">
        <label htmlFor="views" className="block text-sm font-medium">Views:</label>
        <input
          id="views"
          type="number"
          {...register('views', { valueAsNumber: true })}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
      </div> */}

      <div className="mb-6 flex items-center">
        <input
          id="isPublished"
          type="checkbox"
          {...register('isPublished')}
          className="h-5 w-5 text-indigo-600 border-gray-700 rounded"
        />
        <label htmlFor="isPublished" className="ml-2 text-sm">Published</label>
      </div>

      <div className="mb-6 flex items-center">
        <input
          id="isFeatured"
          type="checkbox"
          {...register('isFeatured')}
          className="h-5 w-5 text-indigo-600 border-gray-700 rounded"
        />
        <label htmlFor="isFeatured" className="ml-2 text-sm">Featured</label>
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium">Category:</label>
        <input
          id="category"
          type="text"
          {...register('category')}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="tags" className="block text-sm font-medium">Tags (comma-separated):</label>
        <input
          id="tags"
          type="text"
          {...register('tags')}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
      </div>

      {/* <div className="mb-6">
        <label htmlFor="ownerId" className="block text-sm font-medium">Owner ID:</label>
        <input
          id="ownerId"
          type="text"
          {...register('ownerId', { required: true })}
          className="mt-1 block w-full border-gray-700 bg-gray-800 rounded-md shadow-sm text-white placeholder-gray-500"
        />
        {errors.ownerId && <span className="text-red-400 text-sm">{errors.ownerId.message || 'This field is required'}</span>}
      </div> */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {isSubmitting ? 'Uploading...' : 'Upload Video'}
      </button>
    </form>
  );
};

export default VideoUploadForm;
