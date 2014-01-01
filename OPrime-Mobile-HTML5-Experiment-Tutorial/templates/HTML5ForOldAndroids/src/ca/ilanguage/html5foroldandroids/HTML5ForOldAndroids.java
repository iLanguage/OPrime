package ca.ilanguage.html5foroldandroids;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class HTML5ForOldAndroids extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_html5);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.html5_for_old_androids, menu);
        return true;
    }
    
}
