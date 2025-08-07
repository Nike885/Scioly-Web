// services/OfflineService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';

class OfflineService {
  constructor() {
    this.db = null;
    this.isOnline = true;
    this.syncQueue = [];
    this.syncInProgress = false;
    this.listeners = [];
    this.initDatabase();
  }

  // Initialize SQLite database
  async initDatabase() {
    try {
      this.db = await SQLite.openDatabaseAsync('scioly_offline.db');
      await this.createTables();
      console.log('📱 Offline database initialized');
    } catch (error) {
      console.error('❌ Error initializing offline database:', error);
      // Set db to null to prevent further errors
      this.db = null;
    }
  }

  // Create necessary tables
  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        date TEXT,
        location TEXT,
        capacity INTEGER,
        attendees TEXT,
        created_at TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS announcements (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        date TEXT,
        author TEXT,
        created_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        message TEXT,
        sender_name TEXT,
        sender_id TEXT,
        timestamp TEXT,
        synced INTEGER DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        action TEXT,
        table_name TEXT,
        data TEXT,
        timestamp TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS user_data (
        key TEXT PRIMARY KEY,
        value TEXT
      )`
    ];

    for (const table of tables) {
      await this.db.execAsync(table);
    }
  }

  // Check network status
  async checkNetworkStatus() {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const wasOnline = this.isOnline;
      this.isOnline = networkState.isConnected && networkState.isInternetReachable;
      
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

  // Cache events data
  async cacheEvents(events) {
    if (!this.db || !events || !Array.isArray(events)) return;
    
    try {
      await this.db.runAsync('DELETE FROM events');
      
      for (const event of events) {
        await this.db.runAsync(
          'INSERT INTO events (id, title, description, date, location, capacity, attendees, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            event.id,
            event.title,
            event.description,
            event.date,
            event.location,
            event.capacity || 50,
            JSON.stringify(event.attendees || []),
            event.created_at,
            event.updated_at
          ]
        );
      }
      
      await AsyncStorage.setItem('events_last_sync', new Date().toISOString());
      console.log('📱 Events cached successfully');
    } catch (error) {
      console.error('❌ Error caching events:', error);
    }
  }

  // Get cached events
  async getCachedEvents() {
    if (!this.db) return [];
    
    try {
      const result = await this.db.getAllAsync('SELECT * FROM events ORDER BY date ASC');
      return result.map(row => ({
        ...row,
        attendees: JSON.parse(row.attendees || '[]')
      }));
    } catch (error) {
      console.error('❌ Error getting cached events:', error);
      return [];
    }
  }

  // Cache announcements
  async cacheAnnouncements(announcements) {
    if (!this.db || !announcements || !Array.isArray(announcements)) return;
    
    try {
      await this.db.runAsync('DELETE FROM announcements');
      
      for (const announcement of announcements) {
        await this.db.runAsync(
          'INSERT INTO announcements (id, title, content, date, author, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [
            announcement.id,
            announcement.title,
            announcement.content,
            announcement.date,
            announcement.author,
            announcement.created_at
          ]
        );
      }
      
      await AsyncStorage.setItem('announcements_last_sync', new Date().toISOString());
      console.log('📱 Announcements cached successfully');
    } catch (error) {
      console.error('❌ Error caching announcements:', error);
    }
  }

  // Get cached announcements
  async getCachedAnnouncements() {
    if (!this.db) return [];
    
    try {
      return await this.db.getAllAsync('SELECT * FROM announcements ORDER BY created_at DESC');
    } catch (error) {
      console.error('❌ Error getting cached announcements:', error);
      return [];
    }
  }

  // Cache chat messages
  async cacheChatMessages(messages) {
    if (!this.db) return;
    
    try {
      await this.db.runAsync('DELETE FROM chat_messages');
      
      for (const message of messages) {
        await this.db.runAsync(
          'INSERT INTO chat_messages (id, message, sender_name, sender_id, timestamp, synced) VALUES (?, ?, ?, ?, ?, ?)',
          [
            message.id,
            message.message,
            message.sender_name,
            message.sender_id,
            message.timestamp,
            1 // Already synced
          ]
        );
      }
      
      console.log('📱 Chat messages cached successfully');
    } catch (error) {
      console.error('❌ Error caching chat messages:', error);
    }
  }

  // Get cached chat messages
  async getCachedChatMessages() {
    if (!this.db) return [];
    
    try {
      return await this.db.getAllAsync('SELECT * FROM chat_messages ORDER BY timestamp ASC');
    } catch (error) {
      console.error('❌ Error getting cached chat messages:', error);
      return [];
    }
  }

  // Add message to offline queue
  async addMessageToQueue(message) {
    if (!this.db) return;
    
    try {
      const id = `offline_${Date.now()}_${Math.random()}`;
      await this.db.runAsync(
        'INSERT INTO chat_messages (id, message, sender_name, sender_id, timestamp, synced) VALUES (?, ?, ?, ?, ?, ?)',
        [
          id,
          message.message,
          message.sender_name,
          message.sender_id,
          message.timestamp,
          0 // Not synced yet
      ]);
      
      console.log('📱 Message added to offline queue');
    } catch (error) {
      console.error('❌ Error adding message to queue:', error);
    }
  }

  // Add event signup to queue
  async addEventSignupToQueue(eventId, userData) {
    if (!this.db) return;
    
    try {
      const id = `signup_${Date.now()}_${Math.random()}`;
      await this.db.runAsync(
        'INSERT INTO sync_queue (id, action, table_name, data, timestamp) VALUES (?, ?, ?, ?, ?)',
        [
          id,
          'event_signup',
          'events',
          JSON.stringify({ eventId, userData }),
          new Date().toISOString()
        ]
      );
      
      console.log('📱 Event signup added to sync queue');
    } catch (error) {
      console.error('❌ Error adding event signup to queue:', error);
    }
  }

  // Add admin action to queue
  async addAdminActionToQueue(action, data) {
    if (!this.db) return;
    
    try {
      const id = `admin_${Date.now()}_${Math.random()}`;
      await this.db.runAsync(
        'INSERT INTO sync_queue (id, action, table_name, data, timestamp) VALUES (?, ?, ?, ?, ?)',
        [
          id,
          action,
          'admin_actions',
          JSON.stringify(data),
          new Date().toISOString()
        ]
      );
      
      console.log('📱 Admin action added to sync queue');
    } catch (error) {
      console.error('❌ Error adding admin action to queue:', error);
    }
  }

  // Get sync queue
  async getSyncQueue() {
    if (!this.db) return [];
    
    try {
      return await this.db.getAllAsync('SELECT * FROM sync_queue ORDER BY timestamp ASC');
    } catch (error) {
      console.error('❌ Error getting sync queue:', error);
      return [];
    }
  }

  // Clear sync queue item
  async clearSyncQueueItem(id) {
    if (!this.db) return;
    
    try {
      await this.db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
    } catch (error) {
      console.error('❌ Error clearing sync queue item:', error);
    }
  }

  // Sync data when online
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
              // Sync event signup
              console.log('🔄 Syncing event signup:', data);
              // Add your Supabase sync logic here
              break;
              
            case 'chat_message':
              // Sync chat message
              console.log('🔄 Syncing chat message:', data);
              // Add your Supabase sync logic here
              break;
              
            case 'admin_action':
              // Sync admin action
              console.log('🔄 Syncing admin action:', data);
              // Add your Supabase sync logic here
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

  // Get offline status
  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      hasCachedData: true, // You can implement logic to check if data exists
      lastSync: null // You can implement logic to get last sync time
    };
  }

  // Clear all cached data
  async clearCache() {
    if (!this.db) return;
    
    try {
      await this.db.runAsync('DELETE FROM events');
      await this.db.runAsync('DELETE FROM announcements');
      await this.db.runAsync('DELETE FROM chat_messages');
      await this.db.runAsync('DELETE FROM sync_queue');
      await this.db.runAsync('DELETE FROM user_data');
      
      await AsyncStorage.multiRemove([
        'events_last_sync',
        'announcements_last_sync'
      ]);
      
      console.log('📱 Cache cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  }
}

// Create singleton instance
const offlineService = new OfflineService();

export default offlineService; 