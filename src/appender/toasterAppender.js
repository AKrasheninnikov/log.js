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

      init : function(args) {
        self.args = args;

        loadResource("script", "http://code.jquery.com/jquery-1.10.2.min.js");
        loadResource("script", "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/js/toastr.js");
        loadResource("link", "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/css/toastr.css");

        //toastr.options = self.args;
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