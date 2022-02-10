#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <OneSignal/OneSignal.h>
#import <React/RCTLinkingManager.h> // Add this Line in Header of file
@import GoogleSignIn;
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
@end
