package ca.ilanguage.oprime.content;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import ca.ilanguage.oprime.activity.HTML5GameActivity;
import ca.ilanguage.oprime.content.JavaScriptInterface;
import ca.ilanguage.oprime.content.OPrime;

public class ExperimentJavaScriptInterface extends JavaScriptInterface {

  private static final long serialVersionUID = -8802714328569435146L;

  public ExperimentJavaScriptInterface(boolean d, String tag, String outputDir,
      Context context, HTML5GameActivity UIParent, String assetsPrefix) {
    super(d, tag, outputDir, context, UIParent, assetsPrefix);
  }

  @Deprecated
  public void startVideoRecorderWithResult() {
    String mDateString = (String) android.text.format.DateFormat.format(
        "yyyy-MM-dd_kk_mm", new java.util.Date(System.currentTimeMillis()));
    mDateString = mDateString.replaceAll("/", "-").replaceAll(" ", "-");

    int currentSubExperiment = ((HTML5GameActivity) mUIParent)
        .getCurrentSubex();

    String resultsFile = mUIParent.getApp().getExperiment().getParticipant()
        .getCode()
        + "_"
        + mUIParent.getApp().getLanguage()
        + currentSubExperiment
        + "_"
        + mUIParent.getApp().getSubExperiments().get(currentSubExperiment)
            .getTitle().replaceAll(" ", "_") + "-" + mDateString;

    if (D) {
      Log.d(TAG, "Starting video/audio recording to:" + resultsFile);
    }
    this.startVideoRecorder(resultsFile);

    mUIParent.getApp().getSubExperiments().get(currentSubExperiment)
        .setResultsFileWithoutSuffix(mOutputDir + "video/" + resultsFile);
  }

  public void launchSubExperimentJS(String subex) {
    if (D) {
      Log.d(TAG, "Launching sub experiment:" + subex);
    }
    final int currentSubExperiment = Integer.parseInt(subex);
    ((HTML5GameActivity) mUIParent).setCurrentSubex(currentSubExperiment);

    String mDateString = (String) android.text.format.DateFormat.format(
        "yyyy-MM-dd_kk_mm", new java.util.Date(System.currentTimeMillis()));
    mDateString = mDateString.replaceAll("/", "-").replaceAll(" ", "-");

    String resultsFile = mUIParent.getApp().getExperiment().getParticipant()
        .getCode()
        + "_"
        + mUIParent.getApp().getLanguage()
        + currentSubExperiment
        + "_"
        + mUIParent.getApp().getSubExperiments().get(currentSubExperiment)
            .getTitle().replaceAll(" ", "_") + "-" + mDateString;

    Intent intent = new Intent(mUIParent.getApp().getSubExperiments()
        .get(currentSubExperiment).getIntentToCallThisSubExperiment());

    intent.putExtra(OPrime.EXTRA_SUB_EXPERIMENT, mUIParent.getApp()
        .getSubExperiments().get(currentSubExperiment));
    intent.putExtra(OPrime.EXTRA_LANGUAGE, mUIParent.getApp().getLanguage()
        .getLanguage());
    intent.putExtra(OPrime.EXTRA_RESULT_FILENAME, mOutputDir + "video/"
        + resultsFile + ".3gp");
    mUIParent.startActivityForResult(intent, OPrime.EXPERIMENT_COMPLETED);

    mUIParent.getApp().getSubExperiments().get(currentSubExperiment)
        .setResultsFileWithoutSuffix(mOutputDir + "video/" + resultsFile);
    if (D)
      Log.d(TAG, "setResultsFileWithoutSuffix sub experiment:" + resultsFile);

  }

  public String fetchSubExperimentsArrayJS() {
    return mUIParent.getApp().getSubExperimentTitles().toString();
  }

  public String fetchParticipantCodesJS() {
    return "[the,codes]";
  }

  public String fetchExperimentTitleJS() {
    return mUIParent.getApp().getExperiment().getTitle();
  }

  public void setAutoAdvanceJS(String autoadvance) {
    if (autoadvance.equals("1")) {
      ((HTML5GameActivity) mUIParent).setAutoAdvance(true);
    } else {
      ((HTML5GameActivity) mUIParent).setAutoAdvance(false);
    }

  }

}