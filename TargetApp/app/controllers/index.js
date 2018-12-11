/**
 * Index controller
 * @method controller
 * @param  {object}   args
 */
(function controller(args) {
  'use strict';

  let backActivity;

  const interval = setInterval(function () {
    Ti.API.debug(Date.now() + ' backActivity value: ' + backActivity);
  }, 250);

  /**
   * Add event handlers
   * @method addListener
   */
  (function addListener() {
    Ti.Android.currentActivity.addEventListener('newintent', onNewIntent);

    $.addListener($.index, 'close', onClose);
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
   * Close callback
   * @method  onClose
   * @param   {object} e
   */
  function onClose(e) {
    clearInterval(interval);
  }
  /**
   * On new intent
   * @method  onNewIntent
   * @param   {object}    e
   */
  function onNewIntent(e) {
    alert('On new intent , message from source: ' + e.source.intent.getStringExtra('name'));
    Ti.API.debug('INTENT ' + JSON.stringify(e.source.intent));
    Ti.API.debug('e.source: ' + e.source);
    backActivity = e.source;
  }

  /**
   * Set result and back to source app
   * @method backToSourceApp
   * @param  {object}        e
   */
  function backToSourceApp(e) {
    Ti.API.debug('backToSourceApp');
    //Uncomment to get window activity, backActivity
    //has the activity incoming in the newintent
    //backActivity = $.index.activity;
    Ti.API.debug('Back Activity: ' + backActivity);

    if (backActivity) {
      Ti.API.debug('Prepare for come back');

      const backIntent = Ti.Android.createIntent({
        action: Titanium.Android.ACTION_SEND,
        type: "text/plain"
      });

      backIntent.putExtra('response', 'Back intent from Target App');
      $.index.activity.setResult(Ti.Android.RESULT_OK, backIntent);
      $.index.activity.finish();
      //backActivity.setResult(Ti.Android.RESULT_OK, backIntent);
      //backActivity.finish();

      Ti.API.debug('Activity finished');
    }
    //$.index.close();
  }

  /**
   * Capture if android back button pressed. If invoked by intent
   * and the user press back button splash screen is shown.
   * In that case  we need to close it.
   * @method  onAndroidBack
   * @param   {[type]}      e [description]
   * @returns {[type]}
   */
  function onAndroidBack(e) {
    $.index.close();
  }

})(arguments[0] || {});
