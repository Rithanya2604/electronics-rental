/* =========================================================
   Gadgets4U - Frontend + MongoDB Backend Integration
   ========================================================= */

const API_BASE = "/api";

/* =========================================================
   LOCAL PRODUCT FALLBACK
   ========================================================= */

let PRODUCTS = [
    {
        id: 1,
        name: "Gaming Laptop",
        image: "laptop.png",
        desc: "Intel i7 • RTX 4060 Graphics",
        price: 699,
        deposit: 3000,
        category: "Laptops"
    },
    {
        id: 2,
        name: "MacBook Air M3",
        image: "macbook.png",
        desc: "Apple M3 • 16GB RAM",
        price: 999,
        deposit: 5000,
        category: "Laptops"
    },
    {
        id: 3,
        name: "iPhone 16",
        image: "phones.png",
        desc: "256GB • 5G",
        price: 799,
        deposit: 3500,
        category: "Mobiles"
    },
    {
        id: 4,
        name: "Samsung Galaxy S25",
        image: "samsung.png",
        desc: "12GB RAM • 256GB",
        price: 699,
        deposit: 3000,
        category: "Mobiles"
    },
    {
        id: 5,
        name: "DSLR Camera",
        image: "camera.png",
        desc: "Professional Photography",
        price: 499,
        deposit: 2000,
        category: "Cameras"
    },
    {
        id: 6,
        name: "Sony Mirrorless Camera",
        image: "sonycamera.png",
        desc: "4K • Interchangeable Lens",
        price: 799,
        deposit: 3500,
        category: "Cameras"
    },
    {
        id: 7,
        name: "Noise Cancelling Headphones",
        image: "headphone.png",
        desc: "Premium Wireless Audio",
        price: 199,
        deposit: 1000,
        category: "Accessories"
    },
    {
        id: 8,
        name: "Wireless Earbuds",
        image: "earbuds.png",
        desc: "Bluetooth • ANC",
        price: 149,
        deposit: 800,
        category: "Accessories"
    },
    {
        id: 9,
        name: "PlayStation 5",
        image: "game.png",
        desc: "Next-gen Gaming Console",
        price: 899,
        deposit: 4000,
        category: "Gaming"
    },
    {
        id: 10,
        name: "Meta Quest 3",
        image: "vr.png",
        desc: "Virtual Reality Headset",
        price: 599,
        deposit: 3000,
        category: "Gaming"
    },
    {
        id: 11,
        name: "JBL Flip 6",
        image: "speaker.png",
        desc: "Portable Bluetooth Speaker",
        price: 149,
        deposit: 700,
        category: "Speakers"
    },
    {
        id: 12,
        name: "iPad Air",
        image: "tablet.png",
        desc: "10.9-inch Retina Display",
        price: 449,
        deposit: 2000,
        category: "Tablets"
    },
    {
        id: 13,
        name: "Apple Watch Series 10",
        image: "watch.png",
        desc: "Fitness & Health Tracking",
        price: 249,
        deposit: 1200,
        category: "Wearables"
    },
    {
        id: 14,
        name: "Smart Projector",
        image: "projector.png",
        desc: "Full HD Home Theatre",
        price: 399,
        deposit: 1800,
        category: "Projectors"
    },
    {
        id: 15,
        name: "DJI Mini Drone",
        image: "drone.png",
        desc: "4K Camera Drone",
        price: 999,
        deposit: 5000,
        category: "Drones"
    },
    {
        id: 16,
        name: "Gaming Monitor",
        image: "monitor.png",
        desc: "27-inch 165Hz IPS Display",
        price: 1049,
        deposit: 4500,
        category: "Monitors"
    },
    {
        id: 17,
        name: "Wireless Printer",
        image: "printer.png",
        desc: "All-in-One Ink Tank",
        price: 299,
        deposit: 1400,
        category: "Printers"
    }
];

/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

