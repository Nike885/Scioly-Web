import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../contexts/EventsContext';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useTheme } from '../contexts/ThemeContext';

export default function EventDeletionScreen({ navigation }) {
  const { events, deleteEvent, refreshEvents } = useEvents();
  const { isAdmin } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState({});

  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    type: 'single',
    eventId: null,
    eventTitle: '',
    count: 0
  });

  const [messageDialog, setMessageDialog] = useState({
    visible: false,
    title: '',
    message: '',
    isError: false
  });

  useEffect(() => {
    if (!isAdmin) {
      navigation.goBack();
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshEvents();
  }, []);

  const deleteSelectedEvents = async () => {
    const selectedIds = Object.keys(selectedEvents).filter(id => selectedEvents[id]);
    if (selectedIds.length === 0) return;

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        await deleteEvent(id);
        successCount++;
      } catch (e) {
        console.error(`Failed to delete ${id}`, e);
        errorCount++;
      }
    }

    setSelectedEvents({});
    await refreshEvents();

    setMessageDialog({
      visible: true,
      title: errorCount ? 'Partial Success' : 'Success',
      message: errorCount
        ? `Deleted ${successCount}, failed ${errorCount}`
        : `Deleted ${successCount} successfully`,
      isError: !!errorCount
    });

    if (!errorCount) {
      setTimeout(() => navigation.navigate('CalendarMain'), 1500);
    }

    setLoading(false);
  };

  const toggleEventSelection = id => {
    setSelectedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date().setHours(0, 0, 0, 0));
  const pastEvents = events.filter(e => new Date(e.date) < new Date().setHours(0, 0, 0, 0));

  const selectAllInSection = section => {
    const updated = { ...selectedEvents };
    (section === 'upcoming' ? upcomingEvents : pastEvents).forEach(e => updated[e.id] = true);
    setSelectedEvents(updated);
  };

  const formatEventDate = dateStr => new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  const handleSingleDelete = id => {
    const evt = events.find(e => e.id === id);
    setConfirmDialog({
      visible: true,
      type: 'single',
      eventId: id,
      eventTitle: evt?.title || 'this event',
      count: 1
    });
  };

  const handleMultipleDelete = () => {
    const count = Object.values(selectedEvents).filter(Boolean).length;
    setConfirmDialog({ visible: true, type: 'multiple', count });
  };

  const confirmDeletion = async () => {
    setConfirmDialog({ visible: false, type: 'single', eventId: null, eventTitle: '', count: 0 });
    setLoading(true);
    try {
      if (confirmDialog.type === 'single') {
        await deleteEvent(confirmDialog.eventId);
        await refreshEvents();
        setMessageDialog({
          visible: true,
          title: 'Success',
          message: 'Event deleted successfully',
          isError: false
        });
        setTimeout(() => navigation.navigate('CalendarMain'), 1500);
      } else {
        await deleteSelectedEvents();
      }
    } catch (e) {
      console.error(e);
      setMessageDialog({
        visible: true,
        title: 'Error',
        message: 'Failed to delete event(s)',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.eventItem,
        { backgroundColor: colors.card, borderColor: selectedEvents[item.id] ? colors.primary : colors.border },
        selectedEvents[item.id] && { borderWidth: 2, backgroundColor: colors.inputBackground }
      ]}
      onPress={() => toggleEventSelection(item.id)}
    >
      <View style={styles.eventItemContent}>
        <View style={[styles.eventColor, { backgroundColor: item.color || colors.primary }]} />
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.eventDetails, { color: colors.textSecondary }]}>
            {formatEventDate(item.date)} • {item.location}
          </Text>
          <Text style={[styles.attendeeCount, { color: colors.secondary }]}>
            {item.attendees?.length || 0} / {item.capacity || 50} attendees
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <Ionicons name={selectedEvents[item.id] ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={selectedEvents[item.id] ? colors.primary : colors.cardShadow} />
          <TouchableOpacity style={styles.deleteIconButton} onPress={() => handleSingleDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, count, section }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.inputBackground }]}> 
      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>{count} events</Text>
      </View>
      {count > 0 && (
        <TouchableOpacity style={styles.selectAllButton} onPress={() => selectAllInSection(section)}>
          <Text style={[styles.selectAllText, { color: colors.primary }]}>Select All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const selectedCount = Object.values(selectedEvents).filter(Boolean).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Events</Text>
        <TouchableOpacity
          style={[styles.deleteButton, (loading || selectedCount === 0) && styles.disabledButton, { backgroundColor: loading || selectedCount === 0 ? colors.cardShadow : colors.error }]}
          onPress={handleMultipleDelete}
          disabled={loading || selectedCount === 0}
        >
          <Text style={[styles.deleteButtonText, (loading || selectedCount === 0) && styles.disabledButtonText, { color: colors.background }]}>Delete</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={[
          { title: 'Upcoming Events', data: upcomingEvents, key: 'upcoming' },
          { title: 'Past Events', data: pastEvents, key: 'past' }
        ]}
        renderItem={({ item }) => (
          <View>
            <SectionHeader title={item.title} count={item.data.length} section={item.key} />
            {item.data.map(event => renderEventItem({ item: event }))}
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />

      <ConfirmationDialog
        visible={confirmDialog.visible}
        title="Confirm Deletion"
        message={confirmDialog.type === 'single'
          ? `Delete ${confirmDialog.eventTitle}?`
          : `Delete ${confirmDialog.count} selected events?`}
        onCancel={() => setConfirmDialog({ visible: false, type: 'single', eventId: null, eventTitle: '', count: 0 })}
        onConfirm={confirmDeletion}
        cancelText="Cancel"
        confirmText="Delete"
        icon="alert-circle"
        iconColor={colors.error}
      />

      <ConfirmationDialog
        visible={messageDialog.visible}
        title={messageDialog.title}
        message={messageDialog.message}
        onCancel={() => setMessageDialog({ visible: false, title: '', message: '', isError: false })}
        onConfirm={() => setMessageDialog({ visible: false, title: '', message: '', isError: false })}
        cancelText=""
        confirmText="OK"
        icon={messageDialog.isError ? 'alert-circle' : 'checkmark-circle'}
        iconColor={messageDialog.isError ? colors.error : colors.success}
      />
    </SafeAreaView>
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
    padding: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
  listContent: {
    padding: 10,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 4,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCount: {
    fontSize: 14,
  },
  selectAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  selectAllText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  eventItem: {
    borderRadius: 8,
    marginVertical: 5,
    overflow: 'hidden',
    borderWidth: 1,
  },
  selectedEventItem: {},
  eventItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  eventColor: {
    width: 8,
    height: '100%',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  attendeeCount: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIconButton: {
    marginLeft: 12,
    padding: 4,
  },
});
