function goTo() {
    var found = 0;
    var radios = document.getElementsByName('cat');
    var state = document.getElementById('state').value;
    var city = document.getElementById('city').value;
    if ((state == "") && (city == "")) {
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
