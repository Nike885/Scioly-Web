import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notifications
  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // For managed Expo apps, we'll skip push token registration
      // and only use local notifications
      console.log('Notifications initialized successfully (local only)');
      
      // Set up notification listeners
      this.setupNotificationListeners();

      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      // Don't show alert for notification errors - just log them
      return false;
    }
  }

  // Set up notification listeners
  setupNotificationListeners() {
    // Listen for incoming notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification responses (when user taps notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification response
  handleNotificationResponse(response) {
    const { notification } = response;
    const data = notification.request.content.data;

    // Handle different types of notifications
    switch (data.type) {
      case 'announcement':
        // Navigate to announcements screen
        break;
      case 'event':
        // Navigate to event details
        break;
      case 'chat':
        // Navigate to chat screen
        break;
      default:
        break;
    }
  }

  // Send local notification
  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Schedule notification for later
  async scheduleNotification(title, body, trigger, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Send event reminder
  async sendEventReminder(event, minutesBefore = 30) {
    const eventTime = new Date(event.date);
    const reminderTime = new Date(eventTime.getTime() - (minutesBefore * 60 * 1000));
    
    if (reminderTime > new Date()) {
      await this.scheduleNotification(
        `Event Reminder: ${event.title}`,
        `Your event starts in ${minutesBefore} minutes at ${event.location}`,
        { date: reminderTime },
        {
          type: 'event',
          eventId: event.id,
          title: event.title,
        }
      );
    }
  }

  // Send announcement notification
  async sendAnnouncementNotification(announcement) {
    await this.sendLocalNotification(
      'New Announcement',
      announcement.title,
      {
        type: 'announcement',
        announcementId: announcement.id,
        title: announcement.title,
      }
    );
  }

  // Send chat notification
  async sendChatNotification(message, senderName) {
    await this.sendLocalNotification(
      `New Message from ${senderName}`,
      message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      {
        type: 'chat',
        messageId: message.id,
        senderName,
      }
    );
  }

  // Get notification preferences
  async getNotificationPreferences() {
    try {
      const preferences = await AsyncStorage.getItem('notificationPreferences');
      return preferences ? JSON.parse(preferences) : {
        announcements: true,
        events: true,
        chat: true,
        reminders: true,
      };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return {
        announcements: true,
        events: true,
        chat: true,
        reminders: true,
      };
    }
  }

  // Save notification preferences
  async saveNotificationPreferences(preferences) {
    try {
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }

  // Check if notifications are enabled for a specific type
  async isNotificationEnabled(type) {
    const preferences = await this.getNotificationPreferences();
    return preferences[type] !== false;
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Get badge count
  async getBadgeCount() {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  // Set badge count
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get push token (will be null for managed apps)
  getPushToken() {
    return this.expoPushToken;
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService; 