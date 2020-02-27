package com.tiku_rn;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
//import com.umeng.commonsdk.UMConfigure;
//import com.umeng.soexample.invokenative.RNUMConfigure;
//import com.umeng.socialize.PlatformConfig;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());

          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
      //初始化组件化基础库, 所有友盟业务SDK都必须调用此初始化接口。
    //建议在宿主App的Application.onCreate函数中调用基础组件库初始化函数。
//      RNUMConfigure.init(this, "5e4282db65b5ec273b5ae8e0", "Umeng", UMConfigure.DEVICE_TYPE_PHONE, "");
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

//    {
//        PlatformConfig.setWeixin("wxdc1e388c3822c80b", "3baf1193c85774b3fd9d18447d76cab0");
//        PlatformConfig.setQQZone("101844964", "Key：ccd8370e6af58b1503be27649b71d46a");
//        PlatformConfig.setSinaWeibo("3293143520", "95db68fe9147e135097db6a70a86a8c6", "http://www.jianshu.com/u/023338566ca5");
//    }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
