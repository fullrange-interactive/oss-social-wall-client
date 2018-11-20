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

renderJsTemplates.facebook = ' ';

renderJsTemplates.instagram = ' ';

renderJsTemplates.twitter = ' ';

renderJsTemplates.banner = '<div id="banner">  <div id="banner-inner">    <ul class="sources">{{for sources}}      <li class="{{:type}}"><span>          {{if type == "twitter"}}          {{if text}}<a href="https://twitter.com/hashtag/{{removeHash:parameters.hashtag}}">{{:text}}</a>{{else}}<a href="https://twitter.com/hashtag/{{removeHash:parameters.hashtag}}">{{:parameters.hashtag}}</a>{{/if}}          {{else type == "facebook"}}          {{if text}}<a href="{{:parameters.url}}">{{:text}}</a>{{else}}          {{facebookUrlFormatter:parameters.url}}          {{/if}}          {{else type == "instagram"}}          {{if text}}<a href="https://instagram.com/explore/tags/{{removeHash:parameters.hashtag}}">{{:text}}</a>{{else}}<a href="https://instagram.com/explore/tags/{{removeHash:parameters.hashtag}}">{{:parameters.hashtag}}</a>{{/if}}          {{/if}}</span><i class="fa fa-fw fa-{{:type}} source-icon-{{:type}}"></i></li>{{/for}}    </ul><img src="{{:displayParameters.logo}}" onerror="this.style.display=&apos;none&apos;" class="logo"/>    <div class="title-and-description">      <h1><a href="{{:url}}">{{:name}}</a></h1>      <p class="description">{{contentFormatter:description}}</p>    </div>  </div></div>';

renderJsTemplates.genericAuthor = '<address class="author">  <div class="source">{{if source.type == "twitter"}}<i class="fa fa-twitter"></i>{{else source.type == "webapp"}}<i class="fa fa-mobile"></i>{{else source.type == "facebook"}}<i class="fa fa-facebook"></i>{{else source.type == "instagram"}}<i class="fa fa-instagram"></i>{{else}}<i>{{:source.type}}</i>{{/if}}</div><a style="background-image:url(&apos;{{:author.photo}}&apos;)" href="{{:author.url}}" target="_blank" class="author_photo">{{if author.photo == ""}}<i class="fa fa-user"></i>{{/if}}  </a>  <div rel="author">{{:author.name}}</div>  <time datetime="{{:date}}">{{:stringDate}}</time></address>';

renderJsTemplates.genericContent = '<article id="content-{{:id}}" class="item {{if valid == false}}item-hidden{{/if}} {{if pinned == true}}item-pinned{{/if}} {{if selected == true}}item-selected{{/if}}">  <div class="content-inner">    <header>      <div class="byline">{{include tmpl="genericAuthor" /}}</div>    </header>    <div class="article-content">{{contentFormatter:text}}</div>    <div class="article-medias">{{include tmpl="mediaList" /}}</div>{{if pinned == true}}    <div class="pinned"><i class="fa fa-thumb-tack "> </i></div>{{/if}}  </div></article>';

renderJsTemplates.mediaList = '{{for media}}<div id="media-{{:_id}}" class="media-item">{{include tmpl=type /}}</div>{{/for}} ';

renderJsTemplates.image = '<div class="media-image">  <div style="background-image:url(&apos;{{:url}}&apos;)" class="img-blur-bg"></div>  <div style="background-image:url(&apos;{{:url}}&apos;)" class="img-show"></div><img src="{{:url}}" class="img-display-wait"/></div>';

renderJsTemplates.text = ' ';

renderJsTemplates.video = '<video autoplay="autoplay" loop="loop" muted="muted" class="media-video video-display-wait">  <source type="video/mp4" src="{{:url}}"/></video>';
