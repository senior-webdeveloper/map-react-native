package com.riderizedev; // <-- TODO: CHANGE THIS TO : com.riderizedev
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this
import org.devio.rn.splashscreen.SplashScreen; // here
// import com.facebook.FacebookSdk;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Riderize";
    // return "riderizemobile";
  }
  // Override onStart, onNewIntent:
  @Override
  protected void onStart() {
    super.onStart();
    RNBranchModule.initSession(getIntent().getData(), this);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    RNBranchModule.onNewIntent(intent);

  }
}
