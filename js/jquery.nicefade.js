/*
	Nicefade : A jQuery plugin for creating a slideshow out of a list of items
	Author: Caleb Pierce - http://calebpierce.com
*/

(function($){

	var $container, $current_element, $next_element, $previous_element, $indexList, stop_animation, data, $current_slide, functions;

	$.fn.nicefade = function( options ) {
		
		// advance the slideshow one step forward
		this.next = function() {

			stop_animation = true;
			functions.fadeTo($next_element, functions.loopCycler, false);

		}


		// move the slideshow one step backward
		this.previous = function() {

			stop_animation = true;
			functions.fadeTo($previous_element, functions.loopCycler, false);

		}


		// show the slide at index @target_index
		this.seek = function( target_index ) {

			stop_animation = true;
			functions.fadeTo($container.children(':nth-child(' + target_index + ')'), functions.loopCycler, false);			

		}
		
		
		return this.each(function() {
		
			$container = $(this);
	
			// Create some defaults, extending them with any options that were provided
			var settings = $.extend( {
				'animationSpeed'	: 500,
				'animationDelay'	: 5000,
				'indexList'			: $container.siblings('.nicefade_index-list'),
				'initialIndex'		: 1,
				'currentClass'		: 'current',
				'afterSlideChange'	: null,
				'beforeSlideChange'	: null
			}, options);
			
			
			// helper functions container
			functions = {
		
				init: function() {
					// kick off the animation after the initial delay
					setTimeout( function(){ functions.loopCycler(); }, settings.animationDelay);
				},
		
				// fade in to a new element and fade out the old one
				fadeTo: function( element_in, callback, updateIndexImmediately ) {
			
					if ( $.isFunction(settings.beforeSlideChange) )
						settings.beforeSlideChange();
			
					// perform animations
					// NOTE: using fadeTo() instead of fadeIn() and fadeOut() because in not all cases do elements return to full opacity
					// if clicking fast across indecis
					$current_element.stop().fadeTo( settings.animationSpeed, 0, function() {
						$(this).removeClass(settings.currentClass).hide();
					});
					$current_element = element_in.stop().fadeTo( settings.animationSpeed, 1, function() {
				
						if ( callback )
							callback();
				
						functions.updateSlideStatus();
				
						if ( ! updateIndexImmediately )
							functions.updateIndex();
					
						$.when( $(this).addClass(settings.currentClass) ).done(function(){
					
							if ( $.isFunction(settings.afterSlideChange) )
								settings.afterSlideChange();
					
						});
				
					});
										
					$container.data('current_slide', $current_element);
			
					// if the index list should be updated before the animation is complete
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
					$previous_element = $current_element.prev();
					$next_element = $current_element.next();
					
					if ( ! $next_element.length )
						$next_element = $container.children(':first');
						
					if ( ! $previous_element.length )
						$previous_element = $container.children(':last');
				},
		
				// make slide index list indicate the current slide
				updateIndex: function() {
					var current_index = $current_element.index() + 1; // +1 to compensate for 0-index default				
					$indexList.children(':nth-child(' + current_index + ')').addClass(settings.currentClass).siblings().removeClass(settings.currentClass);
				}
		
			}; // functions
			
			
			// set up variables to indicate initial state
			$current_element = $('> *:nth-child(' + settings.initialIndex + ')', $container);
			functions.updateSlideStatus();
			$indexList = settings.indexList;
			stop_animation = false;
			
			
			// prepare the slideshow's data for public access
			$(this).data('current_slide', $current_element);
			$(this).data('slideshow_length', $container.children().length);
			
			
			// hide all elements that aren't the first one (NOTE: do this is your CSS to prevent a FOUC)
			$container.children().not($current_element).hide();
	
	
			// indicate initial index in index list
			$indexList.children(':nth-child(' + settings.initialIndex + ')').addClass(settings.currentClass);
	
	
			// click handler for index items. Switches view to requested slide
			$indexList.find('a').click(function(e){
				e.preventDefault();
				stop_animation = true; // stop the slideshow from continuing
		
				var requested_index = $(e.target).parent().index(),
					requested_slide = $container.children(':nth-child(' + (requested_index + 1) + ')'); // +1 to compensate for 0-index default
		
				functions.fadeTo(requested_slide, $.noop(), true);
			});
	
	
			// kick off the animations
			functions.init();
		 
		});
		
	}; // $.fn.nicefade

	
})( jQuery );