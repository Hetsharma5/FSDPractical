// ==================== CART MANAGEMENT ====================
let cart = [];

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Add item to cart
function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(price),
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${productName} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
}

// Update cart in localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Calculate and display total price
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
}

// Display cart items in modal
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        totalPriceElement.textContent = '0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: <span class="item-quantity">${item.quantity}</span></p>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    totalPriceElement.textContent = calculateTotal();
}

// Show notification when item is added
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== PRODUCT FILTERING ====================
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter products
            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filterValue) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// ==================== CART MODAL FUNCTIONALITY ====================
function setupCartModal() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close-btn');

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            displayCartItems();
            cartModal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        window.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
}

// ==================== ADD TO CART BUTTONS ====================
function setupAddToCartButtons() {
    const addCartButtons = document.querySelectorAll('.add-cart-btn');

    addCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            const price = button.getAttribute('data-price');
            const productName = button.closest('.product-card').querySelector('.product-name').textContent;

            addToCart(productId, productName, price);
        });
    });
}

// ==================== DYNAMIC PRICE UPDATES ====================
function setupPriceUpdates() {
    const priceElements = document.querySelectorAll('.current-price');

    // Simulate dynamic price updates every 30 seconds (optional)
    setInterval(() => {
        priceElements.forEach(priceElement => {
            const currentPrice = parseFloat(priceElement.textContent);
            // Random price variation (±5%)
            const variation = (Math.random() - 0.5) * 0.1 * currentPrice;
            const newPrice = (currentPrice + variation).toFixed(2);
            
            // Only update if price changed and is positive
            if (newPrice > 0 && newPrice !== currentPrice) {
                priceElement.textContent = newPrice;
                priceElement.closest('.add-cart-btn').setAttribute('data-price', newPrice);
                addPriceUpdateAnimation(priceElement);
            }
        });
    }, 30000); // Update every 30 seconds
}

// Add animation to price update
function addPriceUpdateAnimation(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'priceFlash 0.5s ease';
    }, 10);
}

// ==================== RESPONSIVE NAVIGATION ====================
function setupResponsiveNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// ==================== LOGIN FORM HANDLING ====================
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            // Simple validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Store login info (for demo purposes)
            if (remember) {
                localStorage.setItem('userEmail', email);
            }

            // Show success message
            showNotification('Login successful! Redirecting...');

            // Redirect to home after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
}

// ==================== LOAD SAVED LOGIN EMAIL ====================
function loadSavedEmail() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            document.getElementById('remember').checked = true;
        }
    }
}

// ==================== QUANTITY UPDATE IN CART ====================
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            displayCartItems();
        }
    }
}

// ==================== ANIMATION STYLES ====================
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes priceFlash {
            0% {
                background-color: #fef3c7;
            }
            100% {
                background-color: transparent;
            }
        }

        @media (max-width: 480px) {
            @keyframes slideInRight {
                from {
                    transform: translateX(200px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(200px);
                    opacity: 0;
                }
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== INITIALIZE ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    initCart();
    setupProductFilters();
    setupCartModal();
    setupAddToCartButtons();
    setupPriceUpdates();
    setupResponsiveNav();
    setupLoginForm();
    loadSavedEmail();
});

// ==================== CHECKOUT BUTTON ====================
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const total = calculateTotal();
            alert(`Proceeding to checkout with total: $${total}`);
            // In a real application, this would redirect to a checkout page
        });
    }
});
