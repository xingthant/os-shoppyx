document.addEventListener('DOMContentLoaded', async () => {
    const wishlistItemsGrid = document.getElementById('wishlist-items-grid');
    const emptyWishlistMessage = document.getElementById('empty-wishlist-message');
    const loginRequiredMessage = document.getElementById('login-required-message');

    const token = localStorage.getItem('token');
    if (!token) {
        loginRequiredMessage.classList.remove('hidden');
        return;
    }

    const fetchWishlist = async () => {
        try {
            const response = await fetch('/api/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                // Token expired or invalid
                loginRequiredMessage.classList.remove('hidden');
                return;
            }

            const items = await response.json();
            renderWishlist(items);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            wishlistItemsGrid.innerHTML = '<p>Error loading wishlist. Please try again later.</p>';
        }
    };

    const renderWishlist = (items) => {
        wishlistItemsGrid.innerHTML = '';
        if (items.length === 0) {
            emptyWishlistMessage.classList.remove('hidden');
            return;
        }

        items.forEach(item => {
            const product = item.products; // Accessing the joined product data
            const discountedPrice = (product.price * (1 - product.discount_percentage / 100)).toFixed(2);
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image_url}" alt="${product.title}">
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p class="category">${product.category}</p>
                    <div class="price-container">
                        ${product.discount_percentage > 0 
                            ? `<span class="original-price" style="text-decoration: line-through; color: #888;">$${product.price}</span>
                               <span class="discounted-price">$${discountedPrice}</span>
                               <span class="discount-badge">-${product.discount_percentage}%</span>`
                            : `<span class="price">$${product.price}</span>`}
                    </div>
                    <button class="btn remove-from-wishlist-btn" data-product-id="${product.id}">Remove from Wishlist</button>
                </div>
            `;
            wishlistItemsGrid.appendChild(productCard);
        });

        document.querySelectorAll('.remove-from-wishlist-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const productId = e.target.dataset.productId;
                if (confirm('Are you sure you want to remove this item?')) {
                    await removeFromWishlist(productId);
                    await fetchWishlist(); // Refresh the list
                }
            });
        });
    };

    const removeFromWishlist = async (productId) => {
        try {
            const response = await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.message || 'Failed to remove from wishlist.');
            }
        } catch (error) {
            console.error('Wishlist remove error:', error);
            alert('An unexpected error occurred.');
        }
    };

    fetchWishlist();
});