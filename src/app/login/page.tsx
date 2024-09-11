"use client";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface LoginFormInputs {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('identifier', data.identifier);
      formData.append('password', data.password);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      });
      console.log(response);
      const result = await response.json();
      console.log(result,"RRRRRRRRRR");
      if (response.status === 200) {
        router.push('/dashboard');
      }else{
        
        throw new Error(result.message || 'Login failed');
      }

    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center text-black w-full py-10">
      <div className="w-full border-gray-400 border-2 max-w-md p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Identifier (Email or Username):
            </label>
            <input
              type="text"
              {...register('identifier', { required: 'Identifier is required' })}
              className="w-full px-3 dark:bg-black dark:text-white py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.identifier && <p className="text-red-500 text-xs">{errors.identifier.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Password:
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 dark:bg-black dark:text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
