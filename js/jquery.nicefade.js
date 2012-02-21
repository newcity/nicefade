/*
	Nicefade : A jQuery plugin for creating a slideshow out of a list of items
	Author: Caleb Pierce - http://calebpierce.com
*/

(function($){

	$.fn.nicefade = function( options ) {

		return this.each(function() {
			$.nicefade($(this).find('.nicefade_container'), options);
		});
		
	}; // $.fn.nicefade
		
		
	$.nicefade = function($container, options) {
		
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			'animationSpeed'	: 500,
			'animationDelay'	: 5000,
			'$indexList'		: $container.siblings('.nicefade_index-list'),
			'initialIndex'		: 1
		}, options);
		
		
		var $current_element = $('> *:nth-child(' + settings.initialIndex + ')', $container),
			$next_element = $('> *:nth-child(' + (settings.initialIndex + 1) + ')', $container),
			stop_animation = false;
		
		
		// hide all elements that aren't the first one (NOTE: do this is your CSS to prevent a FOUC)
		$container.children().not($current_element).hide();
		
		// indicate initial index in index list
		settings.$indexList.children(':nth-child(' + settings.initialIndex + ')').addClass('current');
		
		// click handler for index items. Switches view to requested slide
		settings.$indexList.find('a').click(function(e){
			e.preventDefault();
			stop_animation = true; // stop the slideshow from continuing
			
			var requested_index = $(e.target).parent('li').index(),
				requested_slide = $container.children(':nth-child(' + (requested_index + 1) + ')'); // +1 to compensate for 0-index default
			
			functions.fadeTo(requested_slide, $.noop(), true);
		});
		
		
		// helper functions co
		var functions = {
			
			init: function() {
				// kick off the animation after the initial delay
				setTimeout( function(){ functions.loopCycler(); }, settings.animationDelay);
			},
			
			// fade in to a new element and fade out the old one
			fadeTo: function( element_in, callback, updateIndexImmediately ) {
				
				// clear animation queue, then perform animation
				$container.children().clearQueue();
				$current_element.fadeOut( settings.animationSpeed );
				$current_element = element_in.fadeIn( settings.animationSpeed, function() { 
					callback();
					functions.updateSlideStatus();
					
					if ( ! updateIndexImmediately )
						functions.updateIndex();
				});
				
				if ( updateIndexImmediately )
					functions.updateIndex();

			},
			
			// recursive wrapper for setTimeout
			loopCycler: function() {				
				if ( ! stop_animation ) {
				    functions.fadeTo( $next_element, function() {				
				        setTimeout( function() { functions.loopCycler(); }, settings.animationDelay );
				    }, false);
				}
			},
			
			// set the current and next slides
			updateSlideStatus: function() {
				$next_element = $next_element.next();
				if ( ! $next_element.length )
					$next_element = $container.children(':first');
			},
			
			// make slide index list indicate the current slide
			updateIndex: function() {
				console.log('updateIndex');
				var current_index = $current_element.index() + 1; // +1 to compensate for 0-index default
				settings.$indexList.children(':nth-child(' + current_index + ')').addClass('current').siblings().removeClass('current');
			}
			
		};
		
		
		// kick off the animations
		functions.init();

		
	} // $.nicefade

	
})( jQuery );