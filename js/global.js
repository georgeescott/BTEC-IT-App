/*
 * Richard Huish BTEC IT App JS File v1.0.0 - By George Escott
 */

	//map touch events to click events
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);	
	
	function touchHandler(e){
		var touches = e.changedTouches,
			first = touches[0],
			type = "";
		
		switch(e.type){
			case "touchstart": type = "mousedown"; break;
			case "touchmove":  type = "mousemove"; break;        
			case "touchend":   type = "mouseup"; break;
			default: return;
		}

		//initMouseEvent(type, canBubble, cancelable, view, clickCount, 
		//screenX, screenY, clientX, clientY, ctrlKey, 
		//altKey, shiftKey, metaKey, button, relatedTarget);

		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(type, true, true, window, 1, 
								  first.screenX, first.screenY, 
								  first.clientX, first.clientY, false, 
								  false, false, false, 0/*left*/, null);

		first.target.dispatchEvent(simulatedEvent);
	}

	//declare variables
	var	$body =  $('body'),						//variable for the body
		$viewport =  $('#viewport'),			//variable for the main container with overflow hidden
		$transformed = $('.panel-slide');		//variable for the content + header which gets transformed to the left

	//phonegap app initialise code
	var app = {
		// Application Constructor
		initialize: function() {
			this.bindEvents();
		},
		// Bind Event Listeners

		// Bind any events that are required on startup. Common events are:
		// 'load', 'deviceready', 'offline', and 'online'.
		bindEvents: function() {
			document.addEventListener('deviceready', this.onDeviceReady, false);
		},
		// deviceready Event Handler

		// The scope of 'this' is the event. In order to call the 'receivedEvent'
		// function, we must explicity call 'app.receivedEvent(...);'
		onDeviceReady: function() {
			app.receivedEvent('deviceready');
		},
		// Update DOM on a Received Event
		receivedEvent: function(id) {
			var parentElement = document.getElementById(id);
			var listeningElement = parentElement.querySelector('.listening');
			var receivedElement = parentElement.querySelector('.received');

			listeningElement.setAttribute('style', 'display:none;');
			receivedElement.setAttribute('style', 'display:block;');

			console.log('Received Event: ' + id);
		}
	};

	//nav menu items
	$('nav.panel ul li a').click(function(e){
		var section = $(this).data('section');

		if (!section){
			return false;
		} else {
			e.preventDefault();
			$('section').removeClass("open");
			$('section#'+section).addClass('open');
			$body.removeClass('panel-open').addClass('panel-closed');
			$transformed.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
				$viewport.removeAttr('style');
				$body.removeClass('panel-closed');
			});
		}
	});

	//test code button click
	$('#welcome button.close').click(function(e){
		e.preventDefault();
		$('#welcome').addClass("closed");
	});

	$('section button').click(function(e){
		e.preventDefault();

		var	parent = $(this).parents("div.row"),
			code = parent.find('textarea').val(),
			iframe = parent.find('iframe').contents(),
			body = iframe.find('body'),
			head = iframe.find('head'),
			apphead = $('head');

		if ($(this).hasClass('html') || $(this).hasClass('css') || $(this).hasClass('js') || $(this).hasClass('css-app')){
			head.empty();
			body.empty();
			
			reset = $('<style></style>').appendTo(head);
			reset.html("*{margin: 0;}body{margin: 5px; font-size: 16px; font-family: Arial, Helvetica, sans-serif;}");

			if ($(this).hasClass('js')){
				var tags = $('<script></script>').appendTo(body);
				tags.html(code);
			} else if ($(this).hasClass('css')){
				$('<p>This is some example text for you to style with CSS</p>').appendTo(body);
				var tags = $('<style type="text/css"></style>').appendTo(body);
				tags.html(code);
			} else if ($(this).hasClass('css-app')){
				apphead.find('style').remove();
				var tags = $('<style type="text/css"></style>').appendTo(apphead);
				tags.html(code);
			} else if ($(this).hasClass('html')){
				body.html(code);
			}
		} else if ($(this).hasClass('reset')){
			head.empty();
			body.empty();
			reset = $('<style></style>').appendTo(head);
			reset.html("*{margin: 0;}body{margin: 5px; font-size: 16px; font-family: Arial, Helvetica, sans-serif;}");
		} else if ($(this).hasClass('reset-app')){
			apphead.find('style').remove();
		}
	});
	
	//fixed header and textarea focus bug
	var deviceAgent = navigator.userAgent.toLowerCase();
	$iOS = deviceAgent.match(/(iphone|ipod|ipad)/);
	
	if ($iOS){
		$("input, textarea").on("focus",function(e){$("header").css("position","absolute");});
		$("input, textarea").on("blur",function(e){$("header").find('style').remove();});
	}