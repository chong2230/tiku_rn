//
//  WechatPayHelper.h
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 微信支付辅助类。
 **/
@interface WechatPayHelper : NSObject

// md5签名
+ (NSString*)createMd5Sign:(NSMutableDictionary*)dict;
// md5签名
+ (NSString*)createlkMd5Sign:(NSMutableDictionary*)dict;

// 计算md5值。
+ (NSString *) md5:(NSString *)str;

// 获取微信要求时间戳
+ (NSString *)timeStamp;

@end

NS_ASSUME_NONNULL_END
