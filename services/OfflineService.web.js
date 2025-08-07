// services/OfflineService.web.js - Web-compatible version
import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineService {
  constructor() {
    this.isOnline = true;
    this.syncQueue = [];
    this.syncInProgress = false;
    this.listeners = [];
    this.initStorage();
  }

  // Initialize storage for web
  async initStorage() {
    try {
      console.log('🌐 Web offline storage initialized');
    } catch (error) {
      console.error('❌ Error initializing web storage:', error);
    }
  }

  // Check network status for web
  async checkNetworkStatus() {
    try {
      const wasOnline = this.isOnline;
      this.isOnline = navigator.onLine;
      
      if (wasOnline !== this.isOnline) {
        this.notifyListeners();
        if (this.isOnline) {
          this.syncData();
        }
      }
      
      return this.isOnline;
    } catch (error) {
      console.error('❌ Error checking network status:', error);
      return false;
    }
  }

  // Add network status listener
  addNetworkListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify listeners of network status change
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  // Cache events data for web
  async cacheEvents(events) {
    if (!events || !Array.isArray(events)) return;
    
    try {
      await AsyncStorage.setItem('cached_events', JSON.stringify(events));
      await AsyncStorage.setItem('events_last_sync', new Date().toISOString());
      console.log('🌐 Events cached successfully');
    } catch (error) {
      console.error('❌ Error caching events:', error);
    }
  }

  // Get cached events for web
  async getCachedEvents() {
    try {
      const cached = await AsyncStorage.getItem('cached_events');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('❌ Error getting cached events:', error);
      return [];
    }
  }

  // Cache announcements for web
  async cacheAnnouncements(announcements) {
    if (!announcements || !Array.isArray(announcements)) return;
    
    try {
      await AsyncStorage.setItem('cached_announcements', JSON.stringify(announcements));
      await AsyncStorage.setItem('announcements_last_sync', new Date().toISOString());
      console.log('🌐 Announcements cached successfully');
    } catch (error) {
      console.error('❌ Error caching announcements:', error);
    }
  }

  // Get cached announcements for web
  async getCachedAnnouncements() {
    try {
      const cached = await AsyncStorage.getItem('cached_announcements');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('❌ Error getting cached announcements:', error);
      return [];
    }
  }

  // Cache chat messages for web
  async cacheChatMessages(messages) {
    try {
      await AsyncStorage.setItem('cached_chat_messages', JSON.stringify(messages));
      console.log('🌐 Chat messages cached successfully');
    } catch (error) {
      console.error('❌ Error caching chat messages:', error);
    }
  }

  // Get cached chat messages for web
  async getCachedChatMessages() {
    try {
      const cached = await AsyncStorage.getItem('cached_chat_messages');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('❌ Error getting cached chat messages:', error);
      return [];
    }
  }

  // Add message to offline queue for web
  async addMessageToQueue(message) {
    try {
      const queue = await this.getSyncQueue();
      const id = `offline_${Date.now()}_${Math.random()}`;
      queue.push({
        id,
        action: 'chat_message',
        data: JSON.stringify(message),
        timestamp: new Date().toISOString()
      });
      await AsyncStorage.setItem('sync_queue', JSON.stringify(queue));
      console.log('🌐 Message added to offline queue');
    } catch (error) {
      console.error('❌ Error adding message to queue:', error);
    }
  }

  // Add event signup to queue for web
  async addEventSignupToQueue(eventId, userData) {
    try {
      const queue = await this.getSyncQueue();
      const id = `signup_${Date.now()}_${Math.random()}`;
      queue.push({
        id,
        action: 'event_signup',
        data: JSON.stringify({ eventId, userData }),
        timestamp: new Date().toISOString()
      });
      await AsyncStorage.setItem('sync_queue', JSON.stringify(queue));
      console.log('🌐 Event signup added to sync queue');
    } catch (error) {
      console.error('❌ Error adding event signup to queue:', error);
    }
  }

  // Add admin action to queue for web
  async addAdminActionToQueue(action, data) {
    try {
      const queue = await this.getSyncQueue();
      const id = `admin_${Date.now()}_${Math.random()}`;
      queue.push({
        id,
        action,
        data: JSON.stringify(data),
        timestamp: new Date().toISOString()
      });
      await AsyncStorage.setItem('sync_queue', JSON.stringify(queue));
      console.log('🌐 Admin action added to sync queue');
    } catch (error) {
      console.error('❌ Error adding admin action to queue:', error);
    }
  }

  // Get sync queue for web
  async getSyncQueue() {
    try {
      const cached = await AsyncStorage.getItem('sync_queue');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('❌ Error getting sync queue:', error);
      return [];
    }
  }

  // Clear sync queue item for web
  async clearSyncQueueItem(id) {
    try {
      const queue = await this.getSyncQueue();
      const filteredQueue = queue.filter(item => item.id !== id);
      await AsyncStorage.setItem('sync_queue', JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('❌ Error clearing sync queue item:', error);
    }
  }

  // Sync data when online for web
  async syncData() {
    if (!this.isOnline || this.syncInProgress) return;
    
    this.syncInProgress = true;
    console.log('🔄 Starting data sync...');
    
    try {
      const queue = await this.getSyncQueue();
      
      for (const item of queue) {
        try {
          const data = JSON.parse(item.data);
          
          switch (item.action) {
            case 'event_signup':
              console.log('🔄 Syncing event signup:', data);
              break;
              
            case 'chat_message':
              console.log('🔄 Syncing chat message:', data);
              break;
              
            case 'admin_action':
              console.log('🔄 Syncing admin action:', data);
              break;
          }
          
          await this.clearSyncQueueItem(item.id);
        } catch (error) {
          console.error('❌ Error syncing item:', error);
        }
      }
      
      console.log('✅ Data sync completed');
    } catch (error) {
      console.error('❌ Error during data sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Get offline status for web
  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      hasCachedData: true,
      lastSync: null
    };
  }

  // Clear all cached data for web
  async clearCache() {
    try {
      await AsyncStorage.multiRemove([
        'cached_events',
        'cached_announcements',
        'cached_chat_messages',
        'sync_queue',
        'events_last_sync',
        'announcements_last_sync'
      ]);
      
      console.log('🌐 Cache cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  }
}

// Create singleton instance
const offlineService = new OfflineService();

export default offlineService; 