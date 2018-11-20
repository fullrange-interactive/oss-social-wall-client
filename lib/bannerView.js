/**
 * Represents a displayed banner
 */
"use strict";

BannerView = Class.extend({

  DOM:null,
 
  initialize: function(event) { 

    this.DOM = $($.templates.banner(event));

  },
  update: function(event) {

    this.DOM.html(($($.templates.banner(event))).html());

  },
  getDOM: function()
  {
    return this.DOM;
  }  
})

 