function getData(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function moneyNumber(value) {
    return Number(value) || 0;
}

/* =========================================================
   AUTH HELPERS
   ========================================================= */

function getToken() {
    return localStorage.getItem("gadgets4u_token");
}

function currentUser() {
    return getData("gadgets4u_user", null);
}

function loggedIn() {
    return !!getToken();
}

/* =========================================================
   API HELPER
   ========================================================= */

async function api(path, options = {}) {

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (getToken()) {
        headers.Authorization = `Bearer ${getToken()}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message, type = "success") {

    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.className = `toast ${type}`;
    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/* =========================================================
   PRODUCT HELPERS
   ========================================================= */

function normalizeProduct(product) {

    return {
        ...product,
        id: Number(
            product.legacyId ||
            product.id
        ),
        dbId: product._id ||
            product.dbId,
        price: Number(product.price),
        deposit: Number(product.deposit)
    };
}

function productById(id) {

    return PRODUCTS.find(
        product =>
            Number(product.id) === Number(id)
    );
}

/* =========================================================
   LOAD PRODUCTS FROM MONGODB
   ========================================================= */

async function loadProducts() {

    try {

        const data =
            await api("/products");

        if (
            Array.isArray(data) &&
            data.length
        ) {
            PRODUCTS =
                data.map(normalizeProduct);
        }

    } catch (error) {

        console.warn(
            "Using local product data:",
            error.message
        );
    }
}

/* =========================================================
   CART
   ========================================================= */

async function getCart() {

    if (!loggedIn()) {
        return getData(
            "gadgets4u_cart",
            []
        );
    }

    try {

        const data =
            await api("/user/cart");

        return data.map(item => ({
            ...normalizeProduct(item),
            qty: item.qty || 1
        }));

    } catch {

        return [];
    }
}

/* =========================================================
   WISHLIST
   ========================================================= */

async function getWishlist() {

    if (!loggedIn()) {
        return getData(
            "gadgets4u_wishlist",
            []
        );
    }

    try {

        const data =
            await api("/user/wishlist");

        return data.map(normalizeProduct);

    } catch {

        return [];
    }
}

/* =========================================================
   HEADER UPDATE
   ========================================================= */

async function updateHeader() {

    const cart =
        await getCart();

    const wishlist =
        await getWishlist();

    const user =
        currentUser();

    /* Cart count */

    document
        .querySelectorAll("[data-cart-count]")
        .forEach(element => {

            element.textContent =
                cart.reduce(
                    (total, item) =>
                        total + (item.qty || 1),
                    0
                );

        });

    /* Wishlist count */

    document
        .querySelectorAll("[data-wishlist-count]")
        .forEach(element => {

            element.textContent =
                wishlist.length;

        });

    /* User name */

    document
        .querySelectorAll("[data-user-name]")
        .forEach(element => {

            element.textContent =
                user?.name || "My Profile";

        });

    /*
     * AUTH HEADER
     *
     * Before login:
     * Login | Sign Up
     *
     * After login:
     * User Name | Logout
     */

    document
        .querySelectorAll(".auth-buttons")
        .forEach(container => {

            if (loggedIn()) {

                /*
                 * SHOW LOGGED-IN USER NAME
                 * INSTEAD OF "MY ACCOUNT"
                 */

                container.innerHTML = `
    <a
        href="profile.html"
        class="user-name">
        ${user?.name || "My Account"}
    </a>

    <a
        href="#"
        class="signup-btn"
        id="headerLogoutBtn">
        Logout
    </a>
`;

                const logoutButton =
                    container.querySelector(
                        "#headerLogoutBtn"
                    );

                logoutButton?.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        localStorage.removeItem(
                            "gadgets4u_token"
                        );

                        localStorage.removeItem(
                            "gadgets4u_user"
                        );

                        showToast(
                            "Logged out successfully"
                        );

                        setTimeout(() => {

                            window.location.href =
                                "index.html";

                        }, 500);

                    }
                );

            } else {

                container.innerHTML = `
                    <a
                        href="login.html"
                        class="login-btn">
                        Login
                    </a>

                    <a
                        href="register.html"
                        class="signup-btn">
                        Sign Up
                    </a>
                `;
            }
        });
}

/* =========================================================
   ADD TO CART
   ========================================================= */

async function addToCart(id, quantity = 1) {

    const product =
        productById(id);

    if (!product) return;

    if (loggedIn()) {

        try {

            await api(
                "/user/cart",
                {
                    method: "POST",
                    body: JSON.stringify({
                        productId:
                            product.dbId,
                        quantity
                    })
                }
            );

            showToast(
                `${product.name} added to cart`
            );

        } catch (error) {

            showToast(
                error.message,
                "error"
            );
        }

    } else {

        const cart =
            getData(
                "gadgets4u_cart",
                []
            );

        const existing =
            cart.find(
                item =>
                    item.id === product.id
            );

        if (existing) {

            existing.qty += quantity;

        } else {

            cart.push({
                ...product,
                qty: quantity
            });
        }

        setData(
            "gadgets4u_cart",
            cart
        );

        showToast(
            `${product.name} added to cart`
        );
    }

    await updateHeader();
}

/* =========================================================
   WISHLIST
   ========================================================= */

async function toggleWishlist(id) {

    const product =
        productById(id);

    if (!product) return;

    if (loggedIn()) {

        try {

            const result =
                await api(
                    `/user/wishlist/${product.dbId}`,
                    {
                        method: "POST"
                    }
                );

            showToast(
                result.added
                    ? "Added to wishlist"
                    : "Removed from wishlist"
            );

        } catch (error) {

            showToast(
                error.message,
                "error"
            );
        }

    } else {

        let wishlist =
            getData(
                "gadgets4u_wishlist",
                []
            );

        const exists =
            wishlist.some(
                item =>
                    item.id === product.id
            );

        if (exists) {

            wishlist =
                wishlist.filter(
                    item =>
                        item.id !== product.id
                );

        } else {

            wishlist.push(product);
        }

        setData(
            "gadgets4u_wishlist",
            wishlist
        );

        showToast(
            exists
                ? "Removed from wishlist"
                : "Added to wishlist"
        );
    }

    await updateHeader();
    await renderWishlist();
}

/* =========================================================
   PRODUCT CARD
   ========================================================= */

function productCard(
    product,
    wished = false
) {

    return `
        <article class="card product-card">

            <button
                class="wishlist-btn ${
                    wished ? "active" : ""
                }"
                data-wish="${product.id}"
                aria-label="Wishlist">

                <i class="${
                    wished
                        ? "fa-solid"
                        : "fa-regular"
                } fa-heart"></i>

            </button>

            <img
                src="images/${product.image}"
                alt="${product.name}">

            <span class="category-tag">
                ${product.category}
            </span>

            <h3>
                ${product.name}
            </h3>

            <p>
                ${product.desc}
            </p>

            <h4>
                ₹${moneyNumber(
                    product.price
                ).toLocaleString("en-IN")}
                / Week
            </h4>

            <div class="card-actions">

                <a
                    class="details-btn"
                    href="product-details.html?id=${
                        product.id
                    }">
                    Details
                </a>

                <a
                    class="rent-btn"
                    href="rental-booking.html?id=${
                        product.id
                    }">
                    Rent Now
                </a>

            </div>

        </article>
    `;
}

/* =========================================================
   BIND PRODUCT BUTTONS
   ========================================================= */

function bindProductCards() {

    document
        .querySelectorAll("[data-wish]")
        .forEach(button => {

            button.onclick = () =>
                toggleWishlist(
                    button.dataset.wish
                );

        });

    document
        .querySelectorAll("[data-add-cart]")
        .forEach(button => {

            button.onclick = () =>
                addToCart(
                    button.dataset.addCart
                );

        });
}

/* =========================================================
   PRODUCTS PAGE
   ========================================================= */

async function renderProducts() {

    const grid =
        document.getElementById(
            "productsGrid"
        );

    if (!grid) return;

    const search =
        (
            document.getElementById(
                "productSearch"
            )?.value || ""
        ).toLowerCase();

    const category =
        document.getElementById(
            "categoryFilter"
        )?.value || "All";

    const filtered =
        PRODUCTS.filter(product => {

            const matchesCategory =
                category === "All" ||
                product.category === category;

            const searchText =
                `${product.name}
                 ${product.desc}
                 ${product.category}`
                    .toLowerCase();

            return (
                matchesCategory &&
                searchText.includes(search)
            );
        });

    const wishlist =
        await getWishlist();

    const wishlistIds =
        new Set(
            wishlist.map(
                item =>
                    Number(
                        item.id ||
                        item.legacyId
                    )
            )
        );

    if (!filtered.length) {

        grid.innerHTML = `
            <div class="empty-state">

                <h2>
                    No products found
                </h2>

                <p>
                    Try another search or category.
                </p>

            </div>
        `;

        return;
    }

    grid.innerHTML =
        filtered
            .map(product =>
                productCard(
                    product,
                    wishlistIds.has(
                        Number(product.id)
                    )
                )
            )
            .join("");

    bindProductCards();
}

/* =========================================================
   WISHLIST PAGE
   ========================================================= */

async function renderWishlist() {

    const grid =
        document.getElementById(
            "wishlistGrid"
        );

    if (!grid) return;

    const wishlist =
        (await getWishlist())
            .map(normalizeProduct);

    if (!wishlist.length) {

        grid.innerHTML = `
            <div class="empty-state">

                <i class="fa-regular fa-heart"></i>

                <h2>
                    Your wishlist is empty
                </h2>

                <p>
                    Save products you want to rent later.
                </p>

                <a
                    class="rent-btn"
                    href="products.html">
                    Browse Products
                </a>

            </div>
        `;

        return;
    }

    grid.innerHTML =
        wishlist
            .map(product =>
                productCard(
                    product,
                    true
                )
            )
            .join("");

    bindProductCards();
}

/* =========================================================
   CART PAGE
   ========================================================= */

async function renderCart() {

    const container =
        document.getElementById(
            "cartContent"
        );

    if (!container) return;

    const cart =
        await getCart();

    if (!cart.length) {

        container.innerHTML = `
            <div class="empty-state">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add a gadget from our products to get started.
                </p>

                <a
                    class="rent-btn"
                    href="products.html">
                    Browse Products
                </a>

            </div>
        `;

        return;
    }

    let subtotal = 0;

    const rows =
        cart.map(item => {

            const quantity =
                item.qty || 1;

            const total =
                moneyNumber(item.price) *
                quantity;

            subtotal += total;

            return `
                <div class="cart-item">

                    <img
                        src="images/${item.image}"
                        alt="${item.name}">

                    <div class="cart-item-info">

                        <span class="category-tag">
                            ${item.category}
                        </span>

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₹${moneyNumber(
                                item.price
                            ).toLocaleString("en-IN")}
                            / week
                        </p>

                        <div class="qty">

                            <button
                                data-minus="${item.id}">
                                −
                            </button>

                            <strong>
                                ${quantity}
                            </strong>

                            <button
                                data-plus="${item.id}">
                                +
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-total">

                        <strong>
                            ₹${total.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <button
                            class="remove-btn"
                            data-remove="${item.id}">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>
            `;

        }).join("");

    const deposit =
        cart.reduce(
            (total, item) =>
                total +
                moneyNumber(item.deposit) *
                (item.qty || 1),
            0
        );

    container.innerHTML = `

        <div class="cart-list">
            ${rows}
        </div>

        <aside class="summary">

            <h2>
                Order Summary
            </h2>

            <div>
                <span>
                    Rental subtotal
                </span>

                <strong>
                    ₹${subtotal.toLocaleString(
                        "en-IN"
                    )} / week
                </strong>
            </div>

            <div>
                <span>
                    Security deposit
                </span>

                <strong>
                    ₹${deposit.toLocaleString(
                        "en-IN"
                    )}
                </strong>
            </div>

            <div>
                <span>
                    Delivery
                </span>

                <strong>
                    Free
                </strong>
            </div>

            <hr>

            <div class="grand">

                <span>
                    Due at checkout
                </span>

                <strong>
                    ₹${(
                        subtotal +
                        deposit
                    ).toLocaleString(
                        "en-IN"
                    )}
                </strong>

            </div>

            <button
                id="checkoutBtn"
                class="checkout-btn">
                Proceed to Booking
            </button>

            <a
                href="products.html"
                class="continue">
                Continue Shopping
            </a>

        </aside>
    `;

    document
        .querySelectorAll("[data-plus]")
        .forEach(button => {

            button.onclick = () =>
                changeQty(
                    button.dataset.plus,
                    1
                );

        });

    document
        .querySelectorAll("[data-minus]")
        .forEach(button => {

            button.onclick = () =>
                changeQty(
                    button.dataset.minus,
                    -1
                );

        });

    document
        .querySelectorAll("[data-remove]")
        .forEach(button => {

            button.onclick = () =>
                removeFromCart(
                    button.dataset.remove
                );

        });

    document
        .getElementById("checkoutBtn")
        ?.addEventListener(
            "click",
            () => {

                if (!loggedIn()) {

                    showToast(
                        "Please login before booking",
                        "error"
                    );

                    setTimeout(() => {

                        location.href =
                            "login.html";

                    }, 500);

                    return;
                }

                location.href =
                    "rental-booking.html?fromCart=true";
            }
        );
}

/* =========================================================
   CHANGE CART QUANTITY
   ========================================================= */

async function changeQty(
    id,
    delta
) {

    const cart =
        await getCart();

    const item =
        cart.find(
            product =>
                Number(product.id) ===
                Number(id)
        );

    if (!item) return;

    const quantity =
        (item.qty || 1) + delta;

    try {

        if (loggedIn()) {

            if (quantity <= 0) {

                await api(
                    `/user/cart/${item.dbId}`,
                    {
                        method: "DELETE"
                    }
                );

            } else {

                await api(
                    `/user/cart/${item.dbId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify({
                            quantity
                        })
                    }
                );
            }

        } else {

            let localCart =
                getData(
                    "gadgets4u_cart",
                    []
                );

            const localItem =
                localCart.find(
                    product =>
                        product.id ===
                        Number(id)
                );

            if (localItem) {

                localItem.qty =
                    quantity;

                if (
                    localItem.qty <= 0
                ) {

                    localCart =
                        localCart.filter(
                            product =>
                                product.id !==
                                Number(id)
                        );
                }

                setData(
                    "gadgets4u_cart",
                    localCart
                );
            }
        }

        await renderCart();
        await updateHeader();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );
    }
}

