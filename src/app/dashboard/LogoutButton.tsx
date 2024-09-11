"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

const LogoutButton = () => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.status === 200) {
                // Handle successful logout (e.g., redirect to login page)
                router.push("/login")
            } else {
                // Handle error
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    return (
        <div className="mt-6">
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
                Logout
            </button>
        </div>
    )
}
export default LogoutButton
