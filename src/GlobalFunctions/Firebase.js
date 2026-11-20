import {getApp} from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getAPNSToken,
  getMessaging,
  getToken,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

export async function requestUserPermission() {
  const messagingFirebase = getMessaging(getApp());
  const authStatus = await requestPermission(messagingFirebase);
  const granted =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  console.log('Notification permission status:', {authStatus, granted});

  return granted;
}

// -------------------- FCM Token --------------------
export async function getFcmToken() {
  const messagingFirebase = getMessaging(getApp());
  const granted = await requestUserPermission();

  if (!granted) {
    return null;
  }

  if (Platform.OS === 'ios') {
    await registerDeviceForRemoteMessages(messagingFirebase);
    const apnsToken = await getAPNSToken(messagingFirebase);
    console.log('iOS APNs token:', apnsToken);
  }

  const fcmToken = await getToken(messagingFirebase);
  console.log('FCM token:', fcmToken);

  return fcmToken;
}
