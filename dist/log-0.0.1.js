(function() {
  log = window.log || {}; 
  log.appender = log.appender || {};
  
  log.appender.alertAppender = function() {
    
    var self = this;
    self.args = undefined;

    return {

      init : function(args) {
        self.args = args;
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
}());
(function() {
  log = window.log || {}; 
  log.appender = log.appender || {};
  
  log.appender.consoleAppender = function() {
    
    var self = this;
    self.args = undefined;

    return {

      init : function(args) {
        self.args = args;
      },

      info : function(text) {
        console.info(text);
      },

      warn : function(text) {
        console.warn(text);
      },

      error : function(text) {
        console.error(text);
      },

      debug : function(text) {
        console.debug(text);
      }
    };
  }();
}());
(function() {
  log = window.log || {};
  log.appender = log.appender || {};
  
  log.appender.serviceAppender = function() {
    
    var self = this;
    self.args = undefined;

    var send = function(text) {
      var jqxhr = $.post(self.args.url, { log_text : text })
        .done(function(data) {
          console.log(data);
        })
        .fail(function(xhr, textStatus, errorThrown) {
          console.log("Request to " + self.args.url + " failed. Error: " + xhr.responseText);
        })
        .always(function() {
      });
    };

    return {

      init : function(args) {
        self.args = args;
      },

      info : function(text) {
        send(text);
      },

      warn : function(text) {
        send(text);
      },

      error : function(text) {
        send(text);
      },

      debug : function(text) {
        send(text);
      }
    };
  }();
}());
(function() {
  log = window.log || {};
  log.appender = log.appender || {};
  
  log.appender.toastrAppender = function() {
    
    var self = this;
    self.args = undefined;

    var loadResource = function(type, url) {
      var head = document.getElementsByTagName("head")[0];

      var element = document.createElement(type);

      if(type === "script") {
        element.src = url;
        element.type = "text/javascript";
      }
      if(type === "link") {
        element.href = url;
        element.type = "text/css";
        element.rel = "stylesheet";
      }

      head.appendChild(element);
    };

    return {

      init : function(args, callback) {
        self.args = args;

        loadResource("link", "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/css/toastr.min.css");

        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/js/toastr.min.js", function() {
          toastr.options = self.args;
          log.common.executeCallback(callback);
        });
      },

      info : function(text) {
        toastr.info(text);
      },

      warn : function(text) {
        toastr.warning(text);
      },

      error : function(text) {
        toastr.error(text);
      },

      debug : function(text) {
        toastr.info(text);
      }
    };
  }();
}());
(function() {
  log = window.log || {};
  
  log.common = function() {
    
    var self = this;

    var executeFunctionByName = function(callback, context/*, args*/) {
      var args = null;
      if (arguments.length == 3) args = arguments[2];
      var namespaces = callback.split(".");
      var func = namespaces.pop();
      for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
      }
      var params = [];
      params.push(args);
      return context[func].apply(context, params);
    };

    return {

      executeCallback : function(callback) {
        var args = null;
        if (arguments.length == 2) args = arguments[1];
        if(typeof(callback) == 'function') {
            var params = [];
            params.push(args);
            callback.apply(this, params);
        } else {
            if (typeof callback !== "undefined" && callback.length > 0)
            executeFunctionByName(callback, window, args);
        }
      },

      loadResource : function(type, url) {
        var head = document.getElementsByTagName("head")[0];

        var element = document.createElement(type);

        if(type === "script") {
          element.src = url;
          element.type = "text/javascript";
        }
        if(type === "link") {
          element.href = url;
          element.type = "text/css";
          element.rel = "stylesheet";
        }

        head.appendChild(element);
      }
    };
  }();
}());
(function () {
  log = window.log || {};
  
  log = function() {
    var self = this;
    self.appender = log.appender || {};
    self.common = log.common || {};
    self.format = "[{date}][{level}] {text}";

    self.currentAppender = undefined;

    var formatText = function(text, level) {
      var date = new Date().toLocaleString();

      var formattedText = log.format;

      //format object as json to make it readable
      if(typeof text !== "string") {
        text = "\n\r" + JSON.stringify(text, null, 2);
      }

      formattedText = formattedText.replace("{date}", date);
      formattedText = formattedText.replace("{level}", level);
      formattedText = formattedText.replace("{text}", text);
      return formattedText;
    };

    var init = function() {
      self.currentAppender = log.appender.consoleAppender;
      self.currentAppender.init();
    }();

    return {

      appender : self.appender,
      format : self.format,
      common : self.common,

      init : function(appender, args, callback) {
        self.currentAppender = appender;
        self.currentAppender.init(args, callback);
      },

      info : function(text) {
        self.currentAppender.info(formatText(text, "INFO"));
      },

      warn : function(text) {
        self.currentAppender.warn(formatText(text, "WARN"));
      },

      error : function(text) {
        self.currentAppender.error(formatText(text, "ERROR"));
      },

      debug : function(text) {
        self.currentAppender.debug(formatText(text, "DEBUG"));
      }
    };
  }();
}());

