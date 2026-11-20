import {AppState, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {navigate, flushPendingNotification} from '../../utils/navigationRef';

// 🔹 Android channel only
async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'NailWarz1234',
      name: 'Nail Warz',
      importance: AndroidImportance.HIGH,
    });
  }
}

// 🔹 Permissions (Android + iOS)
async function requestUserPermission() {
  await notifee.requestPermission(); // 🔥 REQUIRED FOR iOS

  // Ensure device is registered for remote messages on iOS
  if (Platform.OS === 'ios') {
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      console.warn('registerDeviceForRemoteMessages failed', e?.message || e);
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔔 Notification permission granted');
  }
}

// 🔹 Main listener
export function setupNotificationListeners() {
  createDefaultChannel();
  requestUserPermission();

  // 1️⃣ Foreground — app is open and in focus
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    console.log('📩 [PUSH_NOTIFICATION] FOREGROUND message received:', JSON.stringify(remoteMessage, null, 2));
    console.log('📩 [PUSH_NOTIFICATION] FOREGROUND notification:', remoteMessage?.notification);
    console.log('📩 [PUSH_NOTIFICATION] FOREGROUND data payload:', remoteMessage?.data);

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      data: remoteMessage?.data || {},

      android: {
        channelId: 'NailWarz1234',
        smallIcon: 'ic_launcher',
        pressAction: {id: 'default'},
      },

      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  });

  // Foreground notification tap listener (Notifee)
  const unsubscribeForegroundEvent = notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
      console.log('📩 [PUSH_NOTIFICATION] FOREGROUND TAP - navigating to Notification', detail);
      navigate('Notification', detail?.notification?.data);
    }
  });

  // 2️⃣ Background / Minimized — user taps notification to open app (Firebase native)
  const unsubscribeOnOpened = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('📩 [PUSH_NOTIFICATION] BACKGROUND TAP - notification opened app:', JSON.stringify(remoteMessage, null, 2));
    console.log('📩 [PUSH_NOTIFICATION] BACKGROUND TAP notification:', remoteMessage?.notification);
    console.log('📩 [PUSH_NOTIFICATION] BACKGROUND TAP data payload:', remoteMessage?.data);
    setTimeout(() => {
      navigate('Notification', remoteMessage?.data);
    }, 300);
  });

  // 3️⃣ Quit state — app was killed, user taps notification to launch app
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('📩 [PUSH_NOTIFICATION] QUIT STATE - app opened from notification:', JSON.stringify(remoteMessage, null, 2));
        console.log('📩 [PUSH_NOTIFICATION] QUIT STATE notification:', remoteMessage?.notification);
        console.log('📩 [PUSH_NOTIFICATION] QUIT STATE data payload:', remoteMessage?.data);
        setTimeout(() => {
          navigate('Notification', remoteMessage?.data);
        }, 500);
      }
    });

  notifee
    .getInitialNotification()
    .then(initialNotification => {
      if (initialNotification) {
        console.log('📩 [PUSH_NOTIFICATION] QUIT STATE (Notifee) - app opened from notification:', initialNotification);
        setTimeout(() => {
          navigate('Notification', initialNotification?.notification?.data);
        }, 500);
      }
    });

  // 4️⃣ AppState listener — when app comes to active foreground, flush pending or check Notifee initial notification
  const appStateSubscription = AppState.addEventListener('change', async nextAppState => {
    if (nextAppState === 'active') {
      console.log('📱 [APP_STATE] App became active, checking pending route & initial notification');
      flushPendingNotification();
      try {
        const initial = await notifee.getInitialNotification();
        if (initial) {
          console.log('📩 [PUSH_NOTIFICATION] AppState active - found initial Notifee notification:', initial);
          navigate('Notification', initial?.notification?.data);
        }
      } catch (err) {
        console.warn('Error checking initial notification on active:', err);
      }
    }
  });

  // Return cleanup function
  return () => {
    unsubscribeOnMessage();
    unsubscribeForegroundEvent();
    unsubscribeOnOpened();
    appStateSubscription?.remove();
  };
}
