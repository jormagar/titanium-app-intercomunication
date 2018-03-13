module.exports = {
  getSimpleIntent: function (packageName, activityName){
    //Action by default: DEFAULT_ACTION -> ACTION_VIEW
    return Ti.Android.createIntent({
      className: packageName + activityName,
      packageName: packageName
    });
  },
  getIntentForResult: function (){

  }
};
