log.js
======

A JavaScript Logging Framework

[![Build Status](https://travis-ci.org/int32at/log.js.png?branch=master)](https://travis-ci.org/int32at/log.js)

###Introduction
`log.js` is a simple, easy to use and lightweight (5KB minified) logging framework for JavaScript. It includes several
appenders that you can use right away. Check out this [fiddle](http://jsfiddle.net/BF3qh/2/) to see it in action!

###Installation & Build
1.  Install node.js
2.  Switch directory to `log.js`.
3.  Install `grunt` using the `npm install -g grunt-cli` command.
4.  Install dependencies using the `npm install` command.
5.  Build it with `grunt`.

###Usage & Configuration 

Simply reference [log.js](dist) in your project and you are ready to go. Once you did this,
you can start using the `log` object like this:

```js
//displays the text as warning message as followed
//[11/10/2013 6:26:46 PM][WARN] this is a warning message
log.warn("this is a warning message");
```

The following log methods are supported:
- `log.log`: log message
- `log.info`: info message
- `log.debug`: debug message
- `log.warn`: warning message
- `log.error`: error message

*Of course `log.js` not only supports logging text (string) messages - you can also pass in objects into all methods*
*and they will be logged in easy-to-read JSON. See the follwing code:*

```js
//log the console object
log.debug(console);

//will print the following:
//[11/10/2013 8:25:13 PM][DEBUG] 
//{
//  "memory": {
//    "jsHeapSizeLimit": 793000000,
//    "usedJSHeapSize": 10000000,
//    "totalJSHeapSize": 10600000
//  },
// "_commandLineAPI": {}
//} 
```

#####Creating Customer Loggers
By default, you can use the `log` object to do all your (console) logging. But if you want, you can easily create
your own logger objects like this:

```js
//create new logger instance
var myLogger = new logger("MyLogger");

//initialize the logger with the alertAppender
myLogger.init(logger.appender.alertAppender);

//alerts 'this is a debug message'
myLogger.debug("this is a debug message");
```

####Log Levels
`log.js` also provides a method to make your logging more specific. Following levels are supported:
- **OFF**: disables all logging
- **DEBUG**: debug messages, usefull for tracing issues
- **LOG**: normal log message
- **INFO**: informational message, usefull for displaying user info
- **WARN**: warning message, something is not working correctly
- **ERROR**: argh, something went totally wrong!


For example, you only want to log methods of level **`WARN` and above**, you could use the following example:
```js
//set the log level to WARN and above
log.level("WARN");

log.info("this message will not be sent to the log");

log.warn("this one will, however.");
log.error("this one too!");
```

####Formatting

It is possible to use formatting within all log methods aswell. Example:

```js
//prints [11/10/2013 8:41:44 PM][WARN] hello world 
log.warn("hello {0}", "world")

//[11/10/2013 8:43:58 PM][WARN] hello world, this is log.js 
log.warn("hello {0}, this is {1}", "world", "log.js");
```

The default log message format is `[{date}][{level}] {text}`. You can easily configure the message format by
using the `log.format` property. The default format is:

```js
//default format [{date}][{level}] {text}
log.format = "[{date}][{level}] {text}";

//[11/10/2013 6:26:46 PM][WARN] this is a warning message
log.warn("this is a warning message");
```

But it can easily be changed like this:

```js
//set the default format
log.format = "{level} - {text}";

//WARN - this is a warning message
log.warn("this is a warning message");
```
At the moment, only `{date}` (actual locale date and time), `{level}` (log level), `{text}` (message text) are supported.

####Appenders

By default, `log.js` uses the `logger.appender.consoleAppender` which will log to the browsers console. However,
it is possible to change appenders, like this:

```js
//set the alert appender as default
log.init(logger.appender.alertAppender);

//alerts the message
//[11/10/2013 6:26:46 PM][WARN] this is a warning message
log.warn("this is a warning message");
```

Following appenders are supported out of the box by `log.js`:
- `logger.appender.consoleAppender`: logs to the browsers console.
- `logger.appender.alertAppender`: logs by using the browsers alert function.
- `logger.appender.toastrAppender`: logs by using [toastr](https://github.com/CodeSeven/toastr).
- `logger.appender.serviceAppender`: logs to a web service using POST.
- `logger.appender.spStatusAppender`: logs using SharePoint's Status messages
- `logger.appender.spNotifyAppender`: logs using SharePoint's Notification messages

#####Using the serviceAppender
The `logger.appender.serviceAppender` publishes all logged events to a web service using POST. jQuery is required for it
to work, so do not forget to reference it before initializing this `log.js` with this appender.

```js
//url parameter is required
//points to the web service
var options = {
  url : "https://dev.int32.at/log.js/examples/serviceAppender/data.php"
};

//initialize log.js
log.init(logger.appender.serviceAppender, options);

//sent message to web service
log.info("this is a sample message"); 
```

In this case, the `data.php` will save the given POST parameter (**log_text**) to logfile.txt. You find the example 
[here](/examples/serviceAppender).

#####Using the toastrAppender
Usually `log.js` does not need jQuery or any other 3rd party plugins. However, if you want to use 
`logger.appender.toastrAppender` you need to reference jQuery before initializing `log.js`, because it will load
toastr automatically when used. It will require a little different syntax to initialize `log.js` with `toastr`.

```js
var toastrOptions = {
  positionClass: "toast-top-left"
};

//with the call to init, log.js will download toastr.js and configure it using the toastrOptions
//and call the callback function when done; if you want the default toastr configuration
//pass null instead of toastrOptions
log.init(logger.appender.toastrAppender, toastrOptions, function() {
  //log.js + toastr can be used now
  
  //displays a nice toastr message
  log.error("this is an error message");
});
```

#####Using the spStatusAppender
This appender does not require jQuery or any other plugins. However, please be advised that it relies on the
SharePoint JavaScript API (SP.UI.js) and therefore, make sure that this is loaded before calling any method of the logger.
See following example:

```js

//make sure SP.js is loaded
ExecuteOrDelayUntilScriptLoaded(function() {

  //create custom sharepoint logger and initialize the status appender
  //timeout is set so the status message will be displayed for 5 seconds
  var sp = new logger("SP LOGGER");
  sp.init(logger.appender.spStatusAppender, { timeout : 5000 });
  
  sp.error("ARGH");
  
}, "sp.js");

```

The `timeout` property is not needed - the timeout of status messages will be automatically set to 3000 (3 seconds)
if you do not pass in any arguments. You will only need to set this property if you feel that the timeout is too short
or too long.

```js
sp.init(logger.appender.spStatusAppender);

//will display status message for 3 seconds
sp.error("ANOTHER ERROR");
```

#####Using the spNotifyAppender
This appender requires jQuery and as `logger.appender.spStatusAppender`, also SP.UI.js, so make sure everything is loaded 
before executing any of the logger's methods.

```js
//make sure SP.js is loaded
ExecuteOrDelayUntilScriptLoaded(function() {

  //create custom sharepoint logger and initialize the status appender
  //timeout is set so the status message will be displayed for 5 seconds
  var sp = new logger("SP LOGGER");
  sp.init(logger.appender.spNotifyAppender, { timeout : 5000 });
  
  sp.error("ARGH");
  
}, "sp.js");
```

The `timeout` property behaves the same as for `spStatusAppender` but additionally you can pass in the `colored` property
which will color your notification messages just as the status messages! Use it like this:

```js
sp.init(logger.appender.spNotifyAppender, { colored : true });

//will display a red message
sp.error("ARGH");
```

#####Creating a custom appender
If you do not find an appender that fits your needs you can simply write your own! Start with the following template:

```js
var myCustomerAppender = function() {
  
  var self = this;
  self.args = undefined;

  return {
    init : function(args) {
      self.args = args;
    },
    
    log : function(text) {
      alert(text);
    },
    
    info : function(text) {
      alert(text);
    },
    
    warn : function(text) {
      alert(text);
    },
    
    error : function(text) {
      alert(text);
    },
    
    debug : function(text) {
      alert(text);
    }
  };
}();
```

Now you just have to initialize `log.js` with your newly created appender:

```js
log.init(myCustomAppender);
log.warn("this is a warning message");
```

####Advanced Logging Scenarios
Of course, with `log.js` it is also possible to create your own logger instance, so you can use multiple loggers
across your application. This might be usefull when you want to create a logger for each level (with different appenders)
so you can log debug messages to a web service and display warning messages to the user in a neat way! Consider
the following example:

```js
//set up service appender logger
var config = { url : "https://site/service.php" };
var myWebServiceLogger = new logger("MyWebServiceLogger");
myWebServiceLogger.init(logger.appender.serviceAppender, config);

var myToastrLogger = new logger("MyToastrLogger");
myToastrLogger.init(logger.appender.toastrAppender, null, function() {

  try {
    alerrrrrt("Argh this didnt work!");
  }
  catch(err) {
    //sent the error to the web server
    myWebServiceLogger.error(err);
    
    //display a nice message to the user
    myToastrLogger.error("Something went wrong. Please try again!");
  }
  
});
```
Or with different levels:
```js
//set up alert logger
var myAlertLogger = new logger("MyAlertLogger");
myAlertLogger.init(logger.appender.alertAppender);

//set up console logger
var myConsoleLogger = new logger("MyConsoleLogger");
myConsoleLogger.init(logger.appender.consoleAppender);

//will display all logs > WARN level as alerts
myAlertLogger.level("ERROR");

//will log all logs > DEBUG level in console
myConsoleLogger.level("DEBUG");

//will be logged
myConsoleLogger.info("this is a info message");

//will not be logged
myAlertLogger.warn("will not be displayed");

//will be logged
myAlertLogger.error("will be displayed");
```
