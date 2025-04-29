// cart-manager.js

// Retrieve cart from Local Storage, or create an empty one
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save the updated cart back to Local Storage
function updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add a new product to the cart
function addToCart(product) {
    const cart = getCart();

    // Check if product already exists
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new item
    }

    updateCart(cart);
    showToast(`${product.name} added to cart!`);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000); // 2 seconds
}

// Clear the entire cart
function clearCart() {
    localStorage.removeItem('cart');
}
