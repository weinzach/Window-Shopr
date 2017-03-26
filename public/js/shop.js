function goTo() {
    var found = 0;
    var radios = document.getElementsByName('cat');
    var state = document.getElementById('state').value;
    var city = document.getElementById('city').value;
    if ((state == "") || (city == "")) {
        alert("Incomplete form!");
    } else {
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                found = 1;
                // do whatever you want with the checked radio
                window.location = "../swipe/" + radios[i].id;
                //
            }
        }
        if (found == 0) {
            alert("Incomplete form!");
        }
    }
}

function addListing(){
  var nameS = document.getElementById('name').value;
  var cityS = document.getElementById('city').value;
  var stateS = document.getElementById('state').value;
  var descS = "$"+document.getElementById('price').value+" "+document.getElementById('desc').value;
  var radios = document.getElementsByName('cat');

  console.log(nameS);
  console.log(descS);

  if ((nameS == "") || (descS == "")) {
      alert("Incomplete form!");
  } else {
      for (var i = 0, length = radios.length; i < length; i++) {
          if (radios[i].checked) {
              found = 1;
              // do whatever you want with the checked radio
                $.post("/product",
                {
                  name: nameS,
                  desc: descS,
                  city: cityS,
                  state:stateS,
                  category: radios[i].id
                },
                function(data,status){
                  window.location = "../shop";
                });
          }
      }
      if (found == 0) {
          alert("Incomplete form!");
      }
  }
}
