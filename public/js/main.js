document.addEventListener('DOMContentLoaded', () => {
    const featuredGrid = document.getElementById('featured-products-grid');
    const discountGrid = document.getElementById('discount-products-grid');
    const authLink = document.getElementById('auth-link');
    const logoutBtn = document.getElementById('logout-btn');

    // Function to render a single product card
    const renderProduct = (product, container) => {
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
            </div>
        `;
        container.appendChild(productCard);
    };

    // Fetch featured products
    fetch('/api/products?featured_only=true')
        .then(res => res.json())
        .then(products => {
            products.forEach(p => renderProduct(p, featuredGrid));
        })
        .catch(err => console.error('Error fetching featured products:', err));

    // Fetch discounted products
    fetch('/api/products?discount_only=true')
        .then(res => res.json())
        .then(products => {
            products.forEach(p => renderProduct(p, discountGrid));
        })
        .catch(err => console.error('Error fetching discounted products:', err));

    // Check for user login state
    const token = localStorage.getItem('token');
    if (token) {
        authLink.textContent = 'Profile';
        authLink.href = '/profile.html'; // Create a profile page later
        logoutBtn.classList.remove('hidden');
    }

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    });
});