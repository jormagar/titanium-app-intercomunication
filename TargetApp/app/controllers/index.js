/**
 * Index controller
 * @method controller
 * @param  {object}   args
 */
(function controller(args) {
  'use strict';

  let backActivity;

  /**
   * Add event handlers
   * @method addListener
   */
  (function addListener() {
    Ti.Android.currentActivity.addEventListener('newintent', onNewIntent);

    $.addListener($.back, 'click', backToSourceApp);
    //$.addListener($.index, 'androidback', onAndroidBack);
  })();

  /**
   * Initialize controller
   * @method initController
   */
  (function initController() {
    $.index.open();
  })();

  /**
   * On new intent
   * @method  onNewIntent
   * @param   {object}    e
   */
  function onNewIntent(e) {
    alert('On new intent , message from source: ' + e.source.getIntent().getStringExtra('name'));
    backActivity = e.source;
  }

  /**
   * Set result and back to source app
   * @method backToSourceApp
   * @param  {object}        e
   */
  function backToSourceApp(e) {
    //Uncomment to get window activity, backActivity
    //has the activity incoming in the newintent
    backActivity = $.index.activity;
    if (backActivity) {
      const backIntent = Ti.Android.createIntent({
        action: Titanium.Android.ACTION_SEND,
        type: "text/plain"
      });
      backIntent.putExtra('response', 'Back intent from Target App');
      backActivity.setResult(Ti.Android.RESULT_OK, backIntent);
      backActivity.finish();
    }
  }

  /**
   * Capture if android back button pressed. If invoked by intent
   * and the user press back button splash screen is shown.
   * In that case  we need to close it.
   * @method  onAndroidBack
   * @param   {[type]}      e [description]
   * @returns {[type]}
   */
  /*function onAndroidBack(e) {
    $.index.close();
  }*/

})(arguments[0] || {});
