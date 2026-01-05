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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.status === 'pending' 
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
              {order.status === 'pending' && (
                <button
                  onClick={handleGenerateBill}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Bill'}
                </button>
              )}
              
              {order.status === 'billed' && (
                <span className="text-green-600 text-sm font-medium">
                  Bill Sent to Customer
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;