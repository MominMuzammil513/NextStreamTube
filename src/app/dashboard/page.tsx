import { GetServerSideProps } from 'next';
import { NextRequest } from 'next/server';
import { getCurrentUser, verifyAccessToken } from '@/lib/session'; // Adjust import path as needed
import { cookies } from 'next/headers';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateAccountDetails from './UpdateAccountDetails';
import AvatarUpdateForm from './AvatarUpdate';
import CoverImageUpdateForm from './CoverImageUpdate';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardPageProps {
  user: User | null;
}

const DashboardPage = async () => {
  const accessToken = cookies().get('accessToken');
  if (!accessToken) {
    return <div>No user accessToken available</div>;
  }
  const user = await getCurrentUser(accessToken.value)
  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="bg-black text-white border-2 rounded-xl">
      <div className="rounded-lg shadow-lg relative">
        <div className="p-6">
          <div className="flex items-center">
            {user.avatar ? (
              <Image
                height={1000}
                width={1000}
                src={user.avatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-2 border-gray-600"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-600 rounded-full"></div>
            )}
            <div className="ml-6">
              <h1 className="text-4xl font-bold text-gray-100">{user.fullName}</h1>
              <p className="text-xl text-gray-300">{user.username}</p>
              <p className="text-md text-gray-500">{user.email}</p>
            </div>
          </div>
          {user.coverImage && (
            <div className="mt-4">
              <Image
                height={1000}
                width={1000}
                src={user.coverImage}
                alt="Cover"
                className=" inset-0 object-cover rounded-md border-2 border-gray-600"
              />
            </div>
          )}
          <LogoutButton/>
        </div>
        <ChangePasswordForm/>
        <UpdateAccountDetails/>
        <AvatarUpdateForm/>
        <CoverImageUpdateForm/>
      </div>
    </div>
  );
};

export default DashboardPage;
