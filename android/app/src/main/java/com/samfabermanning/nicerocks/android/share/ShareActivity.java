package com.samfabermanning.nicerocks.android.share;

import android.graphics.Color;
import android.os.Bundle;
// import ReactActivity
import com.facebook.react.ReactActivity;


public class ShareActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
      // this is the name AppRegistry will use to launch the Share View
        return "share";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      getWindow().getDecorView().setBackgroundColor(Color.WHITE);
    }
}