/* =========================================================
   REMOVE FROM CART
   ========================================================= */

async function removeFromCart(id) {

    const cart =
        await getCart();

    const item =
        cart.find(
            product =>
                Number(product.id) ===
                Number(id)
        );

    if (!item) return;

    try {

        if (loggedIn()) {

            await api(
                `/user/cart/${item.dbId}`,
                {
                    method: "DELETE"
                }
            );

        } else {

            const cart =
                getData(
                    "gadgets4u_cart",
                    []
                );

            setData(
                "gadgets4u_cart",
                cart.filter(
                    product =>
                        product.id !==
                        Number(id)
                )
            );
        }

        await renderCart();
        await updateHeader();

        showToast(
            "Item removed",
            "info"
        );

    } catch (error) {

        showToast(
            error.message,
            "error"
        );
    }
}

/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

async function renderDetails() {

    const box =
        document.getElementById(
            "productDetails"
        );

    if (!box) return;

    const id =
        new URLSearchParams(
            location.search
        ).get("id");

    const product =
        productById(id) ||
        PRODUCTS[0];

    box.innerHTML = `

        <div class="details-image">

            <img
                src="images/${product.image}"
                alt="${product.name}">

        </div>

        <div class="details-info">

            <span class="category-tag">
                ${product.category}
            </span>

            <h1>
                ${product.name}
            </h1>

            <p class="details-desc">
                ${product.desc}.
                Rent it for flexible periods
                with doorstep delivery and easy returns.
            </p>

            <div class="price-line">

                <strong>
                    ₹${moneyNumber(
                        product.price
                    ).toLocaleString("en-IN")}
                </strong>

                <span>
                    / week
                </span>

            </div>

            <div class="detail-row">

                <span>
                    Security deposit
                </span>

                <strong>
                    ₹${moneyNumber(
                        product.deposit
                    ).toLocaleString("en-IN")}
                </strong>

            </div>

            <div class="detail-row">

                <span>
                    Availability
                </span>

                <strong class="available">
                    ● ${
                        product.stock === 0
                            ? "Out of Stock"
                            : "In Stock"
                    }
                </strong>

            </div>

            <div class="detail-actions">

                <button
                    class="add-cart-btn"
                    data-add-cart="${product.id}">
                    Add to Cart
                </button>

                <a
                    class="rent-btn"
                    href="rental-booking.html?id=${
                        product.id
                    }">
                    Rent Now
                </a>

            </div>

        </div>
    `;

    bindProductCards();
}

