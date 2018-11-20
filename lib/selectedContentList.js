
"use strict";

SelectedContentList = ContentList.extend({

  initialize: function(DOM,isIframe){

    this.createDOMandList(DOM);

    this.selectedContainer = DOM;
    this.isIframe = isIframe;
  },
  addContent: function(contentView)
  {
    /*
     * In iframe mode disable this functionnality
     */
    if(this.isIframe)
      return;

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
      else if(element.prop("tagName").toLowerCase() === 'video')
        $(element).addClass('video-display-visible');
      else if(element.prop("tagName").toLowerCase() === 'img')
        $(element).addClass('img-display-visible');
      
    }).bind(this));  
  },
  updateContent: function(data)
  {
    setTimeout(function () {
      $('video').each(function () {
        this.play();
      });
    }, 100);
    this.parentUpdate(data);
  },
  getDOMList: function()
  {
    return this.parentGetDOMList();
  }
}); 
