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
   * Initialize controller
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

  /**
   * Prepare action params before execute
   * @method getActionParams
   * @param  {string}        action
   * @return {object} params Param list
   */
  function getActionParams(action) {
    let params,
      intent;

    switch (action) {
      case 'startActivity':
        params = [TARGET.PACKAGE_NAME, $.index.activity];
        break;

      case 'startActivityForResult':
        let extras = {
          name: 'John',
          surname: 'Doe'
        };
        params = [TARGET.PACKAGE_NAME, TARGET.CLASS_NAME, $.index.activity, extras, onActivityResult];
        break;

      case 'startAppByScheme':
        params = [TARGET.SCHEME];
        break;

      case 'updateMe':
        let path = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/apk/SourceApp.apk').nativePath;
        params = [path, $.index.activity, onActivityResult];
        break;

      case 'uninstallMe':
        params = [Ti.App.getId(), $.index.activity, onActivityResult];
        break;

      case 'installTargetApp':
        let f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/apk/TargetApp.apk');
        let ft = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'TargetApp.apk');

        ft.write(f.read());

        params = [ft.nativePath, $.index.activity, onActivityResult];
        break;

      case 'uninstallTargetApp':
        params = [TARGET.PACKAGE_NAME, $.index.activity, onActivityResult];
        break;

      default:
        params = [];
        break;
    }

    return params;
  }

})(arguments[0] || {});
