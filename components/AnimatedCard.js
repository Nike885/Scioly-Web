import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../contexts/ThemeContext';
import { shadows } from '../utils/theme';

export default function AnimatedCard({ 
  children, 
  onPress, 
  style, 
  animationDelay = 0,
  disabled = false,
  ...props 
}) {
  const { colors } = useTheme();

  const CardComponent = onPress ? TouchableOpacity : Animatable.View;

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={animationDelay}
      duration={600}
      useNativeDriver
    >
      <CardComponent
        activeOpacity={onPress ? 0.8 : 1}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.card,
          { 
            backgroundColor: colors.card,
            shadowColor: colors.cardShadow,
          },
          style
        ]}
        {...props}
      >
        {children}
      </CardComponent>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    ...shadows.medium,
  },
}); 