/* =========================================================
   BOOKING
   ========================================================= */

async function setupBooking() {

    const form =
        document.getElementById(
            "bookingForm"
        );

    if (!form) return;

    if (!loggedIn()) {

        showToast(
            "Please login to make a booking",
            "error"
        );

        setTimeout(() => {

            location.href =
                "login.html";

        }, 700);

        return;
    }

    const params =
        new URLSearchParams(
            location.search
        );

    const productId =
        Number(params.get("id"));

    const fromCart =
        params.get("fromCart") === "true";

    const cart =
        await getCart();

    const selected =
        productById(productId) ||
        cart[0] ||
        PRODUCTS[0];

    const productImage =
        document.getElementById(
            "productImage"
        );

    if (productImage) {
        productImage.src =
            `images/${selected.image}`;
    }

    const productTitle =
        document.getElementById(
            "productTitle"
        );

    if (productTitle) {
        productTitle.textContent =
            selected.name;
    }

    const productPrice =
        document.getElementById(
            "productPrice"
        );

    if (productPrice) {
        productPrice.textContent =
            `₹${moneyNumber(
                selected.price
            ).toLocaleString("en-IN")} / Week`;
    }

    const productDeposit =
        document.getElementById(
            "productDeposit"
        );

    if (productDeposit) {
        productDeposit.textContent =
            `₹${moneyNumber(
                selected.deposit
            ).toLocaleString("en-IN")}`;
    }

    const productName =
        document.getElementById(
            "productName"
        );

    if (productName) {
        productName.value =
            selected.name;
    }

    const bookingProductId =
        document.getElementById(
            "bookingProductId"
        );

    if (bookingProductId) {
        bookingProductId.value =
            selected.dbId;
    }

    const user =
        currentUser();

    if (user) {

        if (form.elements.name) {
            form.elements.name.value =
                user.name || "";
        }

        if (form.elements.email) {
            form.elements.email.value =
                user.email || "";
        }

        if (form.elements.phone) {
            form.elements.phone.value =
                user.phone || "";
        }
    }

    const startDate =
        document.getElementById(
            "startDate"
        );

    if (startDate) {

        const date =
            new Date();

        date.setDate(
            date.getDate() + 1
        );

        startDate.min =
            date
                .toISOString()
                .split("T")[0];
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const formData =
                new FormData(form);

            try {

                const booking =
                    await api(
                        "/bookings",
                        {
                            method: "POST",
                            body: JSON.stringify({

                                productId:
                                    formData.get(
                                        "productId"
                                    ),

                                name:
                                    formData.get(
                                        "name"
                                    ),

                                email:
                                    formData.get(
                                        "email"
                                    ),

                                phone:
                                    formData.get(
                                        "phone"
                                    ),

                                start:
                                    formData.get(
                                        "start"
                                    ),

                                duration:
                                    formData.get(
                                        "duration"
                                    ),

                                address:
                                    formData.get(
                                        "address"
                                    )
                            })
                        }
                    );

                if (fromCart) {

                    await api(
                        `/user/cart/${selected.dbId}`,
                        {
                            method: "DELETE"
                        }
                    ).catch(() => {});

                }

                await updateHeader();

                const success =
                    document.getElementById(
                        "bookingSuccess"
                    );

                if (success) {
                    success.classList.add(
                        "show"
                    );
                }

                const reference =
                    document.getElementById(
                        "bookingReference"
                    );

                if (reference) {
                    reference.textContent =
                        booking.reference;
                }

                form.reset();

                if (user) {

                    if (form.elements.name) {
                        form.elements.name.value =
                            user.name || "";
                    }

                    if (form.elements.email) {
                        form.elements.email.value =
                            user.email || "";
                    }

                    if (form.elements.phone) {
                        form.elements.phone.value =
                            user.phone || "";
                    }
                }

                if (productName) {
                    productName.value =
                        selected.name;
                }

            } catch (error) {

                showToast(
                    error.message,
                    "error"
                );
            }
        }
    );
}

