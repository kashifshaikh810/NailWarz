import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let pendingRoute = null;
let lastNavigatedTime = 0;

export function setPendingNotification(name = 'Notification', params = {}) {
  pendingRoute = { name, params };
  console.log('🧭 [NAVIGATE] Pending notification set:', pendingRoute);
}

export function clearPendingNotification() {
  pendingRoute = null;
}

export function flushPendingNotification() {
  if (pendingRoute) {
    const { name, params } = pendingRoute;
    pendingRoute = null;
    console.log('🧭 [NAVIGATE] Flushing pending notification to:', name);
    navigate(name, params);
  }
}

export function onNavigationReady() {
  console.log('🧭 [NAVIGATE] NavigationContainer is READY');
  flushPendingNotification();
}

export function navigate(name, params = {}) {
  if (!navigationRef.isReady()) {
    console.log('🧭 [NAVIGATE] NavigationContainer is NOT ready, queuing route:', name);
    setPendingNotification(name, params);
    return;
  }

  // Guard against loops: If already on Notification screen, do not navigate again
  if (name === 'Notification') {
    const currentRoute = navigationRef.getCurrentRoute();
    if (currentRoute?.name === 'Notification') {
      console.log('🧭 [NAVIGATE] Already on Notification screen, ignoring duplicate call');
      return;
    }

    const now = Date.now();
    if (now - lastNavigatedTime < 1500) {
      console.log('🧭 [NAVIGATE] Throttling rapid duplicate navigate to Notification');
      return;
    }
    lastNavigatedTime = now;

    console.log('🧭 [NAVIGATE] Navigating cleanly to Notification screen');
    try {
      navigationRef.navigate('Main', {
        screen: 'Home',
        params: {
          screen: 'Notification',
          initial: false,
          params,
        },
      });
    } catch (err) {
      console.warn('🧭 [NAVIGATE] Navigation error:', err);
    }
    return;
  }

  try {
    navigationRef.navigate(name, params);
  } catch (error) {
    console.log('🧭 [NAVIGATE] Navigation error:', error);
  }
}

