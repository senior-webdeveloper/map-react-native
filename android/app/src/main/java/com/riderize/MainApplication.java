package com.riderizedev; // <-- TODO: CHANGE THIS TO : com.riderizedev
import com.brentvatne.react.ReactVideoPackage;
import com.microsoft.codepush.react.CodePush;
import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
// import com.facebook.FacebookSdk;
// import com.facebook.appevents.AppEventsLogger;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import androidx.multidex.MultiDexApplication;
import io.branch.rnbranch.RNBranchModule;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {
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
//           packages.add(new SplashScreenReactPackage());
          packages.add(new ReactVideoPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

         @Override
         protected String getJSBundleFile() {
           return CodePush.getJSBundleFile();
         }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    RNBranchModule.getAutoInstance(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
