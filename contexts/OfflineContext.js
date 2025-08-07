// contexts/OfflineContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import offlineService from '../services/OfflineService';

const OfflineContext = createContext();

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error
  const [lastSync, setLastSync] = useState(null);
  const [pendingActions, setPendingActions] = useState(0);
  const [forceOfflineMode, setForceOfflineMode] = useState(false);

  useEffect(() => {
    // Initialize network monitoring
    const checkNetwork = async () => {
      const online = await offlineService.checkNetworkStatus();
      // Only update online status if not in forced offline mode
      if (!forceOfflineMode) {
        setIsOnline(online);
      }
    };

    // Check network status immediately
    checkNetwork();

    // Set up network listener
    const unsubscribe = offlineService.addNetworkListener((online) => {
      // Only update online status if not in forced offline mode
      if (!forceOfflineMode) {
        setIsOnline(online);
        if (online) {
          // Trigger sync when coming back online
          handleSync();
        }
      }
    });

    // Check network status periodically
    const interval = setInterval(checkNetwork, 10000); // Check every 10 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [forceOfflineMode]);

  // Handle data sync
  const handleSync = async () => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    try {
      await offlineService.syncData();
      setSyncStatus('idle');
      setLastSync(new Date());
    } catch (error) {
      console.error('❌ Sync error:', error);
      setSyncStatus('error');
    }
  };

  // Cache events
  const cacheEvents = async (events) => {
    try {
      await offlineService.cacheEvents(events);
      console.log('📱 Events cached for offline use');
    } catch (error) {
      console.error('❌ Error caching events:', error);
    }
  };

  // Get cached events
  const getCachedEvents = async () => {
    try {
      return await offlineService.getCachedEvents();
    } catch (error) {
      console.error('❌ Error getting cached events:', error);
      return [];
    }
  };

  // Cache announcements
  const cacheAnnouncements = async (announcements) => {
    try {
      await offlineService.cacheAnnouncements(announcements);
      console.log('📱 Announcements cached for offline use');
    } catch (error) {
      console.error('❌ Error caching announcements:', error);
    }
  };

  // Get cached announcements
  const getCachedAnnouncements = async () => {
    try {
      return await offlineService.getCachedAnnouncements();
    } catch (error) {
      console.error('❌ Error getting cached announcements:', error);
      return [];
    }
  };

  // Cache chat messages
  const cacheChatMessages = async (messages) => {
    try {
      await offlineService.cacheChatMessages(messages);
      console.log('📱 Chat messages cached for offline use');
    } catch (error) {
      console.error('❌ Error caching chat messages:', error);
    }
  };

  // Get cached chat messages
  const getCachedChatMessages = async () => {
    try {
      return await offlineService.getCachedChatMessages();
    } catch (error) {
      console.error('❌ Error getting cached chat messages:', error);
      return [];
    }
  };

  // Add message to offline queue
  const addMessageToQueue = async (message) => {
    try {
      await offlineService.addMessageToQueue(message);
      setPendingActions(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error adding message to queue:', error);
    }
  };

  // Add event signup to queue
  const addEventSignupToQueue = async (eventId, userData) => {
    try {
      await offlineService.addEventSignupToQueue(eventId, userData);
      setPendingActions(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error adding event signup to queue:', error);
    }
  };

  // Add admin action to queue
  const addAdminActionToQueue = async (action, data) => {
    try {
      await offlineService.addAdminActionToQueue(action, data);
      setPendingActions(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error adding admin action to queue:', error);
    }
  };

  // Clear cache
  const clearCache = async () => {
    try {
      await offlineService.clearCache();
      setPendingActions(0);
      console.log('📱 Cache cleared');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  };

  // Force online mode
  const forceOnlineMode = () => {
    setForceOfflineMode(false);
    console.log('⚙️ Force online mode enabled');
  };

  // Force offline mode
  const forceOfflineModeEnabled = () => {
    setForceOfflineMode(true);
    console.log('⚙️ Force offline mode enabled');
  };

  // Get offline status
  const getOfflineStatus = () => {
    return {
      isOnline,
      syncStatus,
      lastSync,
      pendingActions,
      hasCachedData: true // You can implement logic to check if data exists
    };
  };

  const value = {
    isOnline,
    syncStatus,
    lastSync,
    pendingActions,
    handleSync,
    cacheEvents,
    getCachedEvents,
    cacheAnnouncements,
    getCachedAnnouncements,
    cacheChatMessages,
    getCachedChatMessages,
    addMessageToQueue,
    addEventSignupToQueue,
    addAdminActionToQueue,
    clearCache,
    getOfflineStatus,
    forceOnlineMode,
    forceOfflineModeEnabled
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
} 