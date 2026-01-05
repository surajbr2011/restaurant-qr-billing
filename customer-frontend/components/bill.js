class BillComponent {
    displayBill(order) {
        // Update bill details
        document.getElementById('bill-table-number').textContent = order.tableId;
        document.getElementById('bill-order-id').textContent = order._id;
        document.getElementById('bill-total-amount').textContent = `₹${order.totalAmount}`;

        // Render bill items
        const billItemsContainer = document.getElementById('bill-items');
        billItemsContainer.innerHTML = order.items.map(item => `
            <div class="bill-item">
                <span>${item.name} (${item.quantity} × ₹${item.priceAtOrder})</span>
                <span>₹${item.priceAtOrder * item.quantity}</span>
            </div>
        `).join('');

        // Generate payment QR code
        qrGenerator.generatePaymentQR(order.totalAmount, order._id, order.tableId);

        showScreen('bill-ready-screen');
    }
}

const bill = new BillComponent();