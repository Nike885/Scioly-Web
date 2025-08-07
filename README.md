# Cypress Ranch Science Olympiad Web App

A modern web application for Cypress Ranch Science Olympiad, designed to match the mobile app experience with a beautiful dark theme and comprehensive functionality.

## Features

### 🏠 **Home Screen**
- Welcome section with user greeting
- Science Olympiad logo and branding
- Quick action cards for easy navigation
- Admin tools (for administrators)
- Responsive design that works on all devices

### 📅 **Calendar**
- Interactive calendar view
- Event management for administrators
- Month navigation
- Event creation and deletion tools

### 📚 **Resources**
- Comprehensive event resources
- Lab events, build events, and study events
- Search functionality
- Detailed event information and study guides

### 👥 **Officers**
- Leadership team profiles
- Contact information
- Professional presentation with photos

### 📞 **Contact**
- Instagram integration
- Contact information
- Social media links
- Team updates and achievements

### ⚙️ **Settings**
- Connection status management
- Notification preferences
- Security settings
- App information and version details

## Design Features

### 🎨 **Modern Dark Theme**
- Beautiful dark background (#121212)
- Light blue accents (#6EC6FF)
- Orange highlights (#FFB74D)
- Professional typography and spacing

### 📱 **Responsive Design**
- Works perfectly on desktop, tablet, and mobile
- Touch-friendly interface
- Optimized for web browsers
- PWA-ready for mobile installation

### 🚀 **Performance**
- Fast loading times
- Smooth animations
- Offline capability
- Efficient data management

## Technology Stack

- **Frontend**: React Native Web
- **Styling**: React Native StyleSheet
- **State Management**: React Context API
- **Storage**: AsyncStorage (web-compatible)
- **Build Tool**: Expo Webpack Config
- **Deployment**: Netlify-ready

## Getting Started

### Prerequisites
- Node.js 18.19.1 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Scioly-Web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build:web
```

## Deployment

The app is configured for deployment on Netlify:

1. Build the project:
```bash
npm run build:web
```

2. Deploy the `web-build` folder to Netlify

3. Configure environment variables if needed

## File Structure

```
Scioly-Web/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── screens/            # Main application screens
├── services/           # API and service functions
├── utils/              # Utility functions and theme
├── assets/             # Images and static assets
├── public/             # Public assets and HTML
└── App.js              # Main application component
```

## Key Components

### Navigation
- Fixed bottom navigation bar
- Icon-based navigation with labels
- Active state indicators
- Smooth transitions

### Theme System
- Dark mode by default
- Consistent color palette
- Responsive design tokens
- Easy theme switching

### Offline Support
- Network status monitoring
- Offline data caching
- Sync queue management
- Graceful degradation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Cypress Ranch Science Olympiad**
