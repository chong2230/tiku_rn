/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import "OpenShareHeader.h"
#import "RCTPushy.h"
//#import "RNUMConfigure.h"
//#import <UMAnalytics/MobClick.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [OpenShare connectQQWithAppId:@"101844964"];
  [OpenShare connectWeiboWithAppKey:@"3293143520"];
  [OpenShare connectWeixinWithAppId:@"wx1fe3c4b1d0608ef3"];
  [OpenShare connectRenrenWithAppId:@"228525" AndAppKey:@"1dd8cba4215d4d4ab96a49d3058c1d7f"];
  
//  [UMConfigure setLogEnabled:YES];
//  [MobClick setScenarioType:E_UM_NORMAL];
//  [RNUMConfigure initWithAppkey:@"5bd48045f1f55640f3000a25" channel:@"App Store"];

  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"tiku_rn"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  // 非DEBUG情况下替换为热更新bundle
//  return [RCTPushy bundleURL];
#endif
}

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation{
  //第二步：添加回调
  if ([OpenShare handleOpenURL:url]) {
    return YES;
  }
  //这里可以写上其他OpenShare不支持的客户端的回调，比如支付宝等。
  //  if ([JSHAREService handleOpenUrl:url]) {
  //    return YES;
  //  }
  return YES;
}

// work in iOS(9_0)
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url{
  if ([OpenShare handleOpenURL:url]) {
    return YES;
  }
  //  if ([JSHAREService handleOpenUrl:url]) {
  //    return YES;
  //  }
  return YES;
}
// work in iOS(9_0,++)
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if ([OpenShare handleOpenURL:url]) {
    return YES;
  }
  //  if ([JSHAREService handleOpenUrl:url]) {
  //    return YES;
  //  }
  return YES;
}

@end
