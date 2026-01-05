import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import OrderCard from './OrderCard';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Set up socket for real-time updates
  useSocket({
    new_order: (newOrder) => {
      console.log('New order received:', newOrder);
      setOrders(prev => [newOrder, ...prev]);
    }
  });

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getPendingOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prev => 
      prev.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  const filteredOrders = orders.filter(order => 
    activeTab === 'pending' ? order.status === 'pending' : order.status === 'billed'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage and track customer orders in real-time</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Orders
            <span className="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('billed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'billed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Billed Orders
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {orders.filter(o => o.status === 'billed').length}
            </span>
          </button>
        </nav>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} orders
          </h3>
          <p className="text-gray-600">
            {activeTab === 'pending' 
              ? 'New orders will appear here automatically.' 
              : 'Billed orders will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onOrderUpdate={handleOrderUpdate}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Total Orders</h3>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">⏱️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Pending</h3>
              <p className="text-2xl font-semibold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Billed</h3>
              <p className="text-2xl font-semibold text-green-600">
                {orders.filter(o => o.status === 'billed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;