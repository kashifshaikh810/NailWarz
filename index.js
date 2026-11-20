/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {navigate} from './src/utils/navigationRef';

// Register background handler before AppRegistry.registerComponent
messaging().setBackgroundMessageHandler(async remoteMessage => {
	console.log('📩 [PUSH_NOTIFICATION] BACKGROUND handler received:', JSON.stringify(remoteMessage, null, 2));
	console.log('📩 [PUSH_NOTIFICATION] BACKGROUND notification:', remoteMessage?.notification);
	console.log('📩 [PUSH_NOTIFICATION] BACKGROUND data payload:', remoteMessage?.data);

	// Try to show a notification in background using Notifee if available
	try {
		await notifee.displayNotification({
			title: remoteMessage?.notification?.title,
			body: remoteMessage?.notification?.body,
			data: remoteMessage?.data || {},
			android: {
				channelId: 'NailWarz1234',
				smallIcon: 'ic_launcher',
				pressAction: {id: 'default'},
			},
		});
	} catch (e) {
		// notifee may not be available in all execution contexts; ignore errors
		console.warn('Notifee display failed in background handler', e?.message || e);
	}
});

notifee.onBackgroundEvent(async ({type, detail}) => {
	console.log('📩 [PUSH_NOTIFICATION] NOTIFEE background event received:', type);
	if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
		console.log('📩 [PUSH_NOTIFICATION] NOTIFEE background press detected -> navigating to Notification');
		navigate('Notification', detail?.notification?.data);
	}
});

AppRegistry.registerComponent(appName, () => App);
