/**
 * Index controller
 * @method controller
 * @param  {object}   args
 */
(function controller(args) {
  'use strict';

  const TARGET = {
    SCHEME: 'TargetApp://jormagar/?some=data',
    CLASS_NAME: 'es.jormagar.target.TargetappActivity',
    PACKAGE_NAME: 'es.jormagar.target'
  };

  const ActionManager = require('ActionManager');

  //Add dependency (dependencyName, object)
  ActionManager.addDependency('PackageManager', new(require('PackageManager'))());

  //Add action (actionName, dependency, dependency function)
  ActionManager.addAction('startActivity', 'PackageManager', 'open');
  ActionManager.addAction('startActivityForResult', 'PackageManager', 'openForResult');
  ActionManager.addAction('startAppByScheme', 'PackageManager', 'openURL');
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
    let params = [],
      intent;

    if (action === 'startActivity') {
      params.push(TARGET.PACKAGE_NAME);
      params.push(Ti.Android.currentActivity);
    } else if (action === 'startActivityForResult') {
      params.push(TARGET.PACKAGE_NAME);
      params.push(Ti.Android.currentActivity);
      params.push(onActivityResult);
    } else if (action === 'startAppByScheme') {
      params.push(TARGET.SCHEME);
    } else if (action === 'updateMe') {
      params.push(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/apk/SourceApp.apk').nativePath);
      params.push(Ti.Android.currentActivity);
      params.push(onActivityResult);
    } else if (action === 'uninstallMe') {
      params.push(Ti.App.getId());
      params.push(Ti.Android.currentActivity);
      params.push(onActivityResult);
    } else if (action === 'installTargetApp'){
      var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'apk/TargetApp.apk');
      var ft = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'TargetApp.apk');
      ft.write(f.read());

      Ti.API.info(f.nativePath);
      params.push(ft.nativePath);
      params.push(Ti.Android.currentActivity);
      params.push(onActivityResult);
    } else if (action === 'uninstallTargetApp'){
      params.push(TARGET.PACKAGE_NAME);
      params.push(Ti.Android.currentActivity);
      params.push(onActivityResult);
    }

    return params;
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
