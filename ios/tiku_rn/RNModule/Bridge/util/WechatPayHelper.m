//
//  WechatPayHelper.m
//

#import "WechatPayHelper.h"

#import <CommonCrypto/CommonDigest.h>

@implementation WechatPayHelper

+ (NSString*)createMd5Sign:(NSMutableDictionary*)dict
{
    NSMutableString *contentString  =[NSMutableString string];
    NSArray *keys = [dict allKeys];
    //按字母顺序排序
    NSArray *sortedArray = [keys sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        return [obj1 compare:obj2 options:NSNumericSearch];
    }];
    //拼接字符串
    for (NSString *categoryId in sortedArray) {
        if (   ![[dict objectForKey:categoryId] isEqualToString:@""]
            && ![categoryId isEqualToString:@"sign"]
            && ![categoryId isEqualToString:@"key"]
            )
        {
            [contentString appendFormat:@"%@=%@&", categoryId, [dict objectForKey:categoryId]];
        }
        
    }
    //添加key字段
//    [contentString appendFormat:@"key=%@", LKWechatAppSecret];
    [contentString appendFormat:@"key=%@", @"97ffb548d5afd0da434d19a9b25c3fba"]; //测试用。
    NSLog(@"%@",contentString);
    //得到MD5 sign签名
    NSString *md5Sign =[self md5:contentString];
    
    return md5Sign;
}

// md5签名
+ (NSString*)createlkMd5Sign:(NSMutableDictionary*)dict
{
    NSMutableString *contentString  =[NSMutableString string];
    NSArray *keys = [dict allKeys];
    //按字母顺序排序
    NSArray *sortedArray = [keys sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        return [obj1 compare:obj2 options:NSNumericSearch];
    }];
    //拼接字符串
    for (NSString *categoryId in sortedArray) {
        if (![categoryId isEqualToString:@"sign"]
            && ![categoryId isEqualToString:@"key"]
            )
        {
            [contentString appendFormat:@"%@%@", categoryId, [dict objectForKey:categoryId]];
        }
        
    }
    //添加key字段
    //    [contentString appendFormat:@"key=%@", LKWechatAppSecret];
    [contentString appendFormat:@"%@", @"D41D8CD98F00B204E9800998ECF8427E"]; //测试用。
    NSLog(@"%@",contentString);
    
    //得到MD5 sign签名
    NSString *md5Sign =[self md5:contentString];
    
    return md5Sign;
}

+ (NSString *) md5:(NSString *)str
{
    const char *cStr = [str UTF8String];
    unsigned char digest[CC_MD5_DIGEST_LENGTH];
    CC_MD5( cStr, (unsigned int)strlen(cStr), digest );
    
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    
    for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02X", digest[i]];
    
    return output;
}

+ (NSString *)timeStamp{
    return [NSString stringWithFormat:@"%ld",(long)[[NSDate date] timeIntervalSince1970]];
}

@end
