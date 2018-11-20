/**
 * Represents a displaye content
 */
"use strict";

ContentView = Class.extend({

  _updateData: function(key,newData)
  {
    if(newData.hasOwnProperty(key))
    {
      this.data[key] = newData[key];
      return true;
    }
    return false;
  },
  loadCallback:function(element){

    this.nbMediaToLoad--;

    this.additionnalLoadCallback(element);
  },
  setDataViewProperties: function(newData)
  {
    if(this._updateData('valid',newData))
      this.valid = this.data.valid;

    if(this._updateData('selected',newData))
      this.selected = this.data.selected;

    this._updateData('pinned',newData);
      this.pinned = this.data.pinned;
      
    this._updateData('id',newData);
    this._updateData('source',newData);
    this._updateData('text',newData);
    this._updateData('author',newData);
    this._updateData('media',newData);

    if(this._updateData('date',newData))
    {
      this.date = new Date(this.data.date);
      this.moment = moment(this.date);
      this.createdDate = new Date(this.date);

      this.data.stringDate = this.moment.fromNow();
    }

    if(this._updateData('moderatedDate',newData))
      this.moderatedDate = new Date(this.data.moderatedDate);

  },
  initialize: function(newData, reheat) { 

    this.valid = false;
    this.selected = false;
    this.pinned = false;
    this.data = {};
    if (reheat)
      this.reheatDate = new Date();

    this.additionnalLoadCallback = function(){}

    this.setDataViewProperties(newData);

    // console.log(this.data)
    // 
    this.data.text = $('<textarea />').html(this.data.text).text();

    this.DOM = $($.templates.genericContent(this.data));


    /*
     * Set loaded callbacks for all media
     */
    this.nbMediaToLoad = this.DOM.find("img,video").length;

    // console.log("nbMedia:"+this.nbMediaToLoad);

    this.DOM.find("img,video").each((function(index,value){
      $(value).on('load',(function(){
        this.loadCallback($(value));
      }).bind(this))
    }).bind(this));

  },
  clone : function()
  {
    return new ContentView(this.getData());
  },
  updateMomentFromNow : function()
  {
    this.DOM.find('time').each(function(i,element){

      var dateTime = moment($(element).attr('datetime'));

      $(element).html(dateTime.fromNow());
      
    });
  },
  update : function(newData)
  {
    this.setDataViewProperties(newData);

    console.log("[contentList] Updating element with id "+newData.id+" pinned: "+this.data.pinned);

    this.DOM = $($.templates.genericContent(this.data));
    /*
     * Set loaded callbacks for all media
     */
    this.nbMediaToLoad = this.DOM.find("img,video").length;

    this.DOM.find("img,video").each((function(index,value){
      $(value).on('load',(function(){
        console.log("onload");
        this.loadCallback($(value));
      }).bind(this))
    }).bind(this));
  },
  setLoadCallback: function(funct)
  {
    this.additionnalLoadCallback = funct;

      // console.log("setLoadCallback!")

    if(this.nbMediaToLoad === 0)
    {
      // console.log("loaded!")

      funct(null)
    }
  },
  getCreatedDate: function()
  {
    return this.createdDate;
  },
  getModeratedDate: function()
  {
    // console.log(this.moderatedDate);
    if (this.reheatDate) {
      return this.reheatDate;
    }
    else
  	 return this.moderatedDate; 
  },
  getDOM: function()
  {
    return this.DOM;
  },
  getId: function()
  {
    return this.data.id;
  },
  getData: function()
  {
    return this.data;
  }
})

 
