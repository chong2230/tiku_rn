//
//  ApiUtilBridgeModule.m
//

#import "ApiUtilBridgeModule.h"
#import "WechatPayHelper.h"


@implementation ApiUtilBridgeModule
RCT_EXPORT_MODULE();

/**
 对businessParas参数进行签名

 @param NSDictionary 签名的参数
 @return 签名字符串
 */
RCT_EXPORT_METHOD(getSignature:(NSDictionary *)businessParas
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject) {
    if (![businessParas isKindOfClass:[NSDictionary class]]
        || businessParas.allKeys.count <= 0) {
        reject(@"100", @"传入参数不合法", nil);
        return;
    }
    NSString *sign =  [WechatPayHelper createlkMd5Sign:(NSMutableDictionary *)businessParas];
    resolve(sign);
}

@end
