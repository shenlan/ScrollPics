var ScrollPics = (function($){
	function ScrollPics(){
		this.init.apply(this,arguments);
	}
	ScrollPics.prototype = {
		init:function(options){
			options = options ||{};
			this._scroll = 	$(options.id||"#scrollpic");
			this._width = options.width||720;
			this._ul = this._scroll.find("ul");
			this._lis = this._scroll.find("li");
			this._dds = 0;
			this._len = this._lis.length;
			this._current = 0;
			this._steps = 20;
			this._stepWidth = this._width*0.05;
			this._timeId = 0;
			this._scrolling=false;
			
			this.create();
			this.hover();
			this.autoPlay();
		},
		create:function(){
			this._ul.css("width", 2 * this._width);
			this._lis.css({"left":this._width,"z-index":0}).
				append('<div class="bg">').
				eq(0).css("left",0);
			this._lis.each(function(){
				var that=$(this),img = that.find("img"),ttl = img.attr("alt"),useful = img.attr("data-useful");
				that.append('<div class="txt">'+ttl+'</br><span>'+useful+'有用</span></div>');
			});
			var str = ["<dl>"];
			str.push("<dd class='prev'></dd>");
			for(var i=this._len;i--;){
				str.push("<dd class='point'></dd>");	
			}
			str.push("<dd class='next'></dd>");
			str.push("</dl>");
			this._scroll.append(str.join(''));	
			this._dds = this._scroll.find("dd.point");
			this._dds.removeClass("cur").eq(this._current).addClass('cur');
		},
		picScroll:function(left,index){
			var that = this, prev, next, len = that._len, elm = that._ul;
			if(index >= 0){
				prev = that._current;
				next = that._current;
				that._current = index;
			}else{
				if(left){
					prev = that._current;
					++that._current > len - 1 ? that._current = 0 : 0;
					
				}else{
					next = that._current;
					--that._current < 0 ? that._current = len - 1 : 0;
				}
			}			
			if(left){
				that._lis.css({"left":that._width,"z-index":0}).eq(prev).css("left",0).end().eq(that._current).css("zIndex", len);
				that._dds.removeClass("cur").eq(that._current).addClass('cur');
				elm.css('left',0).animate({left:-that._width},500,function(){
					that._scrolling = false;
				});
			}else{
				that._lis.css({"left":0,"z-index":0}).eq(next).css("left",that._width).end().eq(that._current).css("zIndex", len);
				that._dds.removeClass("cur").eq(that._current).addClass('cur');
				elm.css('left',-that._width).animate({left:0},500,function(){
					that._scrolling = false;
				});	
			}
		},
		autoPlay:function(){
			var that = this;
			that._timeId = setInterval(function(){
				that.picScroll(true);
			},4000);
		},
		hover:function(){
			var that = this;
			that._scroll.on("mouseenter",function(){
				clearInterval(that._timeId);
			})
			that._scroll.on("mouseleave",function(){
				that.autoPlay();
			})
			var prev = that._scroll.find("dd.prev"),next = that._scroll.find("dd.next"),dl = that._scroll.find("dl");
			dl.on("click","dd",function(event){
				if(that._scrolling) return;
				that._scrolling = true;
				if($(this).hasClass("prev")){
					that.picScroll(false);
				}else if($(this).hasClass("next")){
					that.picScroll(true);	
				}else{
					var index = that._dds.index(this);
					if(index > that._current){
						that.picScroll(true,index);
					}else if(index < that._current){
						that.picScroll(false,index);	
					}
				}
			});
		}
	};
	return ScrollPics;
})(jQuery);