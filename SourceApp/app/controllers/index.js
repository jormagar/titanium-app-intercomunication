/**
 * Index controller
 * @method controller
 * @param  {object}   args
 */
(function controller(args) {
  'use strict';

  const TARGET = {
    SCHEME: 'TargetApp://jormagar/',
    CLASS_NAME: 'es.jormagar.target.TargetappActivity',
    PACKAGE_NAME: 'es.jormagar.target'
  };

  const ActionManager = require('ActionManager');

  ActionManager.addDependency('PackageManager', new (require('PackageManager'))());

  ActionManager.addAction('startActivity', 'PackageManager', 'open');
  ActionManager.addAction('startActivityForResult', 'PackageManager', 'openForResult');
  ActionManager.addAction('startAppByScheme', 'PackageManager', 'openURLScheme');
  ActionManager.addAction('updateMe', 'PackageManager', 'install');
  ActionManager.addAction('uninstallMe', 'PackageManager', 'uninstall');
  ActionManager.addAction('installTargetApp', 'PackageManager', 'install');
  ActionManager.addAction('uninstallTargetApp', 'PackageManager', 'uninstall');

  /**
   * Add event handlers
   * @method addListener
   */
  (function addListener() {
    $.addListener($.actions, 'itemclick', onActionClick);
  })();

  /**
   * @method initController
   */
  (function initController() {
    $.index.open();
  })();

  /**
   * It handles button click event
   * @method onActionClick
   * @param  {object}      e
   */
  function onActionClick(e) {
    const action = e.section.getItemAt(e.itemIndex).action.name;
    ActionManager.execute(action, getActionParams(action));
  }

  function getActionParams(action) {
    let params = [];

    if(action === 'startActivity'){
      let intent = Ti.Android.createIntent({
        className: TARGET.CLASS_NAME,
        packageName: TARGET.PACKAGE_NAME
      });

      intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
      params.push(intent);
      params.push(Ti.Android.currentActivity);
    }

    return params;
  }

  /**
   * Launch simple intent
   * @method startActivity
   */
  function startActivity() {
    //No action provided: DEFAULT_ACTION -> ACTION_VIEW
    const intent = Ti.Android.createIntent({
      className: TARGET.CLASS_NAME,
      packageName: TARGET.PACKAGE_NAME
    });

    intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

    Ti.Android.currentActivity.startActivity(intent);
  };

  /**
   * Launch simple intent
   * @method startActivity
   */
  function startActivityForResult() {
    const intent = Ti.Android.createIntent({
      className: TARGET.CLASS_NAME,
      packageName: TARGET.PACKAGE_NAME
    });

    //This flag indicates we are waiting for a result
    intent.flags |= Ti.Android.FLAG_ACTIVITY_FORDWARD_RESULT;

    intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

    Ti.Android.currentActivity.startActivityForResult(intent, onActivityResult);
  }

  /**
   * Launch simple intent
   * @method startActivityByScheme
   */
  function startActivityByScheme() {
    //No action provided: DEFAULT_ACTION -> ACTION_VIEW
    Ti.Platform.openURL(TARGET.SCHEME + 'view');
  };

  /**
   * Launch simple intent
   * @method startActivityBySchemeForResult
   */
  function startActivityBySchemeForResult() {
    Ti.Platform.openURL(TARGET.SCHEME + 'view');
  }

  /**
   * Callback on activity result
   * @method onActivityResult
   * @param  {object}         e
   */
  function onActivityResult(e) {
    let msg;

    if (e.resultCode === Ti.Android.RESULT_OK) {
      msg = 'Success with data: ' + e.intent.getStringExtra('response');
    } else {
      msg = 'Fail with code: ' + e.resultCode;
    }

    Ti.UI.createAlertDialog({
      title: 'Result:',
      message: msg,
      ok: 'Ok'
    }).show();
  }

})(arguments[0] || {});
