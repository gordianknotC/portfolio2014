/**
 * ProjectBlocker.js
 * =================
 * A handy jQuery solution for blocking responsive, IE,
 * or incomplete bits from being seen while in development.
 *
 * Version:    v1.0.0
 * Release:    February 07, 2015
 * Site:    http://github.com/mike-zarandona/ProjectBlocker
 * Author:    Mike Zarandona | http://twitter.com/mikezarandona
 **/
var pbOverLayDOM2 = '<div class="pb-responsive-overlay show" style="display:none"><div class="pb-message-wrapper rwd" style="background-color: #000;"><div class="pb-pixel-counter" style="transition: none;border-radius: 1;"><p>loading<br>images</p><span>3/12</span></div></div></div>'
var pbOverlayDOM = "<div class=\"pb-responsive-overlay\" style=\"display:none\"><div class=\"pb-message-wrapper\" style=\"background-color:#000;border-radius:0\"><h1>　　　</h1><p class=\"one ie\">This site is currently in development, and right now Internet Explorer is <u>temporarily</u> being hidden as it is not yet finished. Please check back again soon!</p><p class=\"two ie\">In the mean time, please try using a different browser such as <a href=\"http://www.google.com/chrome\" target=\"_blank\">Google Chrome</a> or <a href=\"http://getfirefox.com\" target=\"_blank\">Mozilla Firefox</a>. Thanks!</p><p class=\"one homepage\">This site is currently in development, and right now the <strong>homepage</strong> is temporarily being hidden as it is not yet finished being built. Please check back again soon!</p><p class=\"two homepage\">In the mean time, please feel free to <a href=\"javascript:void(0)\" target=\"_blank\">access the CMS</a> to start editing your content or to go to a secondary page to view the rest of your site in progress. Thanks!</p><p class=\"one rwd\">This site is in development, and the \"<a href=\"http://en.wikipedia.org/wiki/Responsive_web_design\" target=\"_blank\">responsive</a>\" component (what makes the site resize to fit every screen) is not yet in place.</p><p class=\"two rwd\">In the mean time, <strong>please expand the width of your browser</strong>. As soon as you do, this message will disappear and you can get to viewing the site!</p><p class=\"signed\"><strong>- Author</strong></p><div class=\"pb-pixel-counter\" style=\"background-color:#111;\"><p>Pixels Left<br>to Go</p><span>0</span></div></div></div>";
var pbStyles = ".pb-loading{background-repeat: no-repeat;background-image: url(icon_96.png);background-color:#111;background-position: 50% 20%;}.pb-responsive-overlay{display:block!important;position:fixed;opacity:0;width:100%;height:100%;top:0;left:0;background-color:#ADB1B3;background-color:rgba(0,0,0,1);font-family:'Open Sans',sans-serif;z-index:-9999;-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms}.pb-responsive-overlay.show{opacity:1;z-index:999999999}.pb-responsive-overlay.block{display:block!important;opacity:1!important;z-index:999999999!important}.pb-responsive-overlay.block .pb-message-wrapper{padding-left:1.5em;padding-right:1.5em}.pb-responsive-overlay.no-arrows .pb-message-wrapper .pb-pixel-counter:after,.pb-responsive-overlay.no-arrows .pb-message-wrapper .pb-pixel-counter:before{display:none}.pb-responsive-overlay .pb-message-wrapper{-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;padding:5px 2.5em;border-radius:50%;background-color:#fff;color:#BEC2C4;text-align:center;position:absolute;top:10%;left:50%;margin-left:-250px;height:500px;width:500px;-webkit-box-shadow:0 20px 0 rgba(0,0,0,.33);-moz-box-shadow:0 20px 0 rgba(0,0,0,.33);box-shadow:0 20px 0 rgba(0,0,0,.33)}.pb-responsive-overlay .pb-message-wrapper h1{font:82px/1em 'Open Sans Condensed',sans-serif;margin:.25em auto;color:#999;font-weight:300;-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms}.pb-responsive-overlay .pb-message-wrapper p{text-align:left;font:16px/1.75em 'Open Sans',sans-serif;-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms}.pb-responsive-overlay .pb-message-wrapper p.one{margin-bottom:0;text-align:center;display:none}.pb-responsive-overlay .pb-message-wrapper p.two{float:left;width:48%;text-align:right;margin-bottom:.75em;display:none}.pb-responsive-overlay .pb-message-wrapper p.signed{clear:both;float:left;width:55%;text-align:right;font:300 32px/1em 'Open Sans Condensed',sans-serif;margin:.5em 0}.pb-responsive-overlay .pb-message-wrapper p a{color:#111}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter{background-position-x:50%;position:absolute;height:200px;width:200px;right:5px;bottom:65px;border-radius:50%;background-color:#e15e00;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms;-webkit-box-shadow:0 20px 0 rgba(0,0,0,.33);-moz-box-shadow:0 20px 0 rgba(0,0,0,.33);box-shadow:0 20px 0 rgba(0,0,0,.33);-webkit-animation:pulse 3s infinite;-moz-animation:pulse 3s infinite;-o-animation:pulse 3s infinite;animation:pulse 3s infinite}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:after,.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:before{content:'\\00AB';position:absolute;display:block;font:64px/1em 'Open Sans',sans-serif;color:#719331;width:.5em;height:1em;top:50%;right:100%;margin-top:-.5em}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:before{-webkit-animation:widerleft 3s infinite;-moz-animation:widerleft 3s infinite;-o-animation:widerleft 3s infinite;animation:widerleft 3s infinite}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:after{content:'\\00BB';right:auto;left:100%;-webkit-animation:widerright 3s infinite;-moz-animation:widerright 3s infinite;-o-animation:widerright 3s infinite;animation:widerright 3s infinite}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter p{color:#fff;text-align:center;padding-top:.3em;font:20px/1em 'Open Sans',sans-serif;margin-bottom:0;-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter span{color:#fff;font:300 102px/1em 'Open Sans Condensed',sans-serif;-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter .signed{font-family:'Open Sans Condensed',sans-serif;font-size:42px;margin-top:1.5em;width:100%}.pb-responsive-overlay .pb-message-wrapper.ie{padding-left:2em;padding-right:2em}.pb-responsive-overlay .pb-message-wrapper.homepage p.one.homepage,.pb-responsive-overlay .pb-message-wrapper.homepage p.two.homepage,.pb-responsive-overlay .pb-message-wrapper.ie p.one.ie,.pb-responsive-overlay .pb-message-wrapper.ie p.two.ie,.pb-responsive-overlay .pb-message-wrapper.rwd p.one.rwd,.pb-responsive-overlay .pb-message-wrapper.rwd p.two.rwd{display:block}@media screen and (max-width:600px){.pb-responsive-overlay .pb-message-wrapper{height:400px;width:400px;margin-left:-200px}.pb-responsive-overlay .pb-message-wrapper h1{font-size:62px}.pb-responsive-overlay .pb-message-wrapper p{font-size:14px;line-height:1.25em}.pb-responsive-overlay .pb-message-wrapper p.signed{font-size:28px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter{height:160px;width:160px;bottom:55px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:after,.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:before{font-size:48px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter p{font-size:16px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter span{font-size:82px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter .signed{margin-top:1.25em;font-size:38px}}@media screen and (max-width:480px){.pb-responsive-overlay .pb-message-wrapper{padding:5px 1em;height:300px;width:300px;margin-left:-150px}.pb-responsive-overlay .pb-message-wrapper h1{font-size:42px;margin-bottom:0}.pb-responsive-overlay .pb-message-wrapper p{font-size:12px;line-height:1.2em}.pb-responsive-overlay .pb-message-wrapper p.signed{font-size:22px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter{height:135px;width:135px;bottom:25px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:after,.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter:before{font-size:32px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter p{font-size:16px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter span{font-size:62px}.pb-responsive-overlay .pb-message-wrapper .pb-pixel-counter .signed{margin-top:1.5em;font-size:30px}}@-webkit-keyframes widerleft{0,100%{right:100%}50%{right:105%}}@-moz-keyframes widerleft{0,100%{right:100%}50%{right:105%}}@-o-keyframes widerleft{0,100%{right:100%}50%{right:105%}}@keyframes widerleft{0,100%{right:100%}50%{right:105%}}@-webkit-keyframes widerright{0,100%{left:100%}50%{left:105%}}@-moz-keyframes widerright{0,100%{left:100%}50%{left:105%}}@-o-keyframes widerright{0,100%{left:100%}50%{left:105%}}@keyframes widerright{0,100%{left:100%}50%{left:105%}}@-webkit-keyframes pulse{0,100%{background-color:#c75400}50%{background-color:#719331}}@-moz-keyframes pulse{0,100%{background-color:#c75400}50%{background-color:#719331}}@-o-keyframes pulse{0,100%{background-color:#c75400}50%{background-color:#719331}}@keyframes pulse{0,100%{background-color:#c75400}50%{background-color:#719331}}";


