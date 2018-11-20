/*
 * Parent class for lists of ContentView
 */
ContentList = Class.extend({

  findContentById : function(id)
  {
    // console.log("[findContentById] Finding by id "+id+" in list of length:"+this.contentViews.length);

    var curIndex = -1;

    var elem = this.contentViews.find(function(element,index){

        if(element.getId() === id)
          curIndex = index;

        return element.getId() === id;
    });

    // console.log("[findContentById] Found? "+elem);

    if(elem)
      return {elem:elem,id:curIndex};
    else
      return null;

  },
  parentRemoveById: function(id)
  {
    // console.log("[findContentById] Removing by id "+id+" in list of length:"+this.contentViews.length);

    var ret = this.findContentById(id);

    if(ret !== null)
      return this.contentViews.splice(ret.id,1);

    return null;
  }, 
  getById: function(id)
  {
    var ret = this.findContentById(id);
    
    if(ret !== null)
      return ret.elem;

    return null;
  },
  updateDates : function()
  {
    this.contentViews.forEach(function(current,index){
      current.updateMomentFromNow();
    }); 
  },
  parentUpdate: function(data)
  {
    var ret = this.findContentById(data.id);

    if(ret === null)
    {
      // console.log("[contentList][ERROR] Element with id "+data.id+" doesn't exist");
      // console.log("[ContentList] List status:" ,this.contentViews);
      
      return null;
    }
    var content = ret.elem;

    console.log("[contentList] Updating element with id "+content.getId());

    content.update(data);
    
    return content;
  },  
  parentAddContent: function(content)
  {
    // console.log("[contentList] Adding element with id "+content.getId());

    this.contentViews.push(content);
  },
  parentGetDOMList: function()
  {
    var dom = [];

    this.contentViews.forEach((function(element){

      dom.push(element.getDOM());

    }).bind(this));    

    return dom;
  },
  createDOMandList: function(DOM){

    this.DOM = DOM;
    this.contentViews = [];

    /*
     * Set relative date update interval
     */
    this.dateUpdaterHandle = window.setInterval((function(){

      this.updateDates();

    }).bind(this),5000);  
  }
});