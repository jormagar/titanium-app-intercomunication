/**
 * Helper to manage packages
 * @author Jorge Macías García
 * @copyright Universitat Politècnica de València (c) 2018
 * @module PackageManager
 */

'use strict';

module.exports = (function () {

  const ANDROID = Ti.Platform.osname === 'android';
  const IOS = Ti.Platform.osname === 'ios';
  const CONSTANTS = {
    EXTRA_RETURN_RESULT: 'android.intent.extra.RETURN_RESULT',
    PACKAGE_MIME_TYPE: 'application/vnd.android.package-archive',
    ACTION_INSTALL_PACKAGE: 'android.intent.action.INSTALL_PACKAGE',
    ACTION_UNINSTALL_PACKAGE: 'android.intent.action.UNINSTALL_PACKAGE',
    PACKAGE_SCHEME: 'package:',
    FIND_SUFFIX: ':///find'
  };
  let Android;

  if (ANDROID) {
    Android = {
      Activity: require('android.app.Activity'),
      Intent: require('android.content.Intent'),
      Uri: require('android.net.Uri'),
      PackageManager: require('android.content.pm.PackageManager')
    };
  }

  /**
   * PackageManager Constructor
   * @method      PackageManager
   * @constructor
   */
  function PackageManager() {}

  /**
   * Check if a package is installed
   * @method isPackageInstalled
   * @param   {string} packageName
   * @returns {boolean}
   */
  PackageManager.prototype.isPackageInstalled = function (packageName, activity) {
    if (ANDROID) {
      throw new Error('PackageManager.isPackageInstalled: Only available for Android platform');
    }

    if (!packageName) {
      throw new Error('PackageManager.isPackageInstalled: No package name provided, please provide valid package name');
    }

    if (!activity) {
      throw new Error('PackageManager.isPackageInstalled: No activity provided, please provide valid activity');
    }

    const pm = (new this.Android.Activity(activity)).getPackageManager();

    let isInstalled = true;

    try {
      let packageInfo = pm.getPackageInfo(packageName, Android.PackageManager.GET_ACTIVITIES);
    } catch (e) {
      Ti.API.info('PackageManager_Error: Package name <' + packageName + '> not found');
      isInstalled = false;
    }

    return isInstalled;
  };

  /**
   * Open the provided package
   * @method open
   * @param   {string} packageName
   * @returns {boolean}
   */
  PackageManager.prototype.open = function (packageName, activity) {

    if (!ANDROID) {
      throw new Error('PackageManager.open: Only available for Android platform');
    }

    if (!packageName) {
      throw new Error('PackageManager.open: No package name provided, please provide valid package name');
    }

    if (!activity) {
      throw new Error('PackageManager.open: No activity provided, please provide valid activity');
    }

    let isLaunched = false;

    const launcherActivity = (new Android.Activity(activity));
    const pm = launcherActivity.getPackageManager();
    const launchIntent = pm.getLaunchIntentForPackage(packageName);

    if (launchIntent !== null) {
      isLaunched = true;
      launcherActivity.startActivity(launchIntent);
    }

    return isLaunched;
  };

  /**
   * Open the provided package and wait for result
   * @method openForResult
   * @param   {string} packageName
   * @param {object} activity
   * @param  {function} onActivityResult
   */
  PackageManager.prototype.openForResult = function (packageName, activity, onActivityResult) {
    if (!ANDROID) {
      throw new Error('PackageManager.open: Only available for Android platform');
    }

    if (!packageName) {
      throw new Error('PackageManager.open: No package name provided, please provide valid package name');
    }

    if (!activity) {
      throw new Error('PackageManager.open: No activity provided, please provide valid activity');
    }

    if (!onActivityResult) {
      throw new Error('PackageManager.open: No onActivityResult callback provided');
    }

    const launcherActivity = (new Android.Activity(activity));
    const pm = launcherActivity.getPackageManager();
    const launchIntent = pm.getLaunchIntentForPackage(packageName);

    const intent = Ti.Android.createIntent({
      className: launchIntent.getComponent().getClassName(),
      packageName: packageName
    });

    //This flag indicates we are waiting for a result
    intent.flags |= Ti.Android.FLAG_ACTIVITY_FORDWARD_RESULT;
    intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

    activity.startActivityForResult(intent, onActivityResult);
  };

  /**
   * Open the package package with the provided url scheme
   * @method openURLScheme
   * @param   {string} uri
   * @returns {boolean}
   */
  PackageManager.prototype.openURLScheme = function (uri) {
    if (!uri) {
      throw new Error('PackageManager.openURLScheme: No uri provided');
    }
    //It returns false for Android devices if can't open url
    return Ti.Platform.openURL(uri);
  };

  /**
   * Check if URI scheme is available
   * @method canOpenScheme
   * @param   {string} scheme
   * @param   {object} activity
   * @returns {boolean}
   */
  PackageManager.prototype.canOpenURLScheme = function (scheme, activity) {
    if (ANDROID && !activity) {
      throw new Error('PackageManager.canOpenURLScheme: No activity provided, please provide valid activity');
    }

    if (!scheme) {
      throw new Error('PackageManager.canOpenURLScheme: No scheme provided');
    }

    let result;

    if (ANDROID) {
      result = this.canOpenAndroidScheme(scheme);
    } else if (IOS) {
      result = this.canOpenIOSScheme(scheme);
    }

    return result;
  };

  /**
   * Check if URI scheme is available on Android
   * @method canOpenSchemeOnAndroid
   * @param   {string} scheme
   * @param   {object} activity
   * @returns {boolean}
   */
  PackageManager.prototype.canOpenSchemeOnAndroid = function (scheme, activity) {
    const pm = (new Android.Activity(activity)).getPackageManager();
    const uri = scheme + CONSTANTS.FIND_SUFFIX;
    const intent = new Android.Intent(Android.Intent.ACTION_VIEW, Android.Uri.parse(uri));

    return pm.resolveActivity(intent, 0) !== null;
  };

  /**
   * Check if URI scheme is available on iOS
   * @method canOpenSchemeOnIOS
   * @param   {string} scheme
   * @returns {boolean}
   */
  PackageManager.prototype.canOpenSchemeOnIOS = function (scheme) {
    return Ti.Platform.canOpenURL(scheme);
  };

  /**
   * Install package
   * @method install
   * @param   {string} nativePath
   * @param   {object} activity
   * @param   {function} onActivityResult
   */
  PackageManager.prototype.install = function (nativePath, activity, onActivityResult) {
    if (!ANDROID) {
      throw new Error('PackageManager.install: Only available for Android platform');
    }

    if (!nativePath) {
      throw new Error('PackageManager.install: No native path to file provided, please provide valid path');
    }

    if (!activity) {
      throw new Error('PackageManager.uninstall: No activity provided, please provide valid activity');
    }

    //this.manage(CONSTANTS.ACTION_INSTALL_PACKAGE, packageName, activity, onActivityResult);

    const intent = Ti.Android.createIntent({
      action: CONSTANTS.ACTION_INSTALL_PACKAGE,
      data: nativePath,
      type: CONSTANTS.PACKAGE_MIME_TYPE
    });

    if (onActivityResult) {
      //If we are waiting for action result it returns this value as result code
      intent.putExtra(CONSTANTS.EXTRA_RETURN_RESULT, true);
      activity.startActivityForResult(intent, onActivityResult);
    } else {
      activity.startActivity(intent);
    }
  };

  /**
   * Uninstall package
   * @method uninstall
   * @param   {string} packageName
   * @param   {object} activity
   * @param   {function} onActivityResult
   */
  PackageManager.prototype.uninstall = function (packageName, activity, onActivityResult) {
    if (!ANDROID) {
      throw new Error('PackageManager.uninstall: Only available for Android platform');
    }

    if (!packageName) {
      throw new Error('PackageManager.uninstall: No package name provided, please provide valid package name');
    }

    if (!activity) {
      throw new Error('PackageManager.uninstall: No activity provided, please provide valid activity');
    }

    //this.manage(CONSTANTS.ACTION_UNINSTALL_PACKAGE, packageName, activity, onActivityResult);

    const intent = Ti.Android.createIntent({
      action: CONSTANTS.ACTION_UNINSTALL_PACKAGE,
      data: CONSTANTS.PACKAGE_SCHEME + packageName
    });

    if (onActivityResult) {
      //If we are waiting for action result it returns this value as result code
      intent.putExtra(CONSTANTS.EXTRA_RETURN_RESULT, true);
      activity.startActivityForResult(intent, onActivityResult);
    } else {
      activity.startActivity(intent);
    }
  };

  /**
   * Manage package
   * @method manage
   * @param   {string} action
   * @param   {string} packageName
   * @param   {object} activity
   * @param   {function} onActivityResult
   */
  PackageManager.prototype.manage = function (action, packageName, activity, onActivityResult) {
    const intent = Ti.Android.createIntent({
      action: action,
      data: CONSTANTS.PACKAGE_SCHEME + packageName
    });

    if (onActivityResult) {
      //If we are waiting for action result it returns this value as result code
      intent.putExtra(CONSTANTS.EXTRA_RETURN_RESULT, true);
      activity.startActivityForResult(intent, onActivityResult);
    } else {
      activity.startActivity(intent);
    }
  };

  return PackageManager;
})();
