const products = {

    "Gaming Laptop":{

        image:"images/laptop.png",
        price:"₹699 / Week",
        deposit:"₹3000"

    },

    "DSLR Camera":{

        image:"images/camera.png",
        price:"₹499 / Week",
        deposit:"₹2000"

    },

    "Headphones":{

        image:"images/headphone.png",
        price:"₹199 / Week",
        deposit:"₹1000"

    },

    "Smart Phone":{

        image:"images/phones.png",
        price:"₹399 / Week",
        deposit:"₹2500"

    }

};

const params = new URLSearchParams(window.location.search);

const productName = params.get("product");

const product = products[productName];

document.getElementById("productTitle").textContent = productName;

document.getElementById("productImage").src = product.image;

document.getElementById("productPrice").textContent = product.price;

document.getElementById("productDeposit").textContent = product.deposit;

document.getElementById("productName").value = productName;

document
.getElementById("bookingForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    alert("Booking Confirmed Successfully!");

});