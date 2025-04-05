"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

interface User {
  username: string;
  email: string;
  full_name: string;
  gender: string;
  profile_picture?: string;
}

export default function DashboardPage() {
  const url = process.env.NEXT_PUBLIC_URL;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`${url}/auth/user/`);
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.profile_picture ? (
              <Image
                src={user.profile_picture}
                alt="Profile"
                className="w-full h-full object-cover"
                width={500}
                height={500}
                blurDataURL="data:..."
                placeholder="blur"
              />
            ) : (
              <span className="text-2xl text-gray-600">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.full_name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>Username:</span>
            <span className="font-medium">{user?.username}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>Gender:</span>
            <span className="font-medium">
              {user?.gender || "Not specified"}
            </span>
          </div>
        </div>

        <Link href="/edit-profile">
          <button className="mt-8 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
