'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeownerUserPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const userId = unwrappedParams.user;
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    address: '',
    registration_date:''
  });
  const [updateMessage, setUpdateMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!userId) return;
    
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/homeowner_user/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('User not found');
        }
        
        const data = await response.json();
        setUserData(data);
        setFormData({
          client_name: data.client_name,
          email: data.email,
          address: data.address,
          registration_date:data.regis_date,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/homeowner_user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user information');
      }
      
      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setUpdateMessage({ 
        type: 'success', 
        message: 'Profile updated successfully!' 
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateMessage({ type: '', message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating user data:', error);
      setUpdateMessage({ 
        type: 'error', 
        message: 'Failed to update profile. Please try again.' 
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
        registration_date:userData.regis_date
      });
      setUpdateMessage({ type: '', message: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-center p-8 rounded-lg shadow-md">
          <h2 className="text-2xl text-red-600 mb-2">User not found</h2>
          <p className="mb-4">The requested user profile does not exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Site Information</h1>
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded transition ${
                isEditing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit information'}
            </button>
          </div>
        </div>

        {updateMessage.message && (
          <div className={`p-4 ${
            updateMessage.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {updateMessage.message}
          </div>
        )}

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                  <input
                    type="date"
                    name="registration_date"
                    value={formData.registration_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  <p className="mt-1 text-lg">{userData.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-lg">{userData.client_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg">{userData.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-lg">{userData.address}</p>
                </div>


                <div>
                  <h3 className="text-sm font-medium text-gray-500">Registaration Date</h3>
                  <p className="mt-1 text-lg">{userData.regis_date}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}