/* =========================================================
   LOGIN / REGISTER
   ========================================================= */

function setupAuth() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    /* -------------------------
       REGISTER
       ------------------------- */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const formData =
                    new FormData(
                        registerForm
                    );

                if (
                    formData.get(
                        "password"
                    ) !==
                    formData.get(
                        "confirm"
                    )
                ) {

                    showToast(
                        "Passwords do not match",
                        "error"
                    );

                    return;
                }

                try {

                    const result =
                        await api(
                            "/auth/register",
                            {
                                method: "POST",
                                body:
                                    JSON.stringify({

                                        name:
                                            formData.get(
                                                "name"
                                            ),

                                        email:
                                            formData.get(
                                                "email"
                                            ),

                                        phone:
                                            formData.get(
                                                "phone"
                                            ),

                                        password:
                                            formData.get(
                                                "password"
                                            )
                                    })
                            }
                        );

                    localStorage.setItem(
                        "gadgets4u_token",
                        result.token
                    );

                    setData(
                        "gadgets4u_user",
                        result.user
                    );

                    await updateHeader();

                    showToast(
                        "Account created successfully"
                    );

                    setTimeout(() => {

                        location.href =
                            "profile.html";

                    }, 600);

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );
                }
            }
        );
    }

    /* -------------------------
       LOGIN
       ------------------------- */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const formData =
                    new FormData(
                        loginForm
                    );

                try {

                    const result =
                        await api(
                            "/auth/login",
                            {
                                method: "POST",
                                body:
                                    JSON.stringify({

                                        email:
                                            formData.get(
                                                "email"
                                            ),

                                        password:
                                            formData.get(
                                                "password"
                                            )
                                    })
                            }
                        );

                    /*
                     * SAVE JWT
                     */

                    localStorage.setItem(
                        "gadgets4u_token",
                        result.token
                    );

                    /*
                     * SAVE USER
                     */

                    setData(
                        "gadgets4u_user",
                        result.user
                    );

                    /*
                     * UPDATE HEADER
                     *
                     * This is what changes
                     * "Login / Sign Up"
                     * into:
                     *
                     * "Sanjana S / Logout"
                     */

                    await updateHeader();

                    showToast(
                        "Login successful"
                    );

                    setTimeout(() => {

                        location.href =
                            "profile.html";

                    }, 600);

                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );
                }
            }
        );
    }
}

