let backActivity;

/**
 * checkAndroidAppArguments
 * @description Comprueba si se ha invocado la aplicación desde
 * otra aplicación para tratar los datos de la invocación
 */
function checkAndroidAppArguments() {
  console.log("checkAndroidAppArguments");

  var intentData,
    intentKey,
    debug;

  intentKey = 'message';

  debug = "Alloy.Globals.activity.intent"
  //Comprobamos intent recogido en activity de alloy.js
  if (Alloy.Globals.activity.intent) {
    intentData = Alloy.Globals.activity.intent.getStringExtra(intentKey);
  }

  debug = "launchIntent";
  //Comprobamos el intent de entrada launchIntent
  if (!intentData && Ti.App.Android.launchIntent) {
    intentData = Ti.App.Android.launchIntent.getStringExtra(intentKey);
  }

  debug = "$.win activity intent";
  //Comprobamos el intent que hay en la actividad de la ventana
  if (!intentData && $.index.activity.intent) {
    intentData = $.index.activity.intent.getStringExtra(intentKey);
  }

  debug = "currentActivity intent";
  //Comprobamos el intent de la actividad actual
  if (!intentData && Ti.Android.currentActivity.intent) {
    intentData = Ti.Android.currentActivity.getIntent().getStringExtra(intentKey);
  }

  if (intentData) {
    alert("Intent Data from: " + debug);
    Ti.API.info('Intent data message: ' + intentData);
		const backIntent = Ti.Android.createIntent({
				//action: Titanium.Android.ACTION_VIEW,
				action: Titanium.Android.ACTION_SEND,
				type: "text/plain"
		});
		backIntent.putExtra('message', 'Back intent');
		Ti.Android.currentActivity.setResult(Ti.Android.RESULT_OK, backIntent);
		Ti.Android.currentActivity.finish();
  } else {
    debug = "Intent missed!!!";
    console.log(debug);
  }
}

Ti.Android.currentActivity.addEventListener('onIntent', function(e){
	Ti.API.info('onIntent event');
});

Ti.Android.currentActivity.addEventListener('newintent', function(e){
	Ti.API.info('newintent event');
	//Ti.API.info('On new intent , message from source: ' + e.source.getIntent().getStringExtra('message'));
  backActivity = e.source;
	/*if (e.source.getIntent().getStringExtra('message')){
		backActivity = e.source;
	}*/
});

function doClick(e) {
	if (backActivity){
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

$.addListener($.index, 'androidback', function(e){
	$.index.close();
	Alloy.Globals.activity.finish();
	/*if (backActivity){
		Alloy.Globals.activity.finish();
	} else {
		$.index.close();
	}*/
});

$.index.open();
