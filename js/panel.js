/*
 * Panel.js Responsive Navigation Panel JS File v0.1.0 - By George Escott
 */

$(function(){
	//declare variables
	var	$body =  $('body'),						//variable for the body
		$viewport =  $('#viewport'),			//variable for the main container with overflow hidden
		$transformed = $('.panel-slide');		//variable for the content + header which gets transformed to the left

	//function for cutting off the excess content when the mobile panel is open
	var overflow 	=	function(){
		var	h = $(window).height(),
			panelh = $('nav.panel ul').height();

		if (panelh > h){
			$viewport.height(panelh);
		} else {
			$viewport.height(h);
		}
	}

	//if the window is resized, change the viewport height overflow accordingly
	$(window).resize(function(){
		if ($body.hasClass('panel-open')){
			$(overflow);
		}
	});

	//function for opening the panel
	var opennav		=	function(){
							$body.scrollTop();
							$body.removeClass('panel-closed').addClass('panel-open');
							$(overflow);
						}

	//function for closing the panel
	var closenav	=	function(){ 
							$body.removeClass('panel-open').addClass('panel-closed');
							$transformed.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
								$viewport.removeAttr('style');
								$body.removeClass('panel-closed');
							});
						}

	/* show/hide mobile panel */		
	$('.panel-toggle').click(function(e){
		e.preventDefault();

		//if the menu is open - close it
		if ($body.hasClass('panel-open')){$(closenav);
		//if the menu is closed - open it
		} else {$(opennav);}
	});

	swipe(document, function(swipedir){
		//add touch functionality to open/close the panel
		switch (swipedir){
			case 'none':
			break;

			case 'left':
				if ($body.hasClass('panel-open')){$(closenav)};
			break;

			case 'right':
				if (!$body.hasClass('panel-open')){$(opennav)};
			break;

			case 'up':
			break;

			case 'down':
			break;
		}
	});

});

//function for touch events
var swipe = function(el, callback){
						var touchsurface = el,
							swipedir,
							startX,
							startY,
							distX,
							distY,
							threshold = 80, //required min distance traveled to be considered a swipe
							restraint = 12, //maximum distance allowed at the same time in perpendicular direction
							allowedTime = 500, //maximum time allowed to travel that distance
							elapsedTime,
							startTime,
							handleswipe = callback || function(swipedir){}

						touchsurface.addEventListener('touchstart', function(e){
							var touchobj = e.changedTouches[0]
								swipedir = 'none'
								dist = 0
								startX = touchobj.pageX
								startY = touchobj.pageY
								startTime = new Date().getTime() //record time when finger first makes contact with the screen
						}, false);

						touchsurface.addEventListener('touchend', function(e){
							var touchobj = e.changedTouches[0],
								distX = touchobj.pageX - startX, //get horizontal distance traveled by finger while in contact with surface
								distY = touchobj.pageY - startY, //get vertical distance traveled by finger while in contact with surface
								elapsedTime = new Date().getTime() - startTime; //get time elapsed

							if (elapsedTime <= allowedTime){
								if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
									swipedir = (distX < 0) ? 'left' : 'right'; //if distance travellend is negative it indicated a left swipe
								} else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
									swipedir = (distY < 0) ? 'up' : 'down'; //if distance travelled is negative it indicated an up swipe
								}
							}

							handleswipe(swipedir);
						}, false);
					}