window.onscroll = function() {myFunction()};

function myFunction() {
    
    let navbar = document.getElementById("nav-Principal");

    if (window.scrollY >= 10) {
      navbar.classList.add("sticky")
    }else{
        navbar.classList.remove("sticky")
    }
} 