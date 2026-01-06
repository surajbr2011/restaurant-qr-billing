// Configuration - Dynamically set or load from external config
const CONFIG = {
    API_URL: window.APP_CONFIG?.API_URL || 'https://restaurant-qr-billing.onrender.com',

    SOCKET_URL: window.APP_CONFIG?.API_URL || 'https://restaurant-qr-billing.onrender.com'
};

// Global variables
let currentTableId = null;
let currentSession = null;
let currentOrder = null;
let socket = null;
let sessionToken = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

async function initializeApp() {
    // Get QR token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const qrToken = urlParams.get('token');

    console.log('[customer] initializeApp: url token=', qrToken);

    if (!qrToken) {
        console.warn('[customer] No token found in URL');
        showError('Invalid access. Please scan the QR code on your table.');
        return;
    }

    // Show loading screen
    showScreen('loading-screen');

    try {
        // Load Socket.IO library
        await loadSocketIOScript();

        // Validate QR code
        console.log('[customer] validating token...');
        const validation = await validateQRCode(qrToken);
        console.log('[customer] validateQRCode response=', validation);

        if (!validation || !validation.valid) {
            console.warn('[customer] token validation failed', validation);
            showError(validation?.message || 'Invalid QR code');
            return;
        }

        // Store table info
        currentTableId = validation.data.tableId;

        // Show login screen
        showLoginScreen(validation.data, qrToken);

    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to connect: ' + (error.message || 'Unknown error'));
        // If script loading failed, we can't do much.
    }
}

