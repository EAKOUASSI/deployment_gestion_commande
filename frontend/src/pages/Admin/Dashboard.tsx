import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  TrendingUp,
  Star,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import fetchDashboardData from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setStats(data.stats || []);
        setRecentOrders(data.recentOrders || []);
        setLowStockItems(data.lowStockItems || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données du dashboard :", error);
      }
    };

    getDashboardData();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-800">Accès Refusé</h2>
          <p className="text-lg text-neutral-600 mt-4">
            Vous n'avez pas l'autorisation d'accéder à cette page.
          </p>
          <Link to="/" className="btn-primary mt-6">
            Retour à l'Accueil
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'preparing':
        return <Clock size={16} className="text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'out-for-delivery':
        return <Package size={16} className="text-purple-600" />;
      case 'ready':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-700 bg-green-100';
      case 'preparing':
        return 'text-yellow-700 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-700 bg-blue-100';
      case 'out-for-delivery':
        return 'text-purple-700 bg-purple-100';
      case 'ready':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'livrée';
      case 'preparing': return 'en préparation';
      case 'confirmed': return 'confirmée';
      case 'out-for-delivery': return 'en livraison';
      case 'ready': return 'prête';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Tableau de Bord Admin</h1>
          <p className="text-neutral-600">Bon retour, {user.name} !</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/admin/orders" className="btn-outline">Voir Toutes les Commandes</Link>
          <Link to="/admin/menu" className="btn-primary">Gérer le Menu</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any) => {
          const IconComponent = {
            ShoppingBag, Users, TrendingUp, Star
          }[stat.icon] || ShoppingBag;
          return (
            <div key={stat.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-800 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} ce mois
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <IconComponent size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-800">Commandes Récentes</h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Voir Tout
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-medium text-neutral-800">{order.id}</p>
                    <p className="text-sm text-neutral-600">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-800">{order.total}€</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-xs text-neutral-500">{order.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-800">Alerte Stock Faible</h2>
            <Link to="/admin/inventory" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Gérer l'Inventaire
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle size={20} className="text-red-600" />
                  <div>
                    <p className="font-medium text-neutral-800">{item.name}</p>
                    <p className="text-sm text-neutral-600">
                      {item.current} {item.unit} restant
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600 font-medium">
                    Min: {item.minimum} {item.unit}
                  </p>
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    Réapprovisionner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/menu" className="btn-outline text-center">Ajouter un Nouveau Plat</Link>
          <Link to="/admin/orders" className="btn-outline text-center">Traiter les Commandes</Link>
          <Link to="/admin/inventory" className="btn-outline text-center">Mettre à Jour l'Inventaire</Link>
          <button className="btn-outline">Générer un Rapport</button>
        </div>
      </div>
    </div>
  );
}