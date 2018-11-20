/**
 * Represents a social wall client
 */
"use strict";

var ROTATE_INTERVAL = 10000;

SocialWallClient = Class.extend({

  _getQueryParams : function(qs) { 

    qs = qs.split("+").join(" ");

    var params = {};
    var tokens;
    var re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs))
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);

    return params;
  }, 
  openCallback : function(clientConnection) {
    /*
     * As soon as openen, send parameters
     */
    try
    {
      var data = {
        eventId: this.event, 
        secret: this.eventSecret
      };

      if(this.wallid !== null)
        data.wallid = this.wallid;

      clientConnection.send(JSON.stringify({
        type: 'hello',
        data: data
      }));
    }
    catch(e)
    {
      console.log("[socialWallClient][openCallback][ERROR]",e);
    }
  },
  setDisplayParameters : function(displayParameters) {
    var keysAction = {
      'columns': [{
        elem:'.item',
        prop:'width',
        trans:function(v)
        {
          return (100 / parseInt(v))+'%';
        }
      }],
      'backgroundImage':[{
        elem:'body',
        prop:'backgroundImage',
        trans:function(v)
        {
          return 'url("'+v+'")';
        }
      }],
      'font':[{
        elem: '.item, #banner',
        prop: 'fontFamily',
        trans:function(v)
        {
          return "'" + v.replace(/\+/g,' ') + "', sans-serif";
        }
      }],
      'fontSize':[{
        elem:'.item',
        prop:'fontSize',
        trans:function(v){
          return v+'em';
        }
      },{
        elem:'#banner ul.sources',
        prop:'fontSize',
        trans:function(v){
          return v+'em';
        }
      },{
        elem:'#banner h1',
        prop:'fontSize',
        trans:function(v){
          return (v*1.5)+'em';
        }
      },{
        elem: '#banner .description',
        prop: 'fontSize',
        trans:function(v){
          return (v*0.75)+'em'
        }
      },{
        elem: '.item header .author .author_photo',
        prop: 'width',
        trans:function(v){
          return (48 + 50 * (v - 1) / 4)+'px'
        }
      },{
        elem: '.item header .author .author_photo',
        prop: 'height',
        trans:function(v){
          return (48 + 50 * (v - 1) / 4)+'px'
        }
      }],
      'borderSize':[{
        elem:'.item .content-inner',
        prop:'borderWidth',
        trans:function(v)
        {
          return v+'px';
        }            
      },{
        elem:'#banner #banner-inner',
        prop:'borderWidth',
        trans:function(v)
        {
          return v+'px';
        }            
      }], 
      'colors':{
        'text':[{
          elem:'.item, .item header',
          prop:'color'
        }],
        'background':[{
          elem:'body',
          prop:'backgroundColor'
          },{
          elem:'#selected',
          prop:'backgroundColor'
          },{
          elem:'.item .pinned',
          prop:'color'
          }],
        'border':[{
          elem:'.item .content-inner',
          prop:'borderColor'
        },{
          elem:'#banner #banner-inner',
          prop:'borderColor'
        }],        
        'content':[{
          elem:'.item .content-inner',
          prop:'backgroundColor'
        }],
        'titleBackground':[{
          elem:'#banner #banner-inner',
          prop:'backgroundColor'
        }],
        'titleText':[{
          elem:'#banner #banner-inner',
          prop:'color'
        }]
      },
      'spacing':[{
          elem:'.item',
          prop:'padding',
          trans:function(v){
            return v/2+'px';
          }
        },{
          elem:'#banner',
          prop:'margin',
          trans:function(v){
            return v/2+'px';
          }
        },{
          elem:'body',
          prop:'padding',
          trans:function(v){
            return v/2+'px';
          }          
        }
      ],
      'simpleDisplay': [{
        elem: '.author time',
        prop: 'display',
        trans: function(v){
          return (!v)?'block':'none'
        }
      }, {
        elem: '.item header .author .author_photo',
        prop: 'width',
        trans: function(v){
          return (!v)?'48px':'24px';
        }
      }, {
        elem: '.item header .author .author_photo',
        prop: 'height',
        trans: function(v){
          return (!v)?'48px':'24px';
        }
      }, {
        elem: '.item header .author .author_photo',
        prop: 'font-size',
        trans: function(v){
          return (!v)?'40px':'20px';
        }
      },{ 
        elem: '.item header .author .author_photo',
        prop: 'font-size',
        trans: function(v){
          return (!v)?'40px':'20px';
        }
      }, { 
        elem: '.item header .source',
        prop: 'font-size',
        trans: function(v){
          return (!v)?'32px':'20px';
        }
      }, { 
        elem: '.item header .source, .item header .author .author_photo',
        prop: 'line-height',
        trans: function(v){
          return (!v)?'48px':'24px !important';
        }
      }, {
        elem: '.item .article-content',
        prop: 'border-top',
        trans: function(v){
          return (!v)?'1px solid #FFF':'none';
        }
      }]
    };

    var setStyle = function(prefix,array){

      for(var i in array)
      {
        if(typeof(array[i]) == 'object' && array[i] !== null)
        {
          setStyle(prefix.concat([i]),array[i]);
        }
        else
        {
          var keysIndex = keysAction;
          var value = array[i];

          for(var j=0;j<prefix.length;j++)
            keysIndex = keysIndex[prefix[j]];

          var params = keysIndex[i];


          for(var i in params)
          {
            var valueTrans = value;
            if(params[i].hasOwnProperty('trans'))
              valueTrans = params[i].trans(value);

            if(params[i].hasOwnProperty('prop')){
              var prop = {};

              prop[params[i].prop] = valueTrans;

              jss.set(params[i].elem, prop);
            } 
          }
        }
      }
    }

    jss.remove();

    if (!this.loadedFonts[displayParameters.font]) {
      var fontLoader = $('<link>').attr('href', 
        'http://fonts.googleapis.com/css?family=' 
        + displayParameters.font.replace(/ /g, '+')
        + ':400,700')
        .attr('rel', 'stylesheet');
      $('body').append(fontLoader);
      this.loadedFonts[displayParameters.font] = fontLoader;
    }

    setStyle([],displayParameters);

    if(this.isIframe)
    {
      jss.set(".item",{'width':'100%'});
      jss.set("body",{'overflow-y':'scroll'});
    } else {
      jss.set('body',{'cursor':'none'});
    }

  },
  updateSelectedList : function(contentView) {

    /*
     * Copy contents in the right lists following the new content
     */
    if(contentView.valid === false)
    {
      // console.log("[socialWallClient] Removing element from selected list");                                    

      this.selectedContentList.parentRemoveById(contentView.getId());
    } 
    else
    {   
      if(contentView.selected === true)
      {
        if(this.selectedContentList.getById(contentView.getId()) === null)
        {
          var newContent = contentView.clone();

          console.log("[socialWallClient] Cloning element with id "+contentView.getId());
          this.selectedContentList.addContent(newContent);
        }
      }
      else
      {
        console.log("[socialWallClient] Removing element from selectedContentList");
        this.selectedContentList.parentRemoveById(contentView.getId());
      }
    }

    if(this.selectedContentList.contentViews.length > 0)
    {
      this.selectedContentList.selectedContainer.css({opacity:'1'}).css({'height':'100%'});    
    }
    else
    {
      this.selectedContentList.selectedContainer.css({opacity:'0'}).css({'height':'0'});    
    }
  },
  messageCallback : function(clientConnection,parsedMessage) {

    switch(parsedMessage.type)
    {
      case 'hello': 

        if(parsedMessage.data.hasOwnProperty('wallid'))
          this.wallid = data.wallid;

        var event = parsedMessage.data.event;

        this.banner = new BannerView(event);
        $("#banner").replaceWith(this.banner.getDOM());
        twemoji.parse($("#banner").get(0));

        this.setDisplayParameters(event.displayParameters);

        if (event.displayParameters.rotateContent && !this.rotateInterval) {
          this.rotateAt = 0;
          this.rotateInterval = setInterval(this.rotateContent.bind(this), ROTATE_INTERVAL);
        }

        var externalSheet = $('<link>').attr('rel', 'stylesheet').attr('href', 'http://' + this.host + ':' + this.port + '/css/events/' + this.event + '.css');
        $('body').append(externalSheet);

        var data = {
          event: this.event, 
          secret: this.eventSecret,
          wallid: this.wallid
        };

        clientConnection.send(JSON.stringify({
          type: 'requestContent',
          data: data
        }));
      break;
      case 'modifiedContent':

        var contentsData = parsedMessage.data;

        contentsData.forEach((function(contentData){

          console.log("[socialWallClient] Element with id "+contentData.id+" modified");

          var content = this.displayedContentList.updateContent(contentData);
          this.selectedContentList.updateContent(contentData);

          console.log("[socialWallClient] List length (displayed/selected) "+this.displayedContentList.contentViews.length+"/"+this.selectedContentList.contentViews.length);

          this.updateSelectedList(content);

          console.log("[socialWallClient] List length (displayed/selected) "+this.displayedContentList.contentViews.length+"/"+this.selectedContentList.contentViews.length);          

          if (this.allContents[contentData.id])
            this.allContents[contentData.id] = contentData;

        }).bind(this));

      break;
      case 'modifiedEvent':
          
          var event = parsedMessage.data;

          this.banner.update(event);

          this.setDisplayParameters(event.displayParameters);

          this.packeryHandle.packery('layout');

      break;
      case 'newContent':

        var contentsData = parsedMessage.data;   
        // console.log(contentsData);

        /*
         * Transform raw data into contentView instances and sort them
         */
        var contentViews = [];

        contentsData.forEach(function(content){
          contentViews.push(new ContentView(content));
          this.allContents[content.id] = content;
          this.contentIds.push(content.id);
        }.bind(this));

        /*
         * Append them to packetry
         */
        contentViews.forEach((function(view){
        
          var contentId = view.getId();
          var ret = this.displayedContentList.findContentById(contentId);

          if(ret !== null)
          {
            // console.log("[socialWallClient] Element with id "+ret.id+" already visible, updating");

            var content = this.displayedContentList.updateContent(view.getData());
            this.selectedContentList.updateContent(view.getData());

            this.updateSelectedList(content);

            return;
          }

          // console.log("[socialWallClient] Adding element with id "+contentId);

          this.displayedContentList.addContent(view);

          this.updateSelectedList(view);

        }).bind(this));
      break;
      case 'deletedContent':

        var contents = parsedMessage.data;      

        contents.forEach((function(id){

          var content = this.displayedContentList.updateContent({id:id,valid:false});
          this.selectedContentList.updateContent({id:id,valid:false});

          if(content !== null)
            this.updateSelectedList(content);

          if (this.allContents[content.id]) {
            delete this.allContents[content.id];
            var i = this.contentIds.indexOf(content.id);
            if (i !== -1) {
              this.contentIds.splice(i, 1);
            }
          }

        }).bind(this))
         
      break;
    }

    switch(parsedMessage.type)
    {
      case 'newContent':
      case 'modifiedEvent':
      case 'modifiedContent':
      case 'deletedContent':

        this.packeryContainer.html('');
        this.packeryContainer.append(this.displayedContentList.getDOMList());

        this.packeryHandle.packery('reloadItems');
        this.packeryContainer.packery();

        this.selectedContainer.html('');
        this.selectedContainer.append(this.selectedContentList.getDOMList());      

      break;
      default:
      break;
    }
  },
  deleteContent : function(deleteArray) {

    console.log("[socialWallClient] Cleaning ",deleteArray);      

    for(var index in deleteArray)
    {
      var ret = this.findContentById(deleteArray[index]);

      if(ret !== null)
        ret.elem.update({valid:false});
    }
  }, 
  initialize : function() {

    this.allContents = {};
    this.contentIds = [];

    /*
     * Register templates for further rendering
     */
    for(var name in renderJsTemplates)
      $.templates(name,renderJsTemplates[name])

    var queryElements = this._getQueryParams(document.location.search);

    this.host = queryElements.host;
    this.port = queryElements.port;
    this.event = queryElements.event;
    this.eventSecret = queryElements.eventSecret;

    this.loadedFonts = {};

    this.isIframe = queryElements.iframe === 'true' || parseInt(queryElements.iframe) === 1 ? true : false;

    if(this.isIframe)
    {
      jss.set(".item",{'width':'100%'});
      jss.set("body",{'overflow-y':'scroll'});
    }
 
    this.packeryContainer = $('#grid');

    this.packeryHandle = this.packeryContainer.packery({
      itemSelector: '.item',
      percentPosition: true
    });

    this.selectedContainer = $('#selected');

    this.displayedContentList = new DisplayedContentList($('#grid'));

    /*
     * In iframe mode, selectedContentList is disabled
     */
    this.selectedContentList = new SelectedContentList($('#selected'),this.isIframe);

    this.displayedContentList.addPackeryHandle(this.packeryHandle);

    console.log("[socialWallClient] Init with: " + this.host + "," + this.port + "," + this.event);

    this.wallid = null;

    /* 
     * Open the websocket connection. 
     *
     * Everything we need to know to connect to the server (ip,port,event,secret) is taken from url
     */
    if(!this.isIframe)
    {
      this.clientConnection  = new WebsocketConnection(

        this.host,
        this.port,
        this.event, // Unused
        /*
        * Callbacks. Callbacks are bound to their respective class instance
        */ 
        {  
          open : this.openCallback.bind(this),
          close: function(){},
          message : this.messageCallback.bind(this)
        }, 
        /*
        * Options
        */
        {
          autoConnect:true,
          autoReconnect:true
        }
      );
    }
    else
    {
      this.clientConnection  = new AjaxConnection(

        this.host,
        this.port,
        this.event, // Mendatory
        { 
          open : this.openCallback.bind(this),
          close: function(){},
          message : this.messageCallback.bind(this)
        },
        {
          refreshIntervalEvent:60,
          refreshIntervalContent:15
        }
      );
    }
  },
  rotateContent: function() {
    if (this.contentIds.length < 10)
      return;

    var randomId = this.contentIds[this.rotateAt++];
    var content = this.allContents[randomId];
    if (this.rotateAt >= this.contentIds.length) {
      this.rotateAt = 0;
    }

    var view = new ContentView(content, true);

    /*
     * Append them to packetry
     */
    var contentId = view.getId();
    var ret = this.displayedContentList.findContentById(contentId);

    // console.log("[socialWallClient] Adding element with id "+contentId);

    this.displayedContentList.addContent(view);

    this.updateSelectedList(view);

    this.packeryContainer.html('');
    this.packeryContainer.append(this.displayedContentList.getDOMList());

    this.packeryHandle.packery('reloadItems');
    this.packeryContainer.packery();

    this.selectedContainer.html('');
    this.selectedContainer.append(this.selectedContentList.getDOMList());
  }
});

/*
 * As soon as the document is ready, launch the wall.
 */

$(document).ready((function(){

  this.s = new SocialWallClient();

}).bind(this));