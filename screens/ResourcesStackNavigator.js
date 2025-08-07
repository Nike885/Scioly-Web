import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UnifiedResourcesScreen from '../screens/UnifiedResourcesScreen';
import LabEventsScreen from '../screens/LabEventsScreen';
import BuildEventsScreen from '../screens/BuildEventsScreen';
import StudyEventsScreen from '../screens/StudyEventsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';

const Stack = createStackNavigator();

export default function ResourcesStackNavigator() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name="ResourcesMain"
        component={UnifiedResourcesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LabEvents"
        component={LabEventsScreen}
        options={{ title: 'Lab Events', headerShown: true }}
      />
      <Stack.Screen
        name="BuildEvents"
        component={BuildEventsScreen}
        options={{ title: 'Build Events', headerShown: true }}
      />
      <Stack.Screen
        name="StudyEvents"
        component={StudyEventsScreen}
        options={{ title: 'Study Events', headerShown: true }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Event Details', headerShown: true }}
      />
    </Stack.Navigator>
  );
}