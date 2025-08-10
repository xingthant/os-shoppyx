document.addEventListener('DOMContentLoaded', async () => {
    const addProductForm = document.getElementById('add-product-form');
    const productListContainer = document.getElementById('product-list-container');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Simple admin check: we will assume a specific user email is the admin.
    // In a real-world app, you would have a more robust role-based system.
    if (!token || !user || user.email !== 'admin@example.com') {
        alert('You do not have permission to access this page.');
        window.location.href = '/login.html';
        return;
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            renderProductList(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            productListContainer.innerHTML = '<p>Failed to load products.</p>';
        }
    };

    const renderProductList = (products) => {
        productListContainer.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <h4>${product.title}</h4>
                <p>Price: $${product.price}</p>
                <button class="btn delete-btn" data-id="${product.id}">Delete</button>
                <button class="btn edit-btn" data-id="${product.id}">Edit</button>
            `;
            productListContainer.appendChild(productItem);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this product?')) {
                    deleteProduct(productId);
                }
            });
        });
        // TODO: Implement Edit functionality
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`/api/products?id=${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Product deleted successfully.');
                fetchProducts(); // Refresh the list
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to delete product.');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            alert('An unexpected error occurred.');
        }
    };

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newProduct = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            discount_percentage: parseInt(document.getElementById('discount-percentage').value),
            category: document.getElementById('category').value,
            image_url: document.getElementById('image-url').value,
            stock: parseInt(document.getElementById('stock').value),
            is_featured: document.getElementById('is-featured').checked,
        };

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                alert('Product added successfully.');
                addProductForm.reset();
                fetchProducts();
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to add product.');
            }
        } catch (error) {
            console.error('Add product error:', error);
            alert('An unexpected error occurred.');
        }
    });

    fetchProducts();
});