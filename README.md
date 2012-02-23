NiceFade: A jQuery slideshow plugin
===================================

### Author: Caleb Pierce : http://calebpierce.com

DOM structure:
-------------------------------
	
	ul or ol.nicefade_container
	(optional) ul or ol.nicefade_index-list (same length as items in slideshow)
		a
			
Options:
-------------------------------
* animationSpeed: speed of slideshow animation in milliseconds
* animationDelay: delay between animations in milliseconds
* indexList: ul or ol with each child li representing their own slide in the slideshow
* initialIndex: the slideshow's starting point
* currentClass: the class of the current slideshow item and current index item
* beforeSlideChange: function that gets called before the slides begin to change
* afterSlideChange: function that gets called after the slides finish changing


Public functions:
-------------------------------
_Note: automated slide animation stops when you manually move to a specific slide_
* next(): advance the slideshow one step forward
* previous(): move the slideshow one step backward
* seek( index ): change the visible slide to the one at index @index


Public attributes (via jQuery's .data() function):
-------------------------------
* slideshow_length: the number of elements in the slideshow
* current_slide: the slide currently being shown