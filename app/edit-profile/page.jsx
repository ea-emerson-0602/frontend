"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    gender: "",
    profile_picture: null,
  });
  const [,] = useState({
    new_password: "",
    confirm_password: "",
    otp: "",
  });
  const [,] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load initial user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`${url}/auth/user/`);
        setUserData(response.data);
        setFormData({
          username: response.data.username,
          full_name: response.data.full_name,
          gender: response.data.gender,
          profile_picture: null,
        });
      } catch (error) {
        setError("Failed to load user data");
      }
    };
    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      if (formData.username !== userData?.username)
        form.append("username", formData.username);
      if (formData.full_name !== userData?.full_name)
        form.append("full_name", formData.full_name);
      if (formData.gender !== userData?.gender)
        form.append("gender", formData.gender);
      if (formData.profile_picture) {
        form.append("profile_picture", formData.profile_picture);
      }

      const response = await api.patch(`${url}/auth/user/`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);

      setSuccess("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({
                      ...formData,
                      profile_picture: e.target.files[0],
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>

        <button
          onClick={() => {
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("refreshToken");
            router.push("/reset-password");
          }}
          className="text-blue-600 hover:text-blue-500"
        >
          Change Password
        </button>

        {error && (
          <div className="mt-4 p-3 text-red-500 bg-red-50 rounded">{error}</div>
        )}
        {success && (
          <div className="mt-4 p-3 text-green-500 bg-green-50 rounded">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}
