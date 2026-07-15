// Explore Button
document.querySelector(".hero button").addEventListener("click", function () {
    alert("Welcome to Gadgets4U!");
});

// Rent Now Buttons
let buttons = document.querySelectorAll(".card button");

buttons.forEach(function(btn){
    btn.addEventListener("click", function(){

        alert("Product Added Successfully!");

    });
});