function loadSocketIOScript() {
    return new Promise((resolve, reject) => {
        if (typeof io !== 'undefined') {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `${CONFIG.API_URL}/socket.io/socket.io.js`;
        script.onload = () => {
            console.log('Socket.IO script loaded successfully');
            resolve();
        };
        script.onerror = () => {
            console.error('Failed to load Socket.IO script from', script.src);
            // Fallback to CDN if local fails (optional, but good for redundancy)
            const cdnScript = document.createElement('script');
            cdnScript.src = "https://cdn.socket.io/4.5.4/socket.io.min.js";
            cdnScript.onload = () => {
                console.log('Socket.IO script loaded from CDN');
                resolve();
            };
            cdnScript.onerror = () => reject(new Error('Failed to load Socket.IO library'));
            document.head.appendChild(cdnScript);
        };
        document.head.appendChild(script);
    });
}

async function validateQRCode(token) {
    try {
        console.log('[customer] POST', `${CONFIG.API_URL}/api/qrcode/validate`);
        const response = await fetch(`${CONFIG.API_URL}/api/qrcode/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        const json = await response.json();
        console.log('[customer] validateQRCode raw response ok=', response.ok, json);
        return json;
    } catch (err) {
        console.error('[customer] validateQRCode error', err);
        return { valid: false, message: 'Network error' };
    }
}

function showLoginScreen(tableData, qrToken) {
    // Create login screen if it doesn't exist
    let loginScreen = document.getElementById('login-screen');

    if (!loginScreen) {
        loginScreen = createLoginScreen();
        document.querySelector('.app-container').appendChild(loginScreen);
    }

    console.log('[customer] showLoginScreen', tableData);

    // Update table info
    document.getElementById('login-table-id').textContent = tableData.tableId;
    document.getElementById('login-room-id').textContent = tableData.roomId || 'Main Hall';
    document.getElementById('login-zone').textContent = capitalizeFirst(tableData.zone);

    // Store QR token
    loginScreen.dataset.qrToken = qrToken;

    showScreen('login-screen');
}

function createLoginScreen() {
    const screen = document.createElement('div');
    screen.id = 'login-screen';
    screen.className = 'screen';
    screen.innerHTML = `
        <div class="login-container">
            <h2>🍽️ Welcome!</h2>
            <div class="table-info-card">
                <p><strong>Table:</strong> <span id="login-table-id"></span></p>
                <p><strong>Room:</strong> <span id="login-room-id"></span></p>
                <p><strong>Zone:</strong> <span id="login-zone"></span></p>
            </div>
            
            <form id="login-form">
                <input type="text" id="customer-name" placeholder="Your Name (Optional)">
                <input type="tel" id="customer-phone" placeholder="Phone Number (Optional)">
                <input type="number" id="guest-count" placeholder="Number of Guests" min="1" value="1" required>
                <button type="submit" class="btn-primary">Start Ordering</button>
            </form>
            
            <button id="skip-login" class="btn-secondary">Continue as Guest</button>
        </div>
    `;

    // Add event listeners immediately
    const loginForm = screen.querySelector('#login-form');
    const skipBtn = screen.querySelector('#skip-login');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (skipBtn) skipBtn.addEventListener('click', () => handleLogin(null, true));

    console.log('[customer] createLoginScreen: listeners attached');

    return screen;
}

async function handleLogin(event, skipForm = false) {
    if (event) event.preventDefault();

    const loginScreen = document.getElementById('login-screen');
    const qrToken = loginScreen.dataset.qrToken;
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const skipBtn = document.getElementById('skip-login');

    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining...';
    }
    if (skipBtn) skipBtn.disabled = true;

    const loginData = {
        qrToken,
        customerName: skipForm ? null : document.getElementById('customer-name').value,
        customerPhone: skipForm ? null : document.getElementById('customer-phone').value,
        guestCount: skipForm ? 1 : parseInt(document.getElementById('guest-count').value)
    };

    try {
        console.log('[customer] Logging in with:', loginData);
        const response = await fetch(`${CONFIG.API_URL}/api/customer/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store session token
        sessionToken = data.sessionToken;
        currentSession = data.session;
        localStorage.setItem('sessionToken', sessionToken);

        // Update UI
        updateTableDisplays(currentSession);

        // Initialize socket
        try {
            initializeSocket();
        } catch (socketErr) {
            console.warn('Socket initialization failed:', socketErr);
            // Continue anyway, socket is optional for initial menu load
        }

        // Setup event listeners
        setupEventListeners();

        // Load menu (this will show the menu screen when ready)
        console.log('[customer] Loading menu...');
        await menu.loadMenu();

    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to start session: ' + error.message);

        // Reset buttons
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Start Ordering';
        }
        if (skipBtn) skipBtn.disabled = false;
    }
}

function updateTableDisplays(session) {
    // Safely update elements if they exist
    const docTitle = document.getElementById('table-number');
    if (docTitle) docTitle.textContent = session.tableId;
    else document.title = `Restaurant Order - Table ${session.tableId}`;

    const display = document.getElementById('table-number-display');
    if (display) display.textContent = session.tableId;

    const orderDisplay = document.getElementById('order-table-number');
    if (orderDisplay) orderDisplay.textContent = session.tableId;

    const billDisplay = document.getElementById('bill-table-number');
    if (billDisplay) billDisplay.textContent = session.tableId;
}

function initializeSocket() {
    socket = io(CONFIG.SOCKET_URL);

    socket.emit('join_table_room', currentSession.tableId);

    socket.on('bill_ready', (order) => {
        console.log('Bill ready received:', order);
        currentOrder = order;
        bill.displayBill(order);
    });

    socket.on('connect', () => console.log('Connected to server'));
    socket.on('disconnect', () => console.log('Disconnected from server'));
}

function setupEventListeners() {
    document.getElementById('view-cart-btn').addEventListener('click', () => {
        cart.renderCartItems();
        showScreen('cart-screen');
    });

    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
}

async function placeOrder() {
    try {
        const orderData = {
            tableId: currentSession.tableId,
            items: cart.getCartData()
        };

        // Add session token to request
        const response = await fetch(`${CONFIG.API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify(orderData)
        });

        currentOrder = await response.json();

        document.getElementById('order-id').textContent = currentOrder._id;
        document.getElementById('order-total').textContent = `₹${currentOrder.totalAmount}`;

        cart.clear();
        showScreen('order-placed-screen');

    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    }
}

function showError(message) {
    let errorScreen = document.getElementById('error-screen');

    if (!errorScreen) {
        errorScreen = document.createElement('div');
        errorScreen.id = 'error-screen';
        errorScreen.className = 'screen active';
        errorScreen.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h2>Oops!</h2>
                <p id="error-message"></p>
                <button onclick="location.reload()" class="btn-primary">Try Again</button>
            </div>
        `;
        document.querySelector('.app-container').appendChild(errorScreen);
    }

    document.getElementById('error-message').textContent = message;
    showScreen('error-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function checkPaymentStatus() {
    alert('Thank you for your payment! You can now leave the table.');
}