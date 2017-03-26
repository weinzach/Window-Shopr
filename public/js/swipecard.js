var container = $('.container');
var cardOne = $('.one');

// Animates the card on a button click
function animateOnClick(answer) {
  var el = $('.cards .card:first-child');
  var next = $(el).next('.card');

  ThrowPropsPlugin.to(el, {throwProps:{
      x: {end: answer == "Yes" ? 100 : -100},
      y: {end: 0}
    }, ease:Strong.easeOut, onComplete: animateCard(el, next)
  });
}

// Populates the next card
function populateCard(el) {
  $(el).css({"opacity": "0", "display" : "flex"})
       .animate({ opacity: 1.0 });
  initDraggable(el);
}

// Animates the card if we have another one
function animateCard(el, nextCard) {
  $(el).animate({ opacity: 0.0, display: "none" }, 100, function() {
        if(nextCard) {
          $(el).remove();
          populateCard(nextCard);
        }
  });
}

function initDraggable(card) {
  Draggable.create(card, {
  type: "x",
  bounds: container,
  throwProps: true,
  lockAxis:true,
  /* snap: [0, 0], */
  onDragEnd: function() {
    var next = $(this.target).next('.card');
    if(this.x > 150 || this.x < -150) {
      animateCard(card, next);
    } else {
      ThrowPropsPlugin.to(card, {throwProps:{x: {end: 0}, y:{end: 0}}, ease:Strong.easeOut });
    }
  }
});
}

initDraggable(cardOne);
