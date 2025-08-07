import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { font } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import OfficersScreen from '../screens/OfficersScreen';
import EventCreationScreen from '../screens/EventCreationScreen';
import ContactScreen from '../screens/ContactScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EventScreen from '../screens/EventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import AttendeeListScreen from '../screens/AttendeeListScreen';
import EventDeletionScreen from '../screens/EventDeletionScreen';
import EventManagementScreen from '../screens/EventManagementScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import CreateAnnouncementScreen from '../screens/CreateAnnouncementScreen';
import ChatScreen from '../screens/ChatScreen';
import StudentLoginScreen from '../screens/StudentLoginScreen';
import StudentAccountCreationScreen from '../screens/StudentAccountCreationScreen';
import StudentVerificationScreen from '../screens/StudentVerificationScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LandingScreen from '../screens/LandingScreen';
import StudyEventsScreen from '../screens/StudyEventsScreen';
import BuildEventsScreen from '../screens/BuildEventsScreen';
import LabEventsScreen from '../screens/LabEventsScreen';
import UnifiedResourcesScreen from '../screens/UnifiedResourcesScreen';
import InstagramFollowScreen from '../screens/InstagramFollowScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import DailyQuizScreen from '../screens/DailyQuizScreen';
import AdminQuizResultsScreen from '../screens/AdminQuizResultsScreen';
import VideoShowcaseScreen from '../screens/VideoShowcaseScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for different sections
function HomeStack() {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        headerStyle: { 
          backgroundColor: colors.primary, 
          elevation: 0, 
          shadowOpacity: 0 
        },
        headerTitleStyle: { 
          color: colors.text, 
          fontWeight: font.weight.bold, 
          fontSize: font.size.title 
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EventCreation" component={EventCreationScreen} />
      <Stack.Screen name="DailyQuiz" component={DailyQuizScreen} />
      <Stack.Screen name="AdminQuizResults" component={AdminQuizResultsScreen} />
      <Stack.Screen name="VideoShowcase" component={VideoShowcaseScreen} />
      <Stack.Screen 
        name="InstagramFollow" 
        component={InstagramFollowScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Follow Us',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalendarMain" component={CalendarScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="AttendeeList" component={AttendeeListScreen} />
      <Stack.Screen name="EventDeletion" component={EventDeletionScreen} />
      <Stack.Screen name="EventCreation" component={EventCreationScreen} />
      <Stack.Screen name="EventManagement" component={EventManagementScreen} />
    </Stack.Navigator>
  );
}

function ResourcesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ResourcesMain" component={UnifiedResourcesScreen} />
      <Stack.Screen name="StudyEvents" component={StudyEventsScreen} />
      <Stack.Screen name="BuildEvents" component={BuildEventsScreen} />
      <Stack.Screen name="LabEvents" component={LabEventsScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// Main tab navigator
function TabNavigator() {
  const { isAdmin, logout } = useAuth();
  const { colors } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Resources') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Officers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Contact') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          height: 62,
          paddingBottom: 8,
        },
        headerStyle: { 
          backgroundColor: colors.primary, 
          elevation: 0, 
          shadowOpacity: 0 
        },
        headerTitleStyle: { 
          color: colors.text, 
          fontWeight: font.weight.bold, 
          fontSize: font.size.title 
        },
        headerTintColor: colors.text,
      })}
    >
      {/* Home tab - Available to all users */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Calendar tab - Available to all users */}
      <Tab.Screen
        name="Calendar"
        component={CalendarStack}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Resources tab - Available to all users */}
      <Tab.Screen
        name="Resources"
        component={ResourcesStack}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Officers tab - Available to all users */}
      <Tab.Screen
        name="Officers"
        component={OfficersScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Contact tab - Available to all users */}
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Settings tab - Available to all users */}
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main app navigator
export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="StudentAccountCreation" component={StudentAccountCreationScreen} />
        <Stack.Screen name="StudentVerification" component={StudentVerificationScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  return <TabNavigator />;
}