import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

// 🔹 Setup notification channel
async function createDefaultChannel() {
  await notifee.createChannel({
    id: 'NailWarz1234',
    name: 'NailWarz',
    importance: AndroidImportance.HIGH,
  });
}

// 🔹 Ask for permission
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
  }
}

// 🔹 Main setup
export function setupNotificationListeners() {
  createDefaultChannel();
  requestUserPermission();

  // Foreground notifications
  return messaging().onMessage(async remoteMessage => {
    console.log('📩 FCM Message:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId: 'NailWarz1234',
        smallIcon: 'ic_launcher', // or custom drawable
        pressAction: { id: 'default' },
      },
    });
  });
}
