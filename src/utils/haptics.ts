// Haptic feedback utility for mobile devices
export const haptics = {
  // Light tap - for buttons, selections
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  // Medium tap - for important actions like add to cart
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  
  // Heavy tap - for confirmations, errors
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  
  // Success pattern - double tap
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 50, 20]);
    }
  },
  
  // Error pattern - triple tap
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 30, 30, 30, 30]);
    }
  },
  
  // Selection changed
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },
};
