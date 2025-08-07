// Simple CSS animation styles to replace react-native-animatable
export const animationStyles = {
  fadeIn: {
    opacity: 1,
    transition: 'opacity 0.3s ease-in',
  },
  fadeInUp: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'opacity 0.3s ease-in, transform 0.3s ease-out',
  },
  fadeInDown: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'opacity 0.3s ease-in, transform 0.3s ease-out',
  },
  zoomIn: {
    opacity: 1,
    transform: 'scale(1)',
    transition: 'opacity 0.3s ease-in, transform 0.3s ease-out',
  },
  bounceIn: {
    opacity: 1,
    transform: 'scale(1)',
    transition: 'opacity 0.3s ease-in, transform 0.3s ease-out',
  },
  pulse: {
    animation: 'pulse 2s infinite',
  },
};

// CSS keyframes for pulse animation
export const pulseKeyframes = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
`;

// Simple animation wrapper component
export const AnimatedView = ({ children, style, ...props }) => {
  return (
    <div style={{ ...style }} {...props}>
      {children}
    </div>
  );
}; 