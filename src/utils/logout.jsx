import { toast } from 'react-toastify';
import { deleteFCMToken } from '../utils/fcmService'; // Adjust import path as needed

export const logout = async (navigate) => {
  try {
    // First attempt to delete the FCM token
    await deleteFCMToken();
    
    // Remove auth token and user details from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
    
    // Show success toast notification
    toast.success('You have been successfully logged out');
    
    // Navigate to the login page
    navigate('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    
    // Even if FCM token deletion fails, continue with logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
    
    toast.success('You have been logged out');
    navigate('/login');
  }
};