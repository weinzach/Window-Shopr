/**
 * jTinder initialization
 */
$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    // set the status text
			if(item.index()==0){
				$( ".actions" ).hide();
				alert("OH SHIT FAM");
							}
    },
	// like callback
    onLike: function (item) {
	    // set the status text
				if(item.index()==0){
					$( ".actions" ).hide();
					alert("OH SHIT FAM");
				}
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
