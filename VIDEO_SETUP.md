# Video Showcase Setup

## Overview
The Scioly App now includes a video showcase feature that allows users to watch a compilation of Science Olympiad moments. This feature provides an engaging way to showcase the excitement and fun of Science Olympiad to new users.

## How to Add Your Video

### 1. Prepare Your Video
- Format: MP4
- Recommended duration: 30-60 seconds
- Recommended resolution: 720p or 1080p
- File size: Keep under 50MB for optimal performance

### 2. Add the Video File
1. Replace the placeholder file at `assets/videos/scioly_moments.mp4` with your actual video
2. Make sure the filename is exactly `scioly_moments.mp4`

### 3. Video Content Suggestions
Your video should include:
- Competition highlights
- Team building moments
- Students working together
- Celebration scenes
- Any fun or memorable Scioly moments

### 4. Testing
After adding your video:
1. Run `expo start` to test the app
2. Navigate to Home → Quick Actions → "Scioly Moments"
3. Test the video player functionality

## Features Included

### Video Player
- Full-screen modal video player
- Play/pause controls
- Progress bar with time display
- Restart functionality
- Loading states and error handling
- Beautiful animations and transitions

### Landing Page
- Dedicated showcase screen with:
  - Hero section explaining the video
  - Preview card with play button
  - Feature highlights section
  - Call-to-action buttons

### Navigation
- Accessible from Home screen Quick Actions
- Integrated into the app's navigation stack
- Consistent with app's design theme

## Technical Details

### Dependencies Added
- `expo-av`: For video playback functionality

### Files Created/Modified
- `components/VideoShowcase.js`: Video player component
- `screens/VideoShowcaseScreen.js`: Landing page screen
- `navigation/AppNavigator.js`: Added navigation route
- `screens/HomeScreen.js`: Added quick action button
- `app.json`: Updated asset bundle patterns

### Theme Integration
The video showcase follows your app's design preferences:
- Uses only blue colors (#1a365d, #4299e1) and white
- No yellow elements
- Consistent with existing UI patterns
- Responsive design for different screen sizes

## Troubleshooting

### Video Not Playing
- Check that the video file is properly placed in `assets/videos/`
- Ensure the filename is exactly `scioly_moments.mp4`
- Verify the video format is MP4
- Check file size (should be under 50MB)

### Performance Issues
- Compress the video if file size is too large
- Consider reducing resolution if needed
- Test on different devices to ensure compatibility

### Build Issues
- Run `expo install` to ensure all dependencies are installed
- Clear cache with `expo start -c` if needed
- Check that `expo-av` is properly installed

## Customization

You can customize the video showcase by modifying:
- Video description in `VideoShowcaseScreen.js`
- Feature highlights in the landing page
- Video player styling in `VideoShowcase.js`
- Colors and themes to match your preferences

The video showcase is now ready to use! Just add your Scioly moments video and users will be able to experience the excitement of Science Olympiad through your app. 