/* =========================================================
   PROFILE
   ========================================================= */

async function renderProfile() {

    const profileName =
        document.getElementById(
            "profileName"
        );

    if (!profileName) return;

    if (!loggedIn()) {

        profileName.textContent =
            "Guest User";

        return;
    }

    try {

        const [
            profileResponse,
            bookings,
            wishlist
        ] = await Promise.all([

            api("/user/profile"),

            api("/bookings/mine"),

            getWishlist()

        ]);

        const user =
            profileResponse.user;

        setData(
            "gadgets4u_user",
            user
        );

        profileName.textContent =
            user.name;

        const email =
            document.getElementById(
                "profileEmail"
            );

        if (email) {
            email.textContent =
                user.email;
        }

        const phone =
            document.getElementById(
                "profilePhone"
            );

        if (phone) {
            phone.textContent =
                user.phone ||
                "Phone not added";
        }

        const active =
            document.getElementById(
                "activeRentals"
            );

        if (active) {

            active.textContent =
                bookings.filter(
                    booking =>
                        [
                            "Confirmed",
                            "Active"
                        ].includes(
                            booking.status
                        )
                ).length;
        }

        const completed =
            document.getElementById(
                "completedRentals"
            );

        if (completed) {

            completed.textContent =
                bookings.filter(
                    booking =>
                        booking.status ===
                        "Completed"
                ).length;
        }

        const wishlistCount =
            document.getElementById(
                "wishlistCount"
            );

        if (wishlistCount) {
            wishlistCount.textContent =
                wishlist.length;
        }

        const history =
            document.getElementById(
                "bookingHistory"
            );

        if (history) {

            history.innerHTML =
                bookings.length

                    ? bookings
                        .map(
                            booking => `

                                <div
                                    class="history-item">

                                    <div>

                                        <strong>
                                            ${
                                                booking.productName ||
                                                booking.product?.name ||
                                                "Gadget"
                                            }
                                        </strong>

                                        <span>
                                            ${
                                                new Date(
                                                    booking.start
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                            }

                                            •
                                            ${
                                                booking.duration
                                            }
                                        </span>

                                    </div>

                                    <b>
                                        ${
                                            booking.status
                                        }
                                    </b>

                                </div>
                            `
                        )
                        .join("")

                    : `
                        <p class="muted">

                            No bookings yet.

                            <a href="products.html">
                                Browse products
                            </a>

                        </p>
                    `;
        }

    } catch (error) {

        showToast(
            error.message,
            "error"
        );
    }

    /*
     * PROFILE LOGOUT BUTTON
     */

    document
        .getElementById("logoutBtn")
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                localStorage.removeItem(
                    "gadgets4u_token"
                );

                localStorage.removeItem(
                    "gadgets4u_user"
                );

                showToast(
                    "Logged out successfully"
                );

                setTimeout(() => {

                    location.href =
                        "index.html";

                }, 500);
            }
        );
}

