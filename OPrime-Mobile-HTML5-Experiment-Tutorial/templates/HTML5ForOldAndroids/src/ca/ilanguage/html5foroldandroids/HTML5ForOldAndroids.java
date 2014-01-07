package ca.ilanguage.html5foroldandroids;

import ca.ilanguage.oprime.Config;
import ca.ilanguage.oprime.ui.HTML5GameActivity;
import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class HTML5ForOldAndroids extends HTML5GameActivity {

	  @Override
	  public void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);
	    this.mWebView.loadUrl(Config.getStartUrl());

	  }
}
