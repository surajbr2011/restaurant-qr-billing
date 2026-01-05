class QRGenerator {
    generatePaymentQR(amount, orderId, tableId) {
        // UPI QR code format
        const upiId = 'restaurant@pay'; // Replace with actual UPI ID
        const merchantName = 'Restaurant';
        const transactionNote = `Order ${orderId} - Table ${tableId}`;
        
        const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
        
        // Clear previous QR code
        const qrContainer = document.getElementById('payment-qr-code');
        qrContainer.innerHTML = '';
        
        // Generate new QR code
        QRCode.toCanvas(qrContainer, upiString, {
            width: 200,
            height: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function(error) {
            if (error) {
                console.error('QR generation error:', error);
                qrContainer.innerHTML = '<p>Failed to generate QR code</p>';
            }
        });
    }
}

const qrGenerator = new QRGenerator();