/**
 * Creates and maintains a websocket connection.
 */
"use strict";

var AjaxConnection = Class.extend({
  /**
   * Connects the websocket to the endpoint. 
   * 
   * When this function is called, we assume there is no interval running.
   */    
  firstRefresh:true,
  lastEvent:{},
  lastContents:{},
  setCallback: function(name,callback) {

      this.callbacksByType[name] = callback;
  },
  removeCallback: function(name) {

    if(this.callbacksByType.hasOwnProperty(name))
      delete this.callbacksByType[name];
  },
  initialize: function(serverHost, serverPort, eventId, callbacksByType, options) {

    /* Mendatory options */
    this.serverHost = serverHost;
    this.serverPort = serverPort;
    this.eventId = eventId;

    console.log("[AjaxConnection] Init with "+this.serverHost+","+this.serverPort+","+this.eventId);   

    this.callbacksByType = {};

    for(var callbackId in callbacksByType)
    {
      console.log("[AjaxConnection] Registering callback "+callbackId);
      this.setCallback(callbackId,callbacksByType[callbackId]);
    }
    
    /* Options with default values */
    this.refreshIntervalEvent = options.hasOwnProperty('refreshIntervalEvent') ? options.refreshIntervalEvent : 300;
    this.refreshIntervalContent = options.hasOwnProperty('refreshIntervalContent') ? options.refreshIntervalContent : 30;

    this._doRefreshEvent(true);
    this._doRefreshContents(true);

    this.checkInterval = setInterval(this._doRefreshEvent.bind(this), this.refreshIntervalEvent * 1000);
    this.checkInterval = setInterval(this._doRefreshContents.bind(this), this.refreshIntervalContent * 1000);   

  },
  _doCallback: function(name,arg) {

    if(this.callbacksByType.hasOwnProperty(name))
      this.callbacksByType[name]({send:function(){}},arg);
  },
  _onMessage: function(message) {

    message.utf8Data = message.data;

    var parsedMessage = false;

    this.lastActivity = (new Date()).getTime();

    try {
      parsedMessage = JSON.parse(message.utf8Data);

    } catch (e) {
      console.error('[AjaxConnection][ERROR] error parsing message ' + message.utf8Data);
      return;
    }

    this._doCallback('message',parsedMessage);    
  },
  _doRefreshContents: function()
  {

    $.get("http://"+this.serverHost+":"+this.serverPort+"/wall/"+this.eventId,
    {
      type:'requestContent'
    },
    (function( data ) {

      // data.data = data.data.filter(function(elem){
      //   return elem.hasOwnProperty("moderatedDate");
      // });

      if(!_.isEqual(this.lastContents,data))
      {
        console.log('[AjaxConnection][_doRefresh] Contents ');

        this.lastContents = data;

        this._doCallback('message',data);    
      }
    }).bind(this));    
  },
  _doRefreshEvent: function() 
  {

    $.get("http://"+this.serverHost+":"+this.serverPort+"/wall/"+this.eventId,
    {
      type:'hello'
    },
    (function( data ) {

      if(this.firstRefresh)
      {
        /*
         * When we get the first successfull poll for event info, send it as a hello to accomodate the protocol
         */
        this.firstRefresh = false;
        data.type = 'hello';
        this._doCallback('message',data); 
      }
      else
      {
        /*
         * Else, if modified, send it as modifiedEvent
         */
        if(!_.isEqual(this.lastEvent,data))
        {
          console.log('[AjaxConnection][_doRefresh] Event ');

          this.lastEvent = data;

          console.log(data.data)

          data.type = 'modifiedEvent';
          data.data = data.data.event;

          this._doCallback('message',data);    
        }
      }
    }).bind(this));

  },
  getConnection : function()
  {
  }
});

