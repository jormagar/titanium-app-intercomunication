/**
 * Index controller
 * @method controller
 * @param  {object}   args
 */
(function controller(args) {
  'use strict';

  /**
   * Add event handlers
   * @method addListener
   */
  (function addListener() {
      ['startActivity', 'startActivityForResult'].forEach(function iterator(proxy) {
      $.addListener($[proxy], 'click', onIntentClick);
    });
  })();

  /**
   * It handles button click event
   * @method onIntentClick
   * @param  {object}      e
   */
  function onIntentClick(e) {
    Ti.API.info(JSON.stringify(e));
    $[e.source.id]();
  }

  /**
   * Launch simple intent
   * @method startActivity
   */
  $.startActivity = function () {
    Ti.API.info('startActivity');
    //No action provided: DEFAULT_ACTION -> ACTION_VIEW
    const intent = Ti.Android.createIntent({
      className: 'es.jormagar.target.TargetappActivity',
      packageName: 'es.jormagar.target'
    });

    intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

    Ti.Android.currentActivity.startActivity(intent);
  };

  /**
   * Launch simple intent
   * @method startActivity
   */
  $.startActivityForResult = function () {
    Ti.API.info('startActivityForResult');
    const intent = Ti.Android.createIntent({
      className: 'es.jormagar.target.TargetappActivity',
      packageName: 'es.jormagar.target'
    });

    intent.flags |= Ti.Android.FLAG_ACTIVITY_FORDWARD_RESULT;
    intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

    $.response.setText('');

    Ti.Android.currentActivity.startActivityForResult(intent, function (e) {
      if (e.resultCode === Ti.Android.RESULT_OK) {
        $.response.setText(e.intent.getStringExtra('response'));
      } else {
        $.response.setText('Fail: CODE ' + e.resultCode);
      }
    });
  }

  $.index.open();

})(arguments[0] || {});


/*function openTarget(e) {
  const intent = Ti.Android.createIntent({
    className: 'es.jormagar.target.TargetappActivity',
    packageName: 'es.jormagar.target',
    type: 'text/plain',
    action: Ti.Android.ACTION_SEND
    //action: Ti.Android.ACTION_VIEW
  });

  //intent.flags |= Ti.Android.FLAG_ACTIVITY_CLEAR_TOP | Ti.Android.FLAG_ACTIVITY_NEW_TASK;
  //intent.flags |= Ti.Android.FLAG_ACTIVITY_SINGLE_TOP | Ti.Android.FLAG_ACTIVITY_FORDWARD_RESULT;
  //intent.flags |= Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP;
  intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

  //Establecemos los flags y añadimos los datos al intent
  intent.putExtra('message', 'mensaje desde source app');

  Ti.Android.currentActivity.startActivityForResult(intent, function (e) {
    if (e.resultCode === Ti.Android.RESULT_OK) {
      //La respuesta ha sido correcta y hemos recibido datos.
      alert(e.intent.getStringExtra('message'));
    } else {
      alert('Result error');
    }
  });
}*/
