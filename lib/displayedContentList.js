
"use strict";

DisplayedContentList = ContentList.extend({

  initialize: function(DOM){
    /*
     * Parent constructor
     */
    this.createDOMandList(DOM);

    this.dateUpdaterHandle = null;

  },
  addPackeryHandle : function(packeryHandle)
  {
    console.log("[DisplayedContentList] We have a packery handle")
    this.packeryHandle = packeryHandle;
  },  
  getPackeryHandle : function()
  {
    return this.packeryHandle;
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
      else if(element.prop("tagName").toLowerCase() === 'video')
         $(element).addClass('video-display-visible');
      else if(element.prop("tagName").toLowerCase() === 'img')
        $(element).addClass('img-display-visible');

      setTimeout((function(){
        this.packeryHandle.packery('shiftLayout',contentView.getDOM());
        $('video').each(function () {
          this.play();
        });
      }).bind(this), 1000);

    }).bind(this));

    for (var i in this.contentViews) {
      var contentView = this.contentViews[i];
      if ($(contentView.DOM).offset().top > $(window).height() + 200) {
        this.parentRemoveById(contentView.getId());
      }
    }
  },
  getDOMList: function()
  {
    this.contentViews.sort(function(a,b){

      if(a.pinned === true)
        return -1;
      if(b.pinned === true)
        return 1; 
      
      return b.getModeratedDate().getTime() - a.getModeratedDate().getTime();
    });

      // console.log(this.contentViews.length);

    // this.contentViews.forEach((function(element){
    //   console.log(element.pinned);
    // }).bind(this));       

    return this.parentGetDOMList();
  },
  updateContent: function(data)
  {
    var content = this.parentUpdate(data);

    $('video').each(function () {
      this.play();
    });

    return content;  
  }
});
 
