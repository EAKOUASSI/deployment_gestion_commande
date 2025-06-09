import React, { useState } from 'react';
import { Search, Filter, Eye, Clock, CheckCircle, Package, Truck } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
  orderTime: Date;
  deliveryAddress: string;
  phone: string;
}

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const mockOrders: Order[] = [
    {
      id: 'CMD-001',
      customer: 'Jean Dupont',
      email: 'jean@example.com',
      items: [
        { name: 'Riz Jollof', quantity: 2, price: 18.99 },
        { name: 'Chips de Plantain', quantity: 1, price: 6.99 }
      ],
      total: 44.97,
      status: 'preparing',
      orderTime: new Date(Date.now() - 1000 * 60 * 15),
      deliveryAddress: '123 Rue de la Paix, Paris 75001',
      phone: '+33 1 23 45 67 89'
    },
    {
      id: 'CMD-002',
      customer: 'Marie Martin',
      email: 'marie@example.com',
      items: [
        { name: 'Plateau Injera Éthiopien', quantity: 1, price: 24.99 },
        { name: 'Thé à l\'Hibiscus', quantity: 2, price: 4.99 }
      ],
      total: 34.97,
      status: 'confirmed',
      orderTime: new Date(Date.now() - 1000 * 60 * 8),
      deliveryAddress: '456 Avenue des Champs, Paris 75008',
      phone: '+33 1 98 76 54 32'
    },
    {
      id: 'CMD-003',
      customer: 'Pierre Durand',
      email: 'pierre@example.com',
      items: [
        { name: 'Tajine Marocain', quantity: 1, price: 22.99 }
      ],
      total: 22.99,
      status: 'ready',
      orderTime: new Date(Date.now() - 1000 * 60 * 25),
      deliveryAddress: '789 Boulevard Saint-Germain, Paris 75006',
      phone: '+33 1 45 67 89 01'
    },
    {
      id: 'CMD-004',
      customer: 'Sophie Moreau',
      email: 'sophie@example.com',
      items: [
        { name: 'Brochettes Suya', quantity: 3, price: 12.99 },
        { name: 'Pudding Malva', quantity: 2, price: 7.99 }
      ],
      total: 54.95,
      status: 'out-for-delivery',
      orderTime: new Date(Date.now() - 1000 * 60 * 35),
      deliveryAddress: '321 Rue de Rivoli, Paris 75004',
      phone: '+33 1 78 90 12 34'
    },
    {
      id: 'CMD-005',
      customer: 'David Bernard',
      email: 'david@example.com',
      items: [
        { name: 'Bobotie', quantity: 1, price: 19.99 }
      ],
      total: 19.99,
      status: 'delivered',
      orderTime: new Date(Date.now() - 1000 * 60 * 120),
      deliveryAddress: '654 Avenue Montaigne, Paris 75008',
      phone: '+33 1 32 10 98 76'
    }
  ];

  const filteredOrders = mockOrders
    .filter(order => 
      statusFilter === 'all' || order.status === statusFilter
    )
    .filter(order =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'preparing':
        return <Clock size={16} className="text-yellow-600" />;
      case 'ready':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'out-for-delivery':
        return <Truck size={16} className="text-purple-600" />;
      case 'delivered':
        return <Package size={16} className="text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-700 bg-blue-100';
      case 'preparing':
        return 'text-yellow-700 bg-yellow-100';
      case 'ready':
        return 'text-green-700 bg-green-100';
      case 'out-for-delivery':
        return 'text-purple-700 bg-purple-100';
      case 'delivered':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'confirmée';
      case 'preparing': return 'en préparation';
      case 'ready': return 'prête';
      case 'out-for-delivery': return 'en livraison';
      case 'delivered': return 'livrée';
      default: return status;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // En vrai, ceci ferait un appel API
    console.log(`Mise à jour commande ${orderId} vers statut: ${newStatus}`);
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = ['confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] as Order['status'] : null;
  };

  const getNextStatusText = (status: Order['status'] | null) => {
    if (!status) return '';
    switch (status) {
      case 'confirmed': return 'confirmer';
      case 'preparing': return 'en préparation';
      case 'ready': return 'prête';
      case 'out-for-delivery': return 'en livraison';
      case 'delivered': return 'livrée';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Gestion des Commandes</h1>
          <p className="text-neutral-600">Gérez et suivez toutes les commandes clients</p>
        </div>
        <div className="flex space-x-4">
          <button className="btn-outline">Exporter Commandes</button>
          <button className="btn-primary">Imprimer Commandes Cuisine</button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher commandes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filtre Statut */}
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tous les Statuts</option>
              <option value="confirmed">Confirmée</option>
              <option value="preparing">En Préparation</option>
              <option value="ready">Prête</option>
              <option value="out-for-delivery">En Livraison</option>
              <option value="delivered">Livrée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des Commandes */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-800">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-neutral-800">{order.customer}</div>
                      <div className="text-sm text-neutral-600">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.name} x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-800">{order.total.toFixed(2)}€</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {order.orderTime.toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Eye size={16} />
                    </button>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Mettre à Jour
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail Commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-800">Détails de la Commande</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-800">Informations Client</h3>
                    <p className="text-neutral-600">{selectedOrder.customer}</p>
                    <p className="text-neutral-600">{selectedOrder.email}</p>
                    <p className="text-neutral-600">{selectedOrder.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800">Adresse de Livraison</h3>
                    <p className="text-neutral-600">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-800">Informations Commande</h3>
                    <p className="text-neutral-600">ID Commande: {selectedOrder.id}</p>
                    <p className="text-neutral-600">
                      Heure Commande: {selectedOrder.orderTime.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">Articles de la Commande</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-neutral-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg font-bold">
                    <span>Total</span>
                    <span>{selectedOrder.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-outline flex-1"
                >
                  Fermer
                </button>
                {getNextStatus(selectedOrder.status) && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                      setSelectedOrder(null);
                    }}
                    className="btn-primary flex-1"
                  >
                    Mettre à jour vers {getNextStatusText(getNextStatus(selectedOrder.status))}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}