class MenuComponent {
    constructor() {
        this.menuItems = [];
        this.filteredItems = [];
        this.currentCategory = 'all';
    }

    async loadMenu() {
        try {
            console.log('Fetching menu...');
            const items = await apiService.getMenu();
            console.log('Menu fetched:', items);

            if (!Array.isArray(items)) {
                throw new Error('Invalid menu data format: expected array');
            }

            this.menuItems = items;
            this.filteredItems = this.menuItems;
            this.renderMenu();
            this.setupCategoryFilters();
            showScreen('menu-screen');
        } catch (error) {
            console.error('Error loading menu:', error);
            alert('Failed to load menu: ' + error.message);
        }
    }

    renderMenu() {
        const menuContainer = document.getElementById('menu-items');

        if (this.filteredItems.length === 0) {
            menuContainer.innerHTML = '<p class="no-items">No items found in this category.</p>';
            return;
        }

        menuContainer.innerHTML = this.filteredItems.map(item => `
            <div class="menu-item" data-item-id="${item._id}">
                <div class="menu-item-info">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-description">${item.description}</div>
                    <div class="menu-item-price">₹${item.price}</div>
                </div>
                <div class="menu-item-actions">
                    <button class="quantity-btn minus" onclick="cart.decreaseQuantity('${item._id}')">-</button>
                    <span class="quantity-display" id="quantity-${item._id}">0</span>
                    <button class="quantity-btn plus" onclick="cart.increaseQuantity('${item._id}')">+</button>
                </div>
            </div>
        `).join('');
    }

    setupCategoryFilters() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                this.currentCategory = btn.dataset.category;
                if (this.currentCategory === 'all') {
                    this.filteredItems = this.menuItems;
                } else {
                    this.filteredItems = this.menuItems.filter(item =>
                        item.category === this.currentCategory
                    );
                }

                this.renderMenu();
            });
        });
    }
}

const menu = new MenuComponent();