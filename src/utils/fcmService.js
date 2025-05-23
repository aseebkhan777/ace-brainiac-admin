// src/utils/fcmService.js
import { getToken, deleteToken, getMessaging } from "firebase/messaging";
import { app } from "../firebase/firebase";
import { apiWithAuth } from "../axios/Instance";


const VAPID_KEY = "BJHMOoXPkWSzJCYBLaiKV0T_2jk_TyzvxqHssYHKGD0qHqvXnUBzJ6jV0wlqBd_i870rpuWA2vWKy054U7E82Jo";

// Get messaging instance (only in browser)
const getMessagingInstance = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return null;
  }
  
  try {
    return getMessaging(app);
  } catch (error) {
    console.error("Error getting messaging instance:", error);
    return null;
  }
};

// Request notification permissions
export const requestNotificationPermission = async () => {
  try {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return null;
    }
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied by user');
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

// Register and activate service worker for FCM
export const registerServiceWorker = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported in this browser');
      return null;
    }
    
    // Register the service worker with root scope
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    // Wait for the service worker to be ready and active
    if (!registration.active || registration.installing || registration.waiting) {
      await new Promise(resolve => {
        if (registration.active) {
          // If already active, resolve immediately
          resolve();
          return;
        }
        
        const worker = registration.installing || registration.waiting;
        
        if (worker) {
          worker.addEventListener('statechange', () => {
            if (worker.state === 'activated') {
              resolve();
            }
          });
          
          // If it's already activated by the time we add the listener
          if (worker.state === 'activated') {
            resolve();
          }
        }
      });
    }
    
    console.log('Service worker registered and activated:', registration);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

// Generate FCM token
export const generateFCMToken = async () => {
  try {
    const messaging = getMessagingInstance();
    
    if (!messaging) {
      console.error("Firebase messaging is not initialized");
      return null;
    }
    
    // Ensure service worker is registered and activated
    const swRegistration = await registerServiceWorker();
    if (!swRegistration) {
      throw new Error("Service worker registration failed");
    }
    
    // Make sure we have an active service worker before continuing
    if (!swRegistration.active) {
      throw new Error("Service worker not active yet");
    }
    
    // Get token with service worker registration
    const tokenOptions = {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration
    };
    
    // Add a small delay to ensure the service worker is fully ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentToken = await getToken(messaging, tokenOptions);
    
    if (currentToken) {
      // Store token in localStorage
      localStorage.setItem("fcmToken", currentToken);
      return currentToken;
    } else {
      console.log('No FCM token available. Permission may be denied.');
      return null;
    }
  } catch (error) {
    console.error("Error generating FCM token:", error);
    return null;
  }
};

// Register FCM token with backend
export const registerFCMTokenWithBackend = async (token) => {
  try {
    const api = apiWithAuth();
    await api.post("/persona/fcm", { fcmToken: token });
    console.log("FCM token sent to server successfully");
    return true;
  } catch (error) {
    console.error("Error registering FCM token with backend:", error);
    return false;
  }
};

// Delete FCM token from Firebase and backend
export const deleteFCMToken = async () => {
  try {
    const fcmToken = localStorage.getItem('fcmToken');
    if (!fcmToken) return true;
    
    // Delete token from backend
    const api = apiWithAuth();
    await api.delete("/persona/fcm", { 
      data: { fcmToken } 
    });
    
    const messaging = getMessagingInstance();
    
    if (messaging) {
      // Delete token from Firebase
      await deleteToken(messaging);
    }
    
    // Remove from localStorage
    localStorage.removeItem('fcmToken');
    
    console.log("FCM token deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting FCM token:", error);
    return false;
  }
};

// Complete FCM registration process
export const setupFCM = async () => {
  try {
    if (!("Notification" in window) || !('serviceWorker' in navigator)) {
      console.log("This browser doesn't support notifications or service workers");
      return null;
    }
    
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) return null;
    
    const token = await generateFCMToken();
    if (!token) return null;
    
    await registerFCMTokenWithBackend(token);
    return token;
  } catch (error) {
    console.error("Error setting up FCM:", error);
    return null;
  }
}; 