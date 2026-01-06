import { useState } from 'react';
import { ordersAPI } from '../services/api';

const OrderCard = ({ order, onOrderUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleGenerateBill = async () => {
    setLoading(true);
    try {
      const updatedOrder = await ordersAPI.generateBill(order._id);
      onOrderUpdate(updatedOrder.data);
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Failed to generate bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=300,height=600');

    const itemsHtml = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>${item.quantity} x ${item.name}</span>
        <span>₹${item.priceAtOrder * item.quantity}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - Table ${order.tableId}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              width: 80mm; 
              padding: 10px; 
              font-size: 14px;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .header h2 { margin: 0; font-size: 20px; text-transform: uppercase; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .total { font-weight: bold; font-size: 16px; margin-top: 15px; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>RESTAURANT NAME</h2>
            <p>123 Street, City<br>Tel: +91 1234567890</p>
          </div>
          
          <div class="divider"></div>
          
          <div>
            <p><strong>Table: ${order.tableId}</strong></p>
            <p>Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            <p>Order ID: #${order._id.slice(-6).toUpperCase()}</p>
          </div>
          
          <div class="divider"></div>
          
          <div class="items">
            ${itemsHtml}
          </div>
          
          <div class="divider"></div>
          
          <div class="total">
            Total Amount: ₹${order.totalAmount}
          </div>
          
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>See you again soon.</p>
          </div>
          
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const orderTime = new Date(order.createdAt).toLocaleTimeString();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Table {order.tableId}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {totalItems} items • Ordered at {orderTime}
            </p>
            <p className="text-sm font-medium text-orange-600 mt-1">
              Total: ₹{order.totalAmount}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
              }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span className="text-gray-600">
                    ₹{item.priceAtOrder * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handlePrint}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <span className="mr-2">🖨️</span> Print
              </button>

              {order.status === 'pending' && (
                <button
                  onClick={handleGenerateBill}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Bill'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;