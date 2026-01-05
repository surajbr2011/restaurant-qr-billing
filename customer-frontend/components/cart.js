class CartComponent {
    constructor() {
        this.items = new Map(); // itemId -> {item, quantity}
        this.updateCartDisplay();
    }

    increaseQuantity(itemId) {
        const currentQty = this.items.get(itemId)?.quantity || 0;
        this.items.set(itemId, {
            item: this.items.get(itemId)?.item || menu.menuItems.find(m => m._id === itemId),
            quantity: currentQty + 1
        });
        this.updateCartDisplay();
    }

    decreaseQuantity(itemId) {
        const current = this.items.get(itemId);
        if (!current) return;

        if (current.quantity > 1) {
            this.items.set(itemId, {
                ...current,
                quantity: current.quantity - 1
            });
        } else {
            this.items.delete(itemId);
        }
        this.updateCartDisplay();
    }

    removeItem(itemId) {
        this.items.delete(itemId);
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        // Update quantity displays in menu
        this.items.forEach((value, itemId) => {
            const display = document.getElementById(`quantity-${itemId}`);
            if (display) {
                display.textContent = value.quantity;
            }
        });

        // Reset quantities for items not in cart
        menu.menuItems.forEach(item => {
            if (!this.items.has(item._id)) {
                const display = document.getElementById(`quantity-${item._id}`);
                if (display) {
                    display.textContent = '0';
                }
            }
        });

        // Update cart summary
        const totalItems = this.getTotalItems();
        const totalAmount = this.getTotalAmount();

        document.getElementById('cart-count').textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        document.getElementById('cart-total').textContent = `Total: ₹${totalAmount}`;

        // Enable/disable view cart button
        document.getElementById('view-cart-btn').disabled = totalItems === 0;

        // Render cart items if on cart screen
        if (document.getElementById('cart-screen').classList.contains('active')) {
            this.renderCartItems();
        }
    }

    renderCartItems() {
        const cartContainer = document.getElementById('cart-items');
        const itemsArray = Array.from(this.items.values());

        if (itemsArray.length === 0) {
            cartContainer.innerHTML = '<p class="no-items">Your cart is empty</p>';
            return;
        }

        cartContainer.innerHTML = itemsArray.map(({item, quantity}) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} × ${quantity} = ₹${item.price * quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="cart.removeItem('${item._id}')">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');

        // Update order summary
        const subtotal = this.getTotalAmount();
        document.getElementById('subtotal-amount').textContent = `₹${subtotal}`;
        document.getElementById('total-amount').textContent = `₹${subtotal}`;
        document.getElementById('place-order-btn').disabled = itemsArray.length === 0;
    }

    getTotalItems() {
        return Array.from(this.items.values()).reduce((total, {quantity}) => total + quantity, 0);
    }

    getTotalAmount() {
        return Array.from(this.items.values()).reduce((total, {item, quantity}) => 
            total + (item.price * quantity), 0
        );
    }

    getCartData() {
        return Array.from(this.items.entries()).map(([itemId, {quantity}]) => ({
            itemId,
            quantity
        }));
    }

    clear() {
        this.items.clear();
        this.updateCartDisplay();
    }
}

const cart = new CartComponent();