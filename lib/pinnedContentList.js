
"use strict";

PinnedContentList = ContentList.extend({

  initialize: function(DOM){
    /*
     * Parent constructor
     */
    this.createDOMandList(DOM);

    this.dateUpdaterHandle = null;

    this.packeryContainer = DOM;
  },
  addPackeryHandle : function(packeryHandle)
  {
  	// console.log("[PinnedContentList] We have a packery handle")
	this.packeryHandle = packeryHandle;
  },
  addContent: function(contentView)
  {
    this.parentAddContent(contentView);
 
    /*
     * Set our custom load callback
     */
    contentView.setLoadCallback((function(element){

      if(element === null)
      {
        contentView.DOM.find("img").addClass('img-display-visible');
        contentView.DOM.find("video").addClass('video-display-visible');
      }
      else if(element.prop("tagName") === 'video')
         $(element).addClass('video-display-visible');
      else if(element.prop("tagName") === 'img')
        $(element).addClass('img-display-visible');

      this.packeryHandle.packery('shiftLayout',element);

    }).bind(this));  

  	console.log("[PinnedContentList] Addcontent with id "+contentView.getId()+" to pinned list")    
  	// console.log(contentView.getDOM().html())

	contentView.getDOM().addClass('pinned-visible');

    this.packeryHandle.prepend(contentView.getDOM()).packery('prepended',contentView.getDOM());

    window.setTimeout((function(){
    	this.packeryHandle.packery('stamp',contentView.getDOM());
      $('video').each(function () {
        this.play();
      });
    }).bind(this),3000);
  },
  updateContent: function(data)
  {
    var content = this.parentUpdate(data);

    if(content !== null)
    	this.packeryHandle.packery('shiftLayout',content.getDOM());

    $('video').each(function () {
      this.play();
    });
  },
  removeById: function(id)
  {
    var elem = this.getById(id);

    if(elem===null)
      return;

    elem.getDOM().remove();

    this.parentRemoveById(id);

    this.packeryHandle.packery('layout');
  }    
});
 
