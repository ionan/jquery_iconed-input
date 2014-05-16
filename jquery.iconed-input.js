(function( $ ) {
	$.iconedInput = {
		version: '0.1',
		defaults: {
			tooltipOnIcon : true,
			tooltipOnHover : true,
			tooltipOnClick : false,
			hideTooltipOnClick : true, 
			tooltipText : 'This is a tooltip',
			tooltipClass : '',
			tooltipFixedPosition : true,
			arrowOnTooltip : true,
			tooltipPosition : 'top',
			hideIconOn : 'focusin',
			showIconOn : 'focusout',
			iconJustWithoutText : false,
			icon : 'info'
		}
	};
	$.fn.iconedInput = function(options) {
		var opts = $.extend({}, $.iconedInput.defaults, options);
		var alreadyPositioned = false;
		var methods = {
			init: function(){
				var tooltipBindings = methods['getTooltipBindings'].call(this);
				var browser = methods['getBrowser'].call(this);
				this.each(function() {
					var $this = $(this);
					var hasText = ($this.val().length > 0);
					var ttIconClass = '';
					if (opts.iconJustWithoutText && hasText) ttIconClass = 'iconed-input-hidden';
					$this.addClass('iconed-input')
						 .wrap('<span class="iconed-input ' + browser + '" />')
						 .after($('<span class="iconed-input-' + opts.icon + '"/>').addClass(ttIconClass).bind(tooltipBindings)
						);
					
					$this.focusin(methods['hideIcon'])
						 .focusout(methods['showIcon']);
				});
				
				$('.iconed-input-' + opts.icon).each(function(){
					var $this = $(this);
					if ($this.prev('input:first').css("margin-right") != '0px'){
						var _right = $this.css("right").replace("px","");
						var mr = parseInt(_right);
						mr = (isNaN(mr)) ? 0 : mr;
						var _mr = parseInt($this.prev('input:first').css("margin-right").replace("px",""));
						var newMr = mr + _mr + "px";
						$this.css({right : newMr});
					}
					if (browser == 'ie8'){
						var left = $this.offset().left - 20;
						$this.offset().left = left;
					}
				});
				
			},
			getTooltipBindings: function(){
				var tooltipBindings = {};
				if (opts.tooltipOnIcon) {
						if (opts.tooltipOnHover){
							tooltipBindings = {
									mousemove : methods['changeTooltipPosition'],
									mouseenter : methods['showTooltip'],
									mouseleave: methods['hideTooltip']
								};
						}
						if (opts.tooltipOnClick){
							tooltipBindings['click'] = methods['showHideTooltip'];
						}
				}
				return tooltipBindings;
			},
			buildTooltip: function(text){
				var markup = '<div class="iconed-input-tooltip ' + opts.tooltipClass + '"><div class="iconed-input-tooltip-content">' + text + '</div>';
				if (opts.arrowOnTooltip){
					var arrow = methods['getArrow'].call(this);
					markup += '<div class="iconed-input-tooltip-arrow" style="position:absolute">' + arrow + '</div>';
				}
				markup += "</div>";
				return markup;
			},
			getArrow: function(){
				var arrow = '';
				if (opts.tooltipPosition == 'top') for (var i = 10; i >= 1; i--) arrow += '<div class="line' + i + '"><!-- --></div>';
				else for (var i = 1; i >= 10; i++) arrow += '<div class="line' + i + '"><!-- --></div>';
				return arrow;
			},
			showTooltip: function(e) {
				methods['hideTooltip'].call(this);
				var text = opts.tooltipText;
				var $currTarget = $(e.currentTarget);
				if (typeof $currTarget.prev('input:first').attr('iconed-input-tooltipText') != 'undefined')
					text = $currTarget.prev('input').attr('iconed-input-tooltipText')
				var tt = methods['buildTooltip'].call(this,text);
   				$(tt).appendTo('body');
				if (opts.hideTooltipOnClick) $('div.iconed-input-tooltip').click(methods['hideTooltip']);
   				methods['changeTooltipPosition'].call(this,e);
   				alreadyPositioned = true;
			},
			changeTooltipPosition: function(e) {
				if (opts.tooltipFixedPosition && alreadyPositioned) return;
				var xCoord = e.pageX;
				var yCoord = e.pageY;
				if (opts.tooltipFixedPosition){
					var $currTarget = $(e.currentTarget);
					xCoord = $currTarget.offset().left - 14;
					yCoord = $currTarget.offset().top;
				}
				var ttWidth = $('div.iconed-input-tooltip').outerWidth(true);
				var ttHeight = $('div.iconed-input-tooltip').outerHeight(true);
				var tooltipX = xCoord; // - ttWidth/2 + 4;
				var tooltipY = yCoord + 8;
				if (opts.tooltipPosition == 'top'){
					tooltipY = Math.max(tooltipY - 16 - ttHeight,0);
				}
				$('div.iconed-input-tooltip').css({top: tooltipY, left: tooltipX});
			},
			hideTooltip: function() {
				$('div.iconed-input-tooltip').remove();
				$('div.iconed-input-tooltip-arrow').remove();
   				alreadyPositioned = false;
			},
			getBrowser: function(){
				if (navigator.userAgent.indexOf('Firefox') != -1) return 'firefox';
				if (navigator.userAgent.indexOf('MSIE 8.0') != -1) return 'ie8';
				if (navigator.userAgent.indexOf('MSIE') != -1) return 'ie';
				return '';
			},
			showHideTooltip: function(e){
				if ($('div.iconed-input-tooltip').is(':visible')) methods['hideTooltip'].call(this,e);
				else methods['showTooltip'].call(this,e);
			},
			hideIcon: function(e){
				var $currTarget = $(e.currentTarget);
				$currTarget.next('span').addClass('iconed-input-hidden');
			},
			showIcon: function(e){
				var $currTarget = $(e.currentTarget);
				var hasText = ($currTarget.val().length > 0);
				if (!opts.iconJustWithoutText || !hasText)
					$currTarget.next('span').removeClass('iconed-input-hidden');
			}
		};
		methods['init'].call(this);
	};
}( jQuery ));