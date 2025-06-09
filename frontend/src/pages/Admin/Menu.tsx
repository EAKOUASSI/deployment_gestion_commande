import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Star } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  spiceLevel: 'mild' | 'medium' | 'hot';
  dietary: string[];
  available: boolean;
}

export default function AdminMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = ['all', 'appetizers', 'mains', 'desserts', 'beverages'];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Riz Jollof',
      description: 'Riz épicé ouest-africain avec légumes et votre choix de protéine',
      price: 18.99,
      image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'mains',
      rating: 4.8,
      reviews: 124,
      spiceLevel: 'medium',
      dietary: ['sans-gluten'],
      available: true
    },
    {
      id: '2',
      name: 'Plateau Injera Éthiopien',
      description: 'Pain plat traditionnel au levain servi avec divers ragoûts et légumes',
      price: 24.99,
      image: 'https://images.pexels.com/photos/5737327/pexels-photo-5737327.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'mains',
      rating: 4.9,
      reviews: 89,
      spiceLevel: 'hot',
      dietary: ['vegan', 'végétarien'],
      available: true
    },
    {
      id: '3',
      name: 'Samosas',
      description: 'Pâtisseries croustillantes farcies aux légumes épicés ou à la viande',
      price: 8.99,
      image: 'https://images.pexels.com/photos/4110488/pexels-photo-4110488.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'appetizers',
      rating: 4.6,
      reviews: 78,
      spiceLevel: 'mild',
      dietary: ['végétarien'],
      available: false
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'mains',
    spiceLevel: 'mild' as const,
    dietary: [] as string[],
    available: true
  });

  const filteredItems = menuItems
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      spiceLevel: formData.spiceLevel,
      dietary: formData.dietary,
      available: formData.available,
      rating: editingItem ? editingItem.rating : 0,
      reviews: editingItem ? editingItem.reviews : 0
    };

    if (editingItem) {
      setMenuItems(items => items.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setMenuItems(items => [...items, newItem]);
    }

    closeModal();
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        image: item.image,
        category: item.category,
        spiceLevel: item.spiceLevel,
        dietary: item.dietary,
        available: item.available
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'mains',
        spiceLevel: 'mild',
        dietary: [],
        available: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleDietaryChange = (dietary: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(dietary)
        ? prev.dietary.filter(d => d !== dietary)
        : [...prev.dietary, dietary]
    }));
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'mild': return  'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hot': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSpiceLevelText = (level: string) => {
    switch (level) {
      case 'mild': return 'Doux';
      case 'medium': return 'Moyen';
      case 'hot': return 'Épicé';
      default: return level;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'appetizers': return 'Entrées';
      case 'mains': return 'Plats Principaux';
      case 'desserts': return 'Desserts';
      case 'beverages': return 'Boissons';
      default: return category;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Gestion du Menu</h1>
          <p className="text-neutral-600">Ajoutez, modifiez et gérez les articles de votre menu de restaurant</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Ajouter un Article</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher articles du menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filtre Catégorie */}
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Toutes les Catégories</option>
              <option value="appetizers">Entrées</option>
              <option value="mains">Plats Principaux</option>
              <option value="desserts">Desserts</option>
              <option value="beverages">Boissons</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille Articles Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className={`card overflow-hidden ${!item.available ? 'opacity-60' : ''}`}>
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSpiceLevelColor(item.spiceLevel)}`}>
                  {getSpiceLevelText(item.spiceLevel)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.available
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.available ? 'Disponible' : 'Indisponible'}
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-neutral-800">{item.name}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{item.description}</p>
              </div>

              {/* Tags Diététiques */}
              {item.dietary.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.dietary.map((diet) => (
                    <span
                      key={diet}
                      className="px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              )}

              {/* Note et Avis */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="font-medium">{item.rating}</span>
                </div>
                <span className="text-gray-500">({item.reviews} avis)</span>
              </div>

              {/* Prix et Actions */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">{item.price}€</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajouter/Modifier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-800">
                  {editingItem ? 'Modifier l\'Article' : 'Ajouter un Nouvel Article'}
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
                      Nom
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
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field h-24 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    URL de l'Image
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="input-field"
                    >
                      <option value="appetizers">Entrées</option>
                      <option value="mains">Plats Principaux</option>
                      <option value="desserts">Desserts</option>
                      <option value="beverages">Boissons</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Niveau d'Épice
                    </label>
                    <select
                      value={formData.spiceLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, spiceLevel: e.target.value as 'mild' | 'medium' | 'hot' }))}
                      className="input-field"
                    >
                      <option value="mild">Doux</option>
                      <option value="medium">Moyen</option>
                      <option value="hot">Épicé</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Options Diététiques
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['végétarien', 'vegan', 'sans-gluten', 'sans-lactose'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dietary.includes(option)}
                          onChange={() => handleDietaryChange(option)}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-neutral-700 capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Disponible pour commande</span>
                  </label>
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
                    {editingItem ? 'Mettre à Jour' : 'Ajouter l\'Article'}
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