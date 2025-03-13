"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import Framer Motion

export default function HomeownerUserPage({ params }) {
  const router = useRouter();
  const userId = params.user;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    address: "",
    registration_date: "",
  });
  const [updateMessage, setUpdateMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/homeowner_user/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("User not found");
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          client_name: data.client_name,
          email: data.email,
          address: data.address,
          registration_date: data.regis_date,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/homeowner_user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setUpdateMessage({
        type: "success",
        message: "Profile updated successfully!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateMessage({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating user data:", error);
      setUpdateMessage({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);

    // Reset form data when canceling edit
    if (isEditing) {
      setFormData({
        client_name: userData.client_name,
        email: userData.email,
        address: userData.address,
        registration_date: userData.regis_date,
      });
      setUpdateMessage({ type: "", message: "" });
    }
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </motion.div>
    );
  }

  if (!userData) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-red-50 text-center p-8 rounded-lg shadow-md">
          <h2 className="text-2xl text-red-600 mb-2">User not found</h2>
          <p className="mb-4">The requested user profile does not exist.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Site Information</h1>
            <motion.button
              onClick={toggleEditMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded transition ${
                isEditing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-white text-blue-600 hover:bg-gray-100"
              }`}
            >
              {isEditing ? "Cancel" : "Edit information"}
            </motion.button>
          </div>
        </div>

        {updateMessage.message && (
          <motion.div
            className={`p-4 ${
              updateMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {updateMessage.message}
          </motion.div>
        )}

        <div className="p-6">
          {isEditing ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                {["client_name", "email", "address", "registration_date"].map((field, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.02 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.replace("_", " ").toUpperCase()}
                    </label>
                    <input
                      type={field === "email" ? "email" : field === "registration_date" ? "date" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </motion.div>
                ))}
                <div className="flex justify-end mt-6">
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p><strong>Name:</strong> {userData.client_name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Address:</strong> {userData.address}</p>
              <p><strong>Registration Date:</strong> {userData.regis_date}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
