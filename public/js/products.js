document.addEventListener('DOMContentLoaded', async () => {
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const discountOnly = document.getElementById('discount-only');
    const featuredOnly = document.getElementById('featured-only');
    const sortBy = document.getElementById('sort-by');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    
    let allProducts = [];

    const fetchProducts = async () => {
        const urlParams = new URLSearchParams();
        if (searchInput.value) urlParams.append('search', searchInput.value);
        if (categoryFilter.value) urlParams.append('category', categoryFilter.value);
        if (discountOnly.checked) urlParams.append('discount_only', 'true');
        if (featuredOnly.checked) urlParams.append('featured_only', 'true');
        if (sortBy.value) urlParams.append('sort', sortBy.value);

        try {
            const response = await fetch(`/api/products?${urlParams.toString()}`);
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            productsGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
    };

    const renderProducts = (products) => {
        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p>No products found matching your criteria.</p>';
            return;
        }
        products.forEach(product => {
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
                    <button class="btn add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    <button class="btn add-to-wishlist-btn" data-product-id="${product.id}">Add to Wishlist</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
        document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToWishlist(productId);
            });
        });
    };

    const addToCart = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (cart[productId]) {
            cart[productId].qty += 1;
        } else {
            cart[productId] = { qty: 1 };
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
    };

    const addToWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to add products to your wishlist.');
            return;
        }
        
        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });got

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {gi
                alert(result.message || 'Failed to add to wishlist.');
            }
        } catch (error) {
            console.error('Wishlist add error:', error);
            alert('An unexpected error occurred.');
        }
    };
    
    applyFiltersBtn.addEventListener('click', fetchProducts);
    
    // Initial fetch
    fetchProducts();
});