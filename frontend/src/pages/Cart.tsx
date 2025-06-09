import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = 3.99;
  const tax = total * 0.20; // TVA 20%
  const finalTotal = total + deliveryFee + tax;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsProcessing(true);
    
    // Simuler le traitement de la commande
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Créer une commande fictive
    const order = {
      id: `CMD-${Date.now()}`,
      items,
      total: finalTotal,
      status: 'confirmed',
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      createdAt: new Date()
    };
    
    // Sauvegarder dans localStorage (en vrai, ce serait envoyé au backend)
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));
    
    clearCart();
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-neutral-800">Votre panier est vide</h2>
            <p className="text-lg text-neutral-600 max-w-md mx-auto">
              Il semble que vous n'ayez pas encore ajouté de délicieux plats africains à votre panier.
            </p>
          </div>
          <Link to="/menu" className="btn-primary inline-flex items-center">
            <ArrowLeft size={18} className="mr-2" />
            Parcourir le Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles du Panier */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-neutral-800">Panier d'Achat</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
            >
              <Trash2 size={16} />
              <span>Vider le Panier</span>
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800">{item.name}</h3>
                        <p className="text-sm text-neutral-600 capitalize">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          {(item.price * item.quantity).toFixed(2)}€
                        </p>
                        <p className="text-sm text-neutral-500">
                          {item.price.toFixed(2)}€ chacun
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé de Commande */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">Résumé de Commande</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Sous-total</span>
                <span className="font-medium">{total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Frais de livraison</span>
                <span className="font-medium">{deliveryFee.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">TVA (20%)</span>
                <span className="font-medium">{tax.toFixed(2)}€</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-neutral-800">Total</span>
                <span className="text-lg font-bold text-primary-600">{finalTotal.toFixed(2)}€</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Traitement...' : 'Procéder au Paiement'}
            </button>

            {!user && (
              <p className="text-sm text-neutral-600 text-center">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Connectez-vous
                </Link>
                {' '}ou{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  créez un compte
                </Link>
                {' '}pour commander
              </p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-neutral-800 mb-3">Informations de Livraison</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Livraison standard : 30-45 minutes</p>
              <p>• Livraison express : 15-20 minutes (+2,99€)</p>
              <p>• Livraison gratuite sur commandes de plus de 50€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}