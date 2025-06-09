import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Truck, MapPin, Phone, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: Date;
  createdAt: Date;
  deliveryAddress?: string;
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Charger les commandes depuis localStorage (en vrai, ce serait depuis l'API)
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const parsedOrders = savedOrders.map((order: any) => ({
      ...order,
      estimatedDelivery: new Date(order.estimatedDelivery),
      createdAt: new Date(order.createdAt)
    }));
    setOrders(parsedOrders);
  }, []);

  const statusSteps = [
    { key: 'confirmed', label: 'Commande Confirmée', icon: CheckCircle },
    { key: 'preparing', label: 'En Préparation', icon: Clock },
    { key: 'ready', label: 'Prête', icon: CheckCircle },
    { key: 'out-for-delivery', label: 'En Livraison', icon: Truck },
    { key: 'delivered', label: 'Livrée', icon: CheckCircle }
  ];

  const getStatusColor = (status: string, currentStatus: string) => {
    const statusIndex = statusSteps.findIndex(step => step.key === status);
    const currentIndex = statusSteps.findIndex(step => step.key === currentStatus);
    
    if (statusIndex <= currentIndex) {
      return 'text-primary-600 bg-primary-100';
    }
    return 'text-gray-400 bg-gray-100';
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Votre commande a été confirmée et envoyée en cuisine.';
      case 'preparing':
        return 'Nos chefs préparent soigneusement vos délicieux plats africains.';
      case 'ready':
        return 'Votre commande est prête pour le retrait ou la livraison.';
      case 'out-for-delivery':
        return 'Votre commande est en route vers vous !';
      case 'delivered':
        return 'Votre commande a été livrée. Bon appétit !';
      default:
        return '';
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock size={48} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-neutral-800">Suivez Vos Commandes</h2>
            <p className="text-lg text-neutral-600 max-w-md mx-auto">
              Veuillez vous connecter pour voir et suivre vos commandes.
            </p>
          </div>
          <Link to="/login" className="btn-primary">
            Se Connecter
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock size={48} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-neutral-800">Aucune Commande</h2>
            <p className="text-lg text-neutral-600 max-w-md mx-auto">
              Vous n'avez pas encore passé de commandes. Commencez à explorer notre délicieux menu africain !
            </p>
          </div>
          <Link to="/menu" className="btn-primary">
            Parcourir le Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-neutral-800">Suivez Vos Commandes</h1>
        <p className="text-lg text-neutral-600">
          Restez informé du statut de vos délicieuses commandes de cuisine africaine.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card p-6 space-y-6">
            {/* En-tête de Commande */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-xl font-semibold text-neutral-800">Commande #{order.id}</h3>
                <p className="text-sm text-neutral-600">
                  Passée le {order.createdAt.toLocaleDateString()} à {order.createdAt.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{order.total.toFixed(2)}€</p>
                <p className="text-sm text-neutral-600">
                  Livraison estimée : {order.estimatedDelivery.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Progression du Statut */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(step.key, order.status)}`}>
                        <IconComponent size={20} />
                      </div>
                      <span className="text-xs text-center font-medium">{step.label}</span>
                      {index < statusSteps.length - 1 && (
                        <div className="hidden sm:block w-full h-0.5 bg-gray-200 absolute top-6 left-1/2 transform translate-x-6" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-accent-50 p-4 rounded-lg">
                <p className="text-accent-800 font-medium">{getStatusMessage(order.status)}</p>
              </div>
            </div>

            {/* Articles de Commande */}
            <div className="space-y-3">
              <h4 className="font-semibold text-neutral-800">Articles de la Commande</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-neutral-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <button className="btn-outline flex items-center justify-center">
                <Phone size={18} className="mr-2" />
                Contacter le Restaurant
              </button>
              <button className="btn-outline flex items-center justify-center">
                <MapPin size={18} className="mr-2" />
                Suivre sur la Carte
              </button>
              {order.status === 'delivered' && (
                <button className="btn-primary flex items-center justify-center">
                  <Star size={18} className="mr-2" />
                  Noter la Commande
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}