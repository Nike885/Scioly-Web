import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import { font, shadows } from '../utils/theme';

export default function AnimatedButton({ 
  children, 
  onPress, 
  style, 
  variant = 'primary',
  disabled = false,
  icon,
  iconColor,
  backgroundColor,
  textColor,
  ...props 
}) {
  const { colors } = useTheme();

  // Determine colors based on variant and props
  const getButtonColors = () => {
    if (backgroundColor && textColor) {
      return { bg: backgroundColor, text: textColor };
    }

    switch (variant) {
      case 'primary':
        return { bg: colors.primary, text: colors.background };
      case 'secondary':
        return { bg: colors.secondary, text: colors.text };
      case 'accent':
        return { bg: colors.accent, text: colors.background };
      case 'success':
        return { bg: colors.success, text: colors.background };
      case 'warning':
        return { bg: colors.warning, text: colors.text };
      case 'error':
        return { bg: colors.error, text: colors.background };
      case 'info':
        return { bg: colors.info, text: colors.background };
      case 'outline':
        return { bg: 'transparent', text: colors.primary, border: colors.primary };
      case 'ghost':
        return { bg: 'transparent', text: colors.primary };
      default:
        return { bg: colors.primary, text: colors.background };
    }
  };

  const buttonColors = getButtonColors();

  return (
    <View 
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.button,
          { 
            backgroundColor: buttonColors.bg,
            borderColor: buttonColors.border,
            opacity: disabled ? 0.6 : 1,
          },
          buttonColors.border && { borderWidth: 2 },
          style
        ]}
        {...props}
      >
        {icon && (
          <View style={styles.iconContainer}>
            {React.cloneElement(icon, { 
              color: iconColor || buttonColors.text,
              size: 20 
            })}
          </View>
        )}
        <Text style={[
          styles.text, 
          { color: buttonColors.text }
        ]}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
    ...shadows.small,
  },
  text: {
    fontSize: font.size.body,
    fontWeight: font.weight.bold,
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
}); 