(function ($) {

	var defaults = {
		responsive: 'hide',
		minWidth: 0,
		homepage: 'show',
		homepageSelector: null,

		ie: 'hide'
	};


	$.projectBlocker = function (options) {

		options = $.extend({}, defaults, options);

		var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false,
			blocked = false,		// watch for block status and hold site parameter
			siteVar,				// holds the value of `getURLParameter`
			lsKey,					// holds the value of the localstorage developer mode key value pair

			$head = $('head'),		// site head
			$body = $('body'),
			$overlay,
			$msgWrapper,
			$pixelCtr;

		// Add Google font and the styles to the <head> of the document
		$head
			.append('<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:400,700|Open+Sans+Condensed:300" />')
			.append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css" />')
			.append('<style type="text/css">' + pbStyles + '</style>')
		;

		// If the viewport meta doesn't exist in the <head> on mobile append it
		if (mobile) {
			if ($('meta[name=viewport]').length === 0) {
				$head.append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">');
			}
		}

		// Increment width to make the math a bit easier
		options.minWidth++;


		/**
		 * TIME TO DO STUFF
		 **/
		// Check URL parameter for `/?dev=off`
		if (getURLParameter('dev') == 'off') {
			if (testLocalStorage()) {
				notifyTheConsole(0);
				localStorage.clear();
			}
		}

		// Grab the hostname to enable `/?dev=true`
		if (testLocalStorage()) {
			lsKey = localStorage.getItem('PB-' + document.location.hostname);

			// Alert the user that dev mode is stil on
			if (lsKey == 'true') {
				notifyTheConsole(1);
			}
		}

		// Block message ONLY if dev mode is not on, and localStorage item is not set
		if ((getURLParameter('dev') != 'true') && (lsKey != 'true')) {

			// If we're blocking internet explorer
			if (options.ie == 'hide') {
				// IE 11
				var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
				if (isIE11) {
					blockerBot5000('ie');
				}

				// IE <= 10
				if (/*@cc_on!@*/false) {
					blockerBot5000('ie');
				}
			}


			// If we're blocking the homepage
			if ((options.homepage == 'hide') && (!blocked)) {
				if ($(options.homepageSelector).length > 0) {
					blockerBot5000('homepage');
				}
			}


			// If we're blocking responsive design
			if ((options.responsive == 'hide') && (!blocked)  ) {
				console.log('blockRWD, platform:', options.platform)
				blockerBot5000('rwd');
			}
		}
		else {
			if (testLocalStorage()) {
				// set the localStorage token to let in devs
				localStorage.setItem('PB-' + document.location.hostname, 'true');
			}
		}

		function blockIE(){
				$body.css('min-width', options.minWidth + 'px');
				// Move the signature into the orange circle
				$pixelCtr.html($('.pb-message-wrapper .signed'));
				// engage the overlay
				$overlay.addClass('block no-arrows');
				$msgWrapper.addClass('ie');
				// set the "blocked" flag
				blocked = true;
		}
		function blockHome(){
				// set the min width on the `<body/>
				$body.css('min-width', options.minWidth + 'px');
				// Move the signature into the orange circle
				// $pixelCtr.html($('.pb-message-wrapper .signed'));
				$pixelCtr.html( '<p class="signed"><strong>- Author</strong></p>>' );
				// engage the overlay
				$overlay.addClass('block no-arrows');
				$msgWrapper.addClass('homepage');
				// set the "blocked" flag
				blocked = true;
		}
		function unBlockHome(){
			$body.css('min-width', '0');
			$overlay.removeClass('block no-arrows');
			$msgWrapper.removeClass('homepage');
			$pixelCtr.html('<p>"Pixel Left"<br>"To Go"</p><span></span>')
			blocked = false;
			console.log('unblock home, pixel counter:', $pixelCtr)
		}
		function blockLoading(){
				var txt = '<br> </p><span></span><br><br><br><br><br><br><p>loading</p><p class="percentage">68%</p>'
				$('.pb-pixel-counter').addClass('pb-loading')
				$('p.rwd').css('display', 'none')
				$('p.homepage').css('display', 'none')
				$('p.signed').text('')
				$('div.pb-pixel-counter').html(txt)
				$body.css('min-width', options.minWidth + 'px');
				$overlay.addClass('block no-arrows');
				$msgWrapper.addClass('homepage');
				// set the "blocked" flag
				blocked = true;
		}
		function unBlockLoading(){
			$body.css('min-width', '0');
			$overlay.removeClass('block no-arrows');
			$msgWrapper.removeClass('homepage');
			$pixelCtr.html('<p>"Pixel Left"<br>"To Go"</p><span></span>')
			blocked = false;

			$('.pb-pixel-counter').removeClass('pb-loading')
			$('p.rwd').css('display', 'block')
			$('p.homepage').css('display', 'block')
			$('p.signed').text('- Author')

			console.log('unblock loading, pixel counter:', $pixelCtr)
		}
		function blockResponsive(){
			if (options.platform != 'Mobile'){
				console.log('blockResponsive')
				$msgWrapper.addClass('rwd');
				// If the window width is less than our target width OR is a mobile device, show the overlay on load
				if ((window.innerWidth < options.minWidth) || (mobile)) {
					// set the min width on the `<body/>`
					$body.css('min-width', options.minWidth + 'px');
					// set the "pixels left to go"
					$('.pb-pixel-counter span').html(options.minWidth - window.innerWidth);
					// engage the overlay
					$overlay.addClass('show');
				}
				// Bind to the window.resize event

				$(window).on('resize', function () {
					if (window.innerWidth < options.minWidth) {
						// set the min width on the `<body/>`
						$body.css('min-width', options.minWidth + 'px');
						// engage the overlay
						$overlay.addClass('show');
						// update the pixel counter
						$('.pb-pixel-counter span').html(options.minWidth - window.innerWidth);
					}
					else {
						// remove the min width on the `<body/>
						$body.css('min-width', '0');
						// disengage the overlay
						$overlay.removeClass('show');
					}

				});
			}

		}
		function blockerBot5000(blockType) {
			console.log('blockerBot5000!', blockType)
			// Add overlay content to the <body>
			$body.append(pbOverlayDOM);
			$overlay = $('.pb-responsive-overlay'),
			$msgWrapper = $('.pb-message-wrapper'),
			$pixelCtr = $('.pb-pixel-counter')
			// IE
			if (blockType == 'ie') {
				blockIE()
			}
			//loading
			//else if(blockType == 'loading'){
			//	blockLoading()
			//}
			// Homepage
			else if (blockType == 'homepage') {
				blockHome()
			}
			// Responsive
			else if (blockType == 'rwd') {
				// type the message wrapper to `rwd`
				blockResponsive()
			}
		}

		// A test to see if localStorage and sessionStorage & error handling
		function testLocalStorage() {
			if (typeof(Storage) !== void(0)) {
				return true;
			}
			else {
				notifyTheConsole(2);
				return false;
			}
		}


		// Retrieve URL parameters
		function getURLParameter(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.href);
			if (results === null)
				return "";
			else
				return results[1];
		}


		// console notifier
		function notifyTheConsole(type) {
			if (type === 0) {
				console.info('ProjectBlocker: Developer Mode OFF.');
			}
			else if (type == 1) {
				console.info('ProjectBlocker: Developer Mode ON.');
			}
			else if (type == 2) {
				console.error('ProjectBlocker ERROR: localStorage NOT supported - Developer Mode will not persist on navigation.');
			}
		}
		return {
			blockHome      :blockHome ,
			unBlockHome    :unBlockHome,
			blockLoading      :blockLoading ,
			unBlockLoading    :unBlockLoading,
			blockIE        :blockIE ,
			blockResponsive:blockResponsive }
	};
})(jQuery);
