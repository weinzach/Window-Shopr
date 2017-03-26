/**
 * jTinder initialization
 */
 $( ".wrap1" ).hide();

$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    // set the status text
			if(item.index()==0){
				$( ".actions" ).hide();
				$( ".wrap" ).hide();
				$( ".wrap1" ).show();
							}
    },
	// like callback
    onLike: function (item) {
	    // set the status text
				if(item.index()==0){
					$( ".actions" ).hide();
					$( ".wrap" ).hide();
					$( ".wrap1" ).show();				}
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});
