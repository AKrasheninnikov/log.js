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