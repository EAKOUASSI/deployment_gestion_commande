import React, { useState } from 'react';
import { Search, Plus, Edit, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
}

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const categories = ['all', 'vegetables', 'spices', 'grains', 'proteins', 'oils', 'beverages'];

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Plantain',
      category: 'vegetables',
      currentStock: 12,
      minimumStock: 20,
      unit: 'kg',
      costPerUnit: 2.50,
      supplier: 'Fresh Produce Co.',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4)
    },
    {
      id: '2',
      name: 'Huile de Palme',
      category: 'oils',
      currentStock: 3,
      minimumStock: 10,
      unit: 'bouteilles',
      costPerUnit: 8.99,
      supplier: 'African Imports Ltd.',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    },
    {
      id: '3',
      name: 'Riz Jollof',
      category: 'grains',
      currentStock: 25,
      minimumStock: 15,
      unit: 'kg',
      costPerUnit: 3.20,
      supplier: 'Grain Suppliers Inc.',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
      id: '4',
      name: 'Piments Scotch Bonnet',
      category: 'spices',
      currentStock: 5,
      minimumStock: 12,
      unit: 'kg',
      costPerUnit: 12.50,
      supplier: 'Spice World',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    },
    {
      id: '5',
      name: 'Farine d\'Igname',
      category: 'grains',
      currentStock: 8,
      minimumStock: 15,
      unit: 'sacs',
      costPerUnit: 15.00,
      supplier: 'African Imports Ltd.',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    },
    {
      id: '6',
      name: 'Viande de Chèvre',
      category: 'proteins',
      currentStock: 18,
      minimumStock: 10,
      unit: 'kg',
      costPerUnit: 18.50,
      supplier: 'Premium Meats',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    currentStock: '',
    minimumStock: '',
    unit: '',
    costPerUnit: '',
    supplier: '',
    expiryDate: ''
  });

  const filteredItems = inventoryItems
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minimumStock);
  const expiringItems = inventoryItems.filter(item => 
    item.expiryDate && item.expiryDate <= new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: InventoryItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: formData.name,
      category: formData.category,
      currentStock: parseInt(formData.currentStock),
      minimumStock: parseInt(formData.minimumStock),
      unit: formData.unit,
      costPerUnit: parseFloat(formData.costPerUnit),
      supplier: formData.supplier,
      lastRestocked: editingItem ? editingItem.lastRestocked : new Date(),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
    };

    if (editingItem) {
      setInventoryItems(items => items.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setInventoryItems(items => [...items, newItem]);
    }

    closeModal();
  };

  const openModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        currentStock: item.currentStock.toString(),
        minimumStock: item.minimumStock.toString(),
        unit: item.unit,
        costPerUnit: item.costPerUnit.toString(),
        supplier: item.supplier,
        expiryDate: item.expiryDate ? item.expiryDate.toISOString().split('T')[0] : ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: 'vegetables',
        currentStock: '',
        minimumStock: '',
        unit: '',
        costPerUnit: '',
        supplier: '',
        expiryDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const updateStock = (id: string, newStock: number) => {
    setInventoryItems(items =>
      items.map(item =>
        item.id === id 
          ? { ...item, currentStock: newStock, lastRestocked: new Date() }
          : item
      )
    );
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minimumStock) {
      return { status: 'low', color: 'text-red-600 bg-red-100', icon: TrendingDown };
    } else if (item.currentStock <= item.minimumStock * 1.5) {
      return { status: 'medium', color: 'text-yellow-600 bg-yellow-100', icon: TrendingDown };
    } else {
      return { status: 'good', color: 'text-green-600 bg-green-100', icon: TrendingUp };
    }
  };

  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'vegetables': return 'Légumes';
      case 'spices': return 'Épices';
      case 'grains': return 'Céréales';
      case 'proteins': return 'Protéines';
      case 'oils': return 'Huiles';
      case 'beverages': return 'Boissons';
      default: return category;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Gestion de l'Inventaire</h1>
          <p className="text-neutral-600">Suivez et gérez l'inventaire de votre restaurant</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Ajouter un Article</span>
        </button>
      </div>

      {/* Cartes d'Alerte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerte Stock Faible */}
        <div className="card p-6 border-l-4 border-red-500">
          <div className="flex items-center space-x-3">
            <AlertTriangle size={24} className="text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-neutral-800">Alerte Stock Faible</h3>
              <p className="text-sm text-neutral-600">
                {lowStockItems.length} articles nécessitent un réapprovisionnement
              </p>
            </div>
          </div>
          {lowStockItems.length > 0 && (
            <div className="mt-4 space-y-2">
              {lowStockItems.slice(0, 3).map(item => (
                <div key={item.id} className="text-sm text-neutral-600">
                  {item.name}: {item.currentStock} {item.unit} (min: {item.minimumStock})
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <div className="text-sm text-neutral-500">
                  +{lowStockItems.length - 3} autres articles
                </div>
              )}
            </div>
          )}
        </div>

        {/* Articles Expirant Bientôt */}
        <div className="card p-6 border-l-4 border-yellow-500">
          <div className="flex items-center space-x-3">
            <Package size={24} className="text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-neutral-800">Expire Bientôt</h3>
              <p className="text-sm text-neutral-600">
                {expiringItems.length} articles expirent dans 7 jours
              </p>
            </div>
          </div>
          {expiringItems.length > 0 && (
            <div className="mt-4 space-y-2">
              {expiringItems.slice(0, 3).map(item => (
                <div key={item.id} className="text-sm text-neutral-600">
                  {item.name}: expire le {item.expiryDate?.toLocaleDateString()}
                </div>
              ))}
              {expiringItems.length > 3 && (
                <div className="text-sm text-neutral-500">
                  +{expiringItems.length - 3} autres articles
                </div>
              )}
            </div>
          )}
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
              placeholder="Rechercher inventaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filtre Catégorie */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les Catégories</option>
            <option value="vegetables">Légumes</option>
            <option value="spices">Épices</option>
            <option value="grains">Céréales</option>
            <option value="proteins">Protéines</option>
            <option value="oils">Huiles</option>
            <option value="beverages">Boissons</option>
          </select>
        </div>
      </div>

      {/* Tableau Inventaire */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût/Unité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                const StatusIcon = stockStatus.icon;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-800">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {getCategoryText(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium">{item.currentStock} {item.unit}</div>
                        <div className="text-gray-500">Min: {item.minimumStock}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <StatusIcon size={16} />
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.status === 'low' ? 'Faible' : stockStatus.status === 'medium' ? 'Moyen' : 'Bon'}
                        </span>
                        {isExpiringSoon(item) && (
                          <AlertTriangle size={16} className="text-yellow-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                      {item.costPerUnit.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {item.expiryDate ? item.expiryDate.toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          const newStock = prompt(`Mettre à jour le stock pour ${item.name} (actuel: ${item.currentStock} ${item.unit}):`);
                          if (newStock && !isNaN(parseInt(newStock))) {
                            updateStock(item.id, parseInt(newStock));
                          }
                        }}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Réapprovisionner
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajouter/Modifier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-800">
                  {editingItem ? 'Modifier l\'Article d\'Inventaire' : 'Ajouter un Nouvel Article d\'Inventaire'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nom de l'Article
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="input-field"
                    >
                      <option value="vegetables">Légumes</option>
                      <option value="spices">Épices</option>
                      <option value="grains">Céréales</option>
                      <option value="proteins">Protéines</option>
                      <option value="oils">Huiles</option>
                      <option value="beverages">Boissons</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Stock Actuel
                    </label>
                    <input
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentStock: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Stock Minimum
                    </label>
                    <input
                      type="number"
                      value={formData.minimumStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimumStock: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Unité
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="input-field"
                      placeholder="kg, bouteilles, sacs, etc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Coût par Unité (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Fournisseur
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date d'Expiration (Optionnel)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline flex-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingItem ? 'Mettre à Jour l\'Article' : 'Ajouter l\'Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}