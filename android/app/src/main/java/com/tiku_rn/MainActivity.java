package com.tiku_rn;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
//import com.tiku_rn.module.ShareModule;
//import com.tiku_rn.module.LoginModule;
//import com.umeng.socialize.UMShareAPI;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here
    super.onCreate(savedInstanceState);
//    ShareModule.initActivity(this);
//    LoginModule.initActivity(this);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
//    UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "tiku_rn";
  }
}
