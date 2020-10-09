# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keepattributes *Annotation*
-keepclassmembers class ** {
  @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

#-keep class 包名.xutils.**{*;}//这是xutils在我自己的项目的路径
-keep class com.google.common.**{*;}
-dontwarn org.apache.http.**
-dontwarn com.google.common.**

-keep class com.alipay.android.app.IAlixPay{*;}
-keep class com.alipay.android.app.IAlixPay$Stub{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback$Stub{*;}
-keep class com.alipay.sdk.app.PayTask{ public *;}
-keep class com.alipay.sdk.app.AuthTask{ public *;}
-dontwarn android.net.**
-keep class android.net.SSLCertificateSocketFactory{*;}

-optimizationpasses 5
-ignorewarnings
-allowaccessmodification
#-dontpreverify

#开启侵入性重载混淆
-overloadaggressively
#指定不去忽略非公共的库类。
-dontskipnonpubliclibraryclasses
#指定不去忽略包可见的库类的成员。
-dontskipnonpubliclibraryclassmembers
#确定统一的混淆类的成员名称来增加混淆
-useuniqueclassmembernames
#混淆时不会产生形形色色的类名
-dontusemixedcaseclassnames

-target 1.6
-useuniqueclassmembernames
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable
-adaptresourcefilenames **.properties
-adaptresourcefilecontents **.properties,META-INF/MANIFEST.MF
-verbose



#jar包里面的类不混淆
-keep class com.lion.ccpay.** { *;}
-keep class android.support.v4.** {*;}
-keep class com.UCMobile.** {*;}
-keep class com.alipay.** {*;}
-keep class com.dataeye.** {*;}
-keep class com.loopj.android.http.** {*;}
-keep class com.nostra13.universalimageloader.** {*;}
-keep class com.ta.utdid2.** { *;}
-keep class com.tencent.** { *;}
-keep class com.unionpay.** { *;}
-keep class com.ut.device.** { *;}
-keep class com.xbfxmedia.player.** { *;}
-keep class org.apache.** {*;}