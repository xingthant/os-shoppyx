document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    const getCart = () => JSON.parse(localStorage.getItem('cart')) || {};

    const saveCart = (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    const renderCart = async () => {
        const cart = getCart();
        const productIds = Object.keys(cart);
        
        if (productIds.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartSummary.classList.add('hidden');
            emptyCartMessage.classList.remove('hidden');
            return;
        }

        try {
            // This is a simplified way to fetch all products for the cart.
            // A more efficient approach would be to have a dedicated endpoint.
            const response = await fetch('/api/products');
            const allProducts = await response.json();
            const cartProducts = allProducts.filter(p => productIds.includes(p.id));

            cartItemsContainer.innerHTML = '';
            let total = 0;

            cartProducts.forEach(product => {
                const itemQty = cart[product.id].qty;
                const discountedPrice = (product.price * (1 - product.discount_percentage / 100));
                const itemTotal = discountedPrice * itemQty;
                total += itemTotal;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>Price: $${discountedPrice.toFixed(2)}</p>
                    <p>Quantity: ${itemQty}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            cartTotalSpan.textContent = total.toFixed(2);
            cartSummary.classList.remove('hidden');
            emptyCartMessage.classList.add('hidden');

        } catch (error) {
            console.error('Error rendering cart:', error);
            cartItemsContainer.innerHTML = '<p>Error loading cart items.</p>';
        }
    };
    
    checkoutBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to complete your purchase.');
            window.location.href = '/login.html';
            return;
        }

        const cart = getCart();
        const cartItems = Object.entries(cart).map(([id, item]) => ({ id, qty: item.qty }));

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Checkout successful! Your order has been placed.');
                localStorage.removeItem('cart');
                window.location.href = '/';
            } else {
                alert(result.message || 'Checkout failed.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An unexpected error occurred during checkout.');
        }
    });

    renderCart();
});