/* =========================================================
   CONTACT FORM
   ========================================================= */

function setupContact() {

    const form =
        document.getElementById(
            "contactForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const formData =
                new FormData(form);

            try {

                await api(
                    "/contact",
                    {
                        method: "POST",
                        body: JSON.stringify({

                            name:
                                formData.get(
                                    "name"
                                ),

                            email:
                                formData.get(
                                    "email"
                                ),

                            subject:
                                formData.get(
                                    "subject"
                                ),

                            message:
                                formData.get(
                                    "message"
                                )
                        })
                    }
                );

                showToast(
                    "Thanks! Your message has been sent."
                );

                form.reset();

            } catch (error) {

                showToast(
                    error.message,
                    "error"
                );
            }
        }
    );
}

/* =========================================================
   HOME
   ========================================================= */

function setupHome() {

    document
        .querySelector(".hero button")
        ?.addEventListener(
            "click",
            () => {

                location.href =
                    "products.html";
            }
        );
}

/* =========================================================
   INITIALIZE
   ========================================================= */

async function init() {

    await loadProducts();

    setupAuth();

    setupContact();

    setupHome();

    await updateHeader();

    await renderProducts();

    await renderCart();

    await renderWishlist();

    await renderDetails();

    await setupBooking();

    await renderProfile();
}

/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);