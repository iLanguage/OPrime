package ca.ilanguage.oprime.activity;

import java.io.File;
import java.io.IOException;

import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.DbAccessException;
import org.ektorp.ReplicationCommand;
import org.ektorp.android.util.EktorpAsyncTask;
import org.ektorp.http.HttpClient;
import org.ektorp.impl.StdCouchDbInstance;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.Toast;

import com.couchbase.touchdb.TDServer;
import com.couchbase.touchdb.ektorp.TouchDBHttpClient;
import com.couchbase.touchdb.router.TDURLStreamHandlerFactory;

public class HTML5ReplicatingActivity extends HTML5Activity {

  // constants
  protected String DATABASE_NAME = "dboprimesample";
  protected String dDocName = "oprimesample-local";
  protected String dDocId = "_design/" + dDocName;
  protected String byDateViewName = "byDate";

  protected String mLocalTouchDBFileDir = "";
  protected String mRemoteCouchDBURL = "https://cesine.iriscouch.com/oprimesample";

  // couch internals
  protected static TDServer server;
  protected static HttpClient httpClient;

  // ektorp impl
  protected CouchDbInstance dbInstance;
  protected CouchDbConnector couchDbConnector;
  protected ReplicationCommand pushReplicationCommand;
  protected ReplicationCommand pullReplicationCommand;

  int mBackPressedCount = 0;

  // static inializer to ensure that touchdb:// URLs are handled properly
  {
    TDURLStreamHandlerFactory.registerSelfIgnoreError();
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    beginReplicating();
    super.onCreate(savedInstanceState);

  }

  protected void beginReplicating() {
    mLocalTouchDBFileDir = this.getFilesDir().getAbsolutePath()
        + File.separator;
    startTouchDB();
    startEktorp();
  }

  protected void onPause() {
    if(D) Log.v(TAG, "HTML5 Replicating onPause");
    super.onPause();
  }

  protected void onDestroy() {
    if(D) Log.v(TAG, "HTML5 Replicating onDestroy");
    super.onDestroy();
  }

  @Override
  public void onBackPressed() {
    mBackPressedCount++;

    if (mBackPressedCount < 2) {
      Toast.makeText(this, "Press again to exit.", Toast.LENGTH_LONG).show();

      if (httpClient != null) {
        httpClient.shutdown();
        return;
      }

      if (server != null) {
        server.close();
        return;
      }
    }
    super.onBackPressed();
  }

  protected void startTouchDB() {
    (new File(mLocalTouchDBFileDir)).mkdirs();
    try {
      server = new TDServer(mLocalTouchDBFileDir);
    } catch (IOException e) {
      Log.e(TAG, "Error starting TDServer", e);
    }

    // install a view definition needed by the application
//    TDDatabase db = server.getDatabaseNamed(DATABASE_NAME);
//    TDView view = db.getViewNamed(String.format("%s/%s", dDocName,
//        byDateViewName));
//    view.setMapReduceBlocks(new TDViewMapBlock() {
//
//      @Override
//      public void map(Map<String, Object> document, TDViewMapEmitBlock emitter) {
//        Object createdAt = document.get("created_at");
//        if (createdAt != null) {
//          emitter.emit(createdAt.toString(), document);
//        }
//
//      }
//    }, null, "1.0");
  }

  protected void startEktorp() {
    Log.v(TAG, "starting ektorp");

    if (httpClient != null) {
      httpClient.shutdown();
    }

    httpClient = new TouchDBHttpClient(server);
    dbInstance = new StdCouchDbInstance(httpClient);

    HTML5SyncEktorpAsyncTask startupTask = new HTML5SyncEktorpAsyncTask() {

      @Override
      protected void doInBackground() {
        couchDbConnector = dbInstance.createConnector(DATABASE_NAME, true);
      }

      @Override
      protected void onSuccess() {
        Log.v(TAG, "Ektorp has started");
        mWebView.loadUrl(mInitialAppServerUrl);

        startReplications();
      }
    };
    startupTask.execute();
  }

  public void startReplications() {
    SharedPreferences prefs = PreferenceManager
        .getDefaultSharedPreferences(getBaseContext());

    pushReplicationCommand = new ReplicationCommand.Builder()
        .source(DATABASE_NAME)
        .target(prefs.getString("sync_url", mRemoteCouchDBURL))
        .continuous(true).build();

    HTML5SyncEktorpAsyncTask pushReplication = new HTML5SyncEktorpAsyncTask() {

      @Override
      protected void doInBackground() {
        dbInstance.replicate(pushReplicationCommand);
      }
    };

    pushReplication.execute();

    pullReplicationCommand = new ReplicationCommand.Builder()
        .source(prefs.getString("sync_url", mRemoteCouchDBURL))
        .target(DATABASE_NAME).continuous(true).build();

    HTML5SyncEktorpAsyncTask pullReplication = new HTML5SyncEktorpAsyncTask() {

      @Override
      protected void doInBackground() {
        dbInstance.replicate(pullReplicationCommand);
      }
    };

    pullReplication.execute();
  }

  public void stopEktorp() {
  }

  public abstract class HTML5SyncEktorpAsyncTask extends EktorpAsyncTask {

    @Override
    protected void onDbAccessException(DbAccessException dbAccessException) {
      Log.e(TAG, "DbAccessException in background", dbAccessException);
    }

  }

}
