// components/OfflineStatusIndicator.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useOffline } from '../contexts/OfflineContext';
import { useTheme } from '../contexts/ThemeContext';
import { font } from '../utils/theme';

export default function OfflineStatusIndicator() {
  const { colors } = useTheme();
  const { isOnline, syncStatus, pendingActions, handleSync } = useOffline();

  const getStatusColor = () => {
    if (!isOnline) return colors.error;
    if (syncStatus === 'syncing') return colors.warning;
    if (syncStatus === 'error') return colors.error;
    if (pendingActions > 0) return colors.warning;
    return colors.success;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'error') return 'Sync Error';
    if (pendingActions > 0) return `${pendingActions} pending`;
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return 'cloud-offline';
    if (syncStatus === 'syncing') return 'sync';
    if (syncStatus === 'error') return 'alert-circle';
    if (pendingActions > 0) return 'cloud-upload';
    return 'cloud-done';
  };

  const getStatusIconColor = () => {
    if (!isOnline) return colors.background;
    if (syncStatus === 'syncing') return colors.background;
    if (syncStatus === 'error') return colors.background;
    if (pendingActions > 0) return colors.background;
    return colors.background;
  };

  if (isOnline && syncStatus === 'idle' && pendingActions === 0) {
    return null; // Don't show indicator when everything is good
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getStatusColor() }
      ]}
      onPress={isOnline && pendingActions > 0 ? handleSync : null}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Ionicons 
          name={getStatusIcon()} 
          size={16} 
          color={getStatusIconColor()} 
          style={[
            styles.icon,
            syncStatus === 'syncing' && styles.spinningIcon
          ]}
        />
        <Text style={[styles.text, { color: colors.background }]}>
          {getStatusText()}
        </Text>
        {pendingActions > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.background }]}>
            <Text style={[styles.badgeText, { color: getStatusColor() }]}>
              {pendingActions}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  spinningIcon: {
    transform: [{ rotate: '360deg' }],
  },
  text: {
    fontSize: 14,
    fontWeight: font.weight.semibold,
    fontFamily: font.family,
  },
  badge: {
    marginLeft: 8,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: font.weight.bold,
    fontFamily: font.family,
  },
}); 