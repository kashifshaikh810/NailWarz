import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

// 🔹 Android channel only
async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'NailWarz1234',
      name: 'NailWarz',
      importance: AndroidImportance.HIGH,
    });
  }
}

// 🔹 Permissions (Android + iOS)
async function requestUserPermission() {
  await notifee.requestPermission(); // 🔥 REQUIRED FOR iOS

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

  return messaging().onMessage(async remoteMessage => {
    console.log('📩 FCM Message:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,

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
}
