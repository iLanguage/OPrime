package ca.ilanguage.oprime.content;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;
import ca.ilanguage.oprime.activity.HTML5GameActivity;
import ca.ilanguage.oprime.content.JavaScriptInterface;
import ca.ilanguage.oprime.content.OPrime;

public class ExperimentJavaScriptInterface extends JavaScriptInterface {
  private Handler mHandlerDelayStimuli = new Handler();

  private static final long serialVersionUID = -8802714328569435146L;

  public ExperimentJavaScriptInterface(boolean d, String tag, String outputDir,
      Context context, HTML5GameActivity UIParent, String assetsPrefix) {
    super(d, tag, outputDir, context, UIParent, assetsPrefix);
  }

  public void startVideoRecorderWithResult() {
    String mDateString = (String) android.text.format.DateFormat.format(
        "yyyy-MM-dd_kk_mm", new java.util.Date(System.currentTimeMillis()));
    mDateString = mDateString.replaceAll("/", "-").replaceAll(" ", "-");

    OPrimeApp app = ((HTML5GameActivity) mUIParent).getApp();
    int currentSubExperiment = ((HTML5GameActivity) mUIParent)
        .getCurrentSubex();

    String resultsFile = app.getExperiment().getParticipant().getCode()
        + "_"
        + app.getLanguage()
        + currentSubExperiment
        + "_"
        + app.getSubExperiments().get(currentSubExperiment).getTitle()
            .replaceAll(" ", "_") + "-" + mDateString;

    if (D) {
      Log.d(TAG, "Starting video/audio recording to:" + resultsFile);
    }
    this.startVideoRecorder(resultsFile);

    app.getSubExperiments().get(currentSubExperiment)
        .setResultsFileWithoutSuffix(mOutputDir +"video/"+ resultsFile);

  }

  public void launchSubExperimentJS(String subex) {
    if (D) {
      Log.d(TAG, "Launching sub experiment:" + subex);
    }
    final int currentSubExperiment = Integer.parseInt(subex);
    ((HTML5GameActivity) mUIParent).setCurrentSubex(currentSubExperiment);

    startVideoRecorderWithResult();
    /*
     * Wait two seconds so that the video activity has time to load the camera.
     * It will continue recording until you exit the video activity.
     */
    mHandlerDelayStimuli.postDelayed(new Runnable() {
      public void run() {
        // Toast.makeText(mContext,
        // "Launching subexperiment "+getCurrentSubex(),
        // Toast.LENGTH_LONG).show();
        Intent intent = new Intent(((OPrimeApp) mUIParent.getApplication())
            .getSubExperiments().get(currentSubExperiment)
            .getIntentToCallThisSubExperiment());

        intent.putExtra(
            OPrime.EXTRA_SUB_EXPERIMENT,
            ((OPrimeApp) mUIParent.getApplication()).getSubExperiments().get(
                currentSubExperiment));

        intent.putExtra(OPrime.EXTRA_LANGUAGE, ((OPrimeApp) mUIParent
            .getApplication()).getLanguage().getLanguage());

        mUIParent.startActivityForResult(intent, OPrime.EXPERIMENT_COMPLETED);

      }
    }, 2000);
  }

  public String fetchSubExperimentsArrayJS() {
    return ((OPrimeApp) mUIParent.getApplication()).getSubExperimentTitles()
        .toString();
  }

  public String fetchParticipantCodesJS() {
    return "[the,codes]";
  }

  public String fetchExperimentTitleJS() {
    return ((OPrimeApp) mUIParent.getApplication()).getExperiment().getTitle();// ((RoogleTankApp)
    // getApplication()).getLastMessage();
  }

  public void setAutoAdvanceJS(String autoadvance) {
    if (autoadvance.equals("1")) {
      ((HTML5GameActivity) mUIParent).setAutoAdvance(true);
    } else {
      ((HTML5GameActivity) mUIParent).setAutoAdvance(false);
    }

  }

}