/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Register background handler before AppRegistry.registerComponent
messaging().setBackgroundMessageHandler(async remoteMessage => {
	console.log('FCM background message', remoteMessage);

	// Try to show a notification in background using Notifee if available
	try {
		await notifee.displayNotification({
			title: remoteMessage?.notification?.title,
			body: remoteMessage?.notification?.body,
			android: {
				channelId: 'NailWarz1234',
				smallIcon: 'ic_launcher',
			},
		});
	} catch (e) {
		// notifee may not be available in all execution contexts; ignore errors
		console.warn('Notifee display failed in background handler', e?.message || e);
	}
});

AppRegistry.registerComponent(appName, () => App);
