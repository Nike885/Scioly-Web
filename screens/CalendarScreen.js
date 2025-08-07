import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useEvents } from '../contexts/EventsContext';

export default function CalendarScreen({ onNavigate }) {
  const { colors } = useTheme();
  const { isAdmin } = useAuth();
  const { events } = useEvents();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getMonthName = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {/* Share functionality */}}
        >
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Calendar Navigation */}
        <View style={[styles.calendarNav, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={styles.navButton} onPress={goToPreviousMonth}>
            <Text style={styles.navIcon}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={goToNextMonth}>
            <Text style={styles.navIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Week Days Header */}
          <View style={styles.weekDaysHeader}>
            {weekDays.map((day, index) => (
              <Text key={index} style={[styles.weekDay, { color: colors.textSecondary }]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayCell}>
                {day && (
                  <Text style={[
                    styles.dayText,
                    { color: colors.text },
                    day === 7 && styles.currentDay // Highlight current day
                  ]}>
                    {day}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Admin Event Management */}
        {isAdmin && (
          <View style={styles.adminSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Event Management
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Choose an action to manage events
            </Text>

            <TouchableOpacity
              style={[styles.adminCard, { backgroundColor: colors.card }]}
              onPress={() => onNavigate('calendar')}
            >
              <View style={[styles.adminIconContainer, { backgroundColor: colors.secondary }]}>
                <Text style={styles.adminIcon}>➕</Text>
              </View>
              <View style={styles.adminCardContent}>
                <Text style={[styles.adminCardTitle, { color: colors.text }]}>
                  Add New Event
                </Text>
                <Text style={[styles.adminCardSubtitle, { color: colors.textSecondary }]}>
                  Create a new event for the calendar
                </Text>
              </View>
              <Text style={styles.adminArrow}>▶</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.adminCard, { backgroundColor: colors.card }]}
              onPress={() => onNavigate('calendar')}
            >
              <View style={[styles.adminIconContainer, { backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.adminIcon}>🗑️</Text>
              </View>
              <View style={styles.adminCardContent}>
                <Text style={[styles.adminCardTitle, { color: colors.text }]}>
                  Delete Events
                </Text>
                <Text style={[styles.adminCardSubtitle, { color: colors.textSecondary }]}>
                  Remove events from the calendar
                </Text>
              </View>
              <Text style={styles.adminArrow}>▶</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingBottom: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shareButton: {
    padding: 8,
  },
  shareIcon: {
    fontSize: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  calendarContainer: {
    padding: 20,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 10,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  currentDay: {
    color: '#FFB74D',
    fontWeight: 'bold',
  },
  adminSection: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adminIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  adminIcon: {
    fontSize: 20,
  },
  adminCardContent: {
    flex: 1,
  },
  adminCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adminCardSubtitle: {
    fontSize: 14,
  },
  adminArrow: {
    fontSize: 16,
    color: '#666',
  },
  bottomSpacing: {
    height: 100,
  },
});