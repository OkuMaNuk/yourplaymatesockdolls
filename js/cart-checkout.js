document.addEventListener("DOMContentLoaded", function () {
    buildCartTable();
    const shippingCheckbox = document.getElementById("expedited-shipping");
    if (shippingCheckbox) {
        shippingCheckbox.addEventListener("change", updateSummary);
    }
});

function buildCartTable() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById("cart-items");

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
        updateSummary();
        return;
    }

    cart.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.name}</td>
            <td><input type="number" value="${item.quantity}" min="1" data-id="${item.id}" /></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${item.id}">❌</button></td>
        `;
        cartItemsContainer.appendChild(tr);
    });

    setupCartEvents();
    updateSummary();
}

function setupCartEvents() {
    const rows = document.querySelectorAll("#cart-items tr");

    rows.forEach(row => {
        const qtyInput = row.querySelector('input[type="number"]');
        const priceCell = row.cells[2];
        const extendedCell = row.cells[3];
        const removeBtn = row.querySelector('.remove-btn');

        qtyInput.addEventListener("input", () => {
            const unitPrice = parseFloat(priceCell.textContent.replace('$', '')) || 0;
            const quantity = parseInt(qtyInput.value) || 0;
            extendedCell.textContent = `$${(unitPrice * quantity).toFixed(2)}`;

            const productId = qtyInput.getAttribute("data-id");
            updateCartItem(productId, quantity);

            updateSummary();
        });

        removeBtn.addEventListener("click", () => {
            const productId = removeBtn.getAttribute("data-id");
            removeFromCart(productId);
            row.remove();
            updateSummary();
        });
    });
}

function updateSummary() {
    const rows = document.querySelectorAll("#cart-items tr");
    const subtotalSpan = document.querySelector(".summary-subtotal");
    const taxSpan = document.querySelector(".summary-tax");
    const shippingSpan = document.querySelector(".summary-shipping");
    const totalSpan = document.querySelector(".total-amount");

    let subtotal = 0;
    rows.forEach(row => {
        const extendedCell = row.cells[3];
        const amount = parseFloat(extendedCell.textContent.replace('$', '')) || 0;
        subtotal += amount;
    });

    const tax = +(subtotal * 0.055).toFixed(2);

    let shipping = 0;
    const shippingCheckbox = document.getElementById("expedited-shipping");
    if (shippingCheckbox && shippingCheckbox.checked) {
        shipping = 10.00;
    } else if (subtotal > 0) {
        shipping = 7.00;
    }

    const total = +(subtotal + tax + shipping).toFixed(2);

    if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    if (taxSpan) taxSpan.textContent = `$${tax.toFixed(2)}`;
    if (shippingSpan) shippingSpan.textContent = `$${shipping.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)}`;
}

// These are assumed to be already defined elsewhere in cart-manager.js
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartItem(id, quantity) {
    const cart = getCart();
    const item = cart.find(i => String(i.id) === String(id));
    if (item) {
        item.quantity = quantity;
        updateCart(cart);
    }
}

function removeFromCart(id) {
    const cart = getCart();
    const updatedCart = cart.filter(item => String(item.id) !== String(id));
    updateCart(updatedCart);
}

function clearCartAndReload() {
    localStorage.removeItem('cart');
    location.reload();
}

