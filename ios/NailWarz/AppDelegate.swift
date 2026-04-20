// import UIKit
// import React
// import React_RCTAppDelegate
// import ReactAppDependencyProvider
// import Firebase
// import FirebaseMessaging

// @main
// // class AppDelegate: UIResponder, UIApplicationDelegate {
// class AppDelegate: UIResponder, UIApplicationDelegate, MessagingDelegate {
//   var window: UIWindow?

//   var reactNativeDelegate: ReactNativeDelegate?
//   var reactNativeFactory: RCTReactNativeFactory?

//   func application(
//     _ application: UIApplication,
//     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
//   ) -> Bool {
//     if FirebaseApp.app() == nil {
//         FirebaseApp.configure()
//     }
//     Messaging.messaging().delegate = self
//     let delegate = ReactNativeDelegate()
//     let factory = RCTReactNativeFactory(delegate: delegate)
//     delegate.dependencyProvider = RCTAppDependencyProvider()

//     reactNativeDelegate = delegate
//     reactNativeFactory = factory

//     window = UIWindow(frame: UIScreen.main.bounds)

//     factory.startReactNative(
//       withModuleName: "NailWarz",
//       in: window,
//       launchOptions: launchOptions
//     )

//     return true
//   }
// }

// class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
//   override func sourceURL(for bridge: RCTBridge) -> URL? {
//     self.bundleURL()
//   }

//   override func bundleURL() -> URL? {
// #if DEBUG
//     RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
// #else
//     Bundle.main.url(forResource: "main", withExtension: "jsbundle")
// #endif
//   }
// }

// extension AppDelegate {
//   func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
//     print("🔥 FCM TOKEN:", fcmToken ?? "nil")
//   }
// }


import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: UIResponder,
                   UIApplicationDelegate,
                   MessagingDelegate,
                   UNUserNotificationCenterDelegate {

  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    Messaging.messaging().delegate = self
    UNUserNotificationCenter.current().delegate = self

    requestNotificationPermission(application)

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "NailWarz",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // MARK: - Notification Permission
  func requestNotificationPermission(_ application: UIApplication) {
    let options: UNAuthorizationOptions = [.alert, .badge, .sound]

    UNUserNotificationCenter.current().requestAuthorization(options: options) { granted, _ in
      DispatchQueue.main.async {
        if granted {
          print("✅ Notification permission granted")
          application.registerForRemoteNotifications()
        } else {
          print("❌ Notification permission denied")
        }
      }
    }
  }

  // MARK: - APNs Success
  func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken

    let tokenString = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    print("✅ APNs Token:", tokenString)

    Messaging.messaging().token { token, error in
      if let error = error {
        print("❌ FCM token error:", error)
      } else {
        print("🔥 FCM TOKEN:", token ?? "")
      }
    }
  }

  // MARK: - APNs Failure
  func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("❌ Failed to register:", error.localizedDescription)
  }

  // MARK: - Firebase Messaging
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("🔥 FCM Registration Token Updated:", fcmToken ?? "nil")
  }

  // MARK: - Foreground Notification
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .badge, .sound])
  }

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    completionHandler()
  }
}

// React Native delegate to provide the JS bundle URL
class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}