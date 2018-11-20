var renderJsTemplates = {};

String.prototype.replaceLinks = function(){
  var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  return this.replace(urlRegex, '<a href="$1">$1</a>');
};

String.prototype.smartLinks = function(){
  var urlRegex =/www\.([^ ]+)/ig;

  return this.replace(urlRegex, '<a href="http://www.$1">www.$1</a>');
};

String.prototype.replaceHashtags = function(){

  var reg = new RegExp("([^&])#([0-9A-Za-z_\u00C0-\u01BF]+)","ig");

  return this.replace(reg,'$1<span class="hashtag">#$2</span>');
};

$.views.converters("contentFormatter", function(val) {
  console.log(twemoji.parse(val));
  return twemoji.parse(val.replaceLinks().replaceHashtags().smartLinks());
});

$.views.converters("removeHash", function(val) {
  return val.replace('#', '');
})

$.views.converters("facebookUrlFormatter", function (val) {
  return '<a href="' + val + '">' + val.replace(/(.+)facebook.com\/([^\?]+)(.*)/i, 'facebook.com/$2') + '</a>';
  // return val.replace(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/, '<a href="' + val + '" target="_blank">facebook.com/$1</a>')
  // return val.replace(/(.+)facebook.com\/(.+)(\??.+)/i, '<a href="' + val + '" target="_blank">facebook.com/$2</a>');
});

/*
 * Register templates for further rendering
 */
for(var name in renderJsTemplates)
	$.template(name,renderJsTemplates[name])
