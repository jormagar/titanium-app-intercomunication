let backActivity;

$.addListener($.back, 'click', backToSourceApp);

Ti.Android.currentActivity.addEventListener('newintent', onNewIntent);

/**
 * On new intent
 * @method  onNewIntent
 * @param   {object}    e
 */
function onNewIntent(e) {
  Ti.API.info('On new intent , message from source: ' + e.source.getIntent().getStringExtra('message'));
  backActivity = e.source;
}

function backToSourceApp(e) {
  if (backActivity) {
    const backIntent = Ti.Android.createIntent({
      action: Titanium.Android.ACTION_SEND,
      type: "text/plain"
    });
    backIntent.putExtra('response', 'Back intent from Target App');
    backActivity.setResult(Ti.Android.RESULT_OK, backIntent);
    backActivity.finish();
    //Alloy.Globals.activity.finish();
  }
}

/*Ti.Android.addEventListener('onIntent', function(e){
	Ti.API.info('onIntent event');
});*/

$.addListener($.index, 'androidback', onAndroidBack);

/**
 * Capture if android back button pressed. If invoked by intent
 * and the user press back button splash screen is shown.
 * In that case  we need to close it.
 * @method  onAndroidBack
 * @param   {[type]}      e [description]
 * @returns {[type]}
 */
function onAndroidBack(e) {
  /*$.index.close();
  Alloy.Globals.activity.finish();*/
  /*if (backActivity){
  	Alloy.Globals.activity.finish();
  } else {
  	$.index.close();
  }*/
}

$.index.open();
