import React, { useState } from 'react';
import { Star, Filter, Search, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

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
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { addItem } = useCart();

  const categories = [
    { id: 'all', name: 'Tous les Plats' },
    { id: 'appetizers', name: 'Entrées' },
    { id: 'mains', name: 'Plats Principaux' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Boissons' }
  ];

  const menuItems: MenuItem[] = [
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
      dietary: ['sans-gluten']
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
      dietary: ['vegan', 'végétarien']
    },
    {
      id: '3',
      name: 'Tajine Marocain',
      description: 'Ragoût mijoté avec viande tendre, fruits secs et épices aromatiques',
      price: 22.99,
      image: 'https://images.pexels.com/photos/6107788/pexels-photo-6107788.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'mains',
      rating: 4.7,
      reviews: 156,
      spiceLevel: 'medium',
      dietary: []
    },
    {
      id: '4',
      name: 'Samosas',
      description: 'Pâtisseries croustillantes farcies aux légumes épicés ou à la viande',
      price: 8.99,
      image: 'https://images.pexels.com/photos/4110488/pexels-photo-4110488.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'appetizers',
      rating: 4.6,
      reviews: 78,
      spiceLevel: 'mild',
      dietary: ['végétarien']
    },
    {
      id: '5',
      name: 'Bobotie',
      description: 'Casserole sud-africaine de viande épicée avec garniture aux œufs',
      price: 19.99,
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'mains',
      rating: 4.5,
      reviews: 67,
      spiceLevel: 'mild',
      dietary: []
    },
    {
      id: '6',
      name: 'Chips de Plantain',
      description: 'Tranches de plantain frites croustillantes avec sauce épicée',
      price: 6.99,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'appetizers',
      rating: 4.4,
      reviews: 45,
      spiceLevel: 'mild',
      dietary: ['vegan', 'sans-gluten']
    },
    {
      id: '7',
      name: 'Pudding Malva',
      description: 'Dessert traditionnel sud-africain sucré avec crème anglaise',
      price: 7.99,
      image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'desserts',
      rating: 4.7,
      reviews: 92,
      spiceLevel: 'mild',
      dietary: ['végétarien']
    },
    {
      id: '8',
      name: 'Thé à l\'Hibiscus',
      description: 'Thé rafraîchissant aux herbes fait de fleurs d\'hibiscus séchées',
      price: 4.99,
      image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'beverages',
      rating: 4.3,
      reviews: 34,
      spiceLevel: 'mild',
      dietary: ['vegan', 'sans-gluten']
    },
    {
      id: '9',
      name: 'Brochettes Suya',
      description: 'Brochettes de viande grillée avec assaisonnement épicé aux arachides',
      price: 12.99,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'appetizers',
      rating: 4.8,
      reviews: 115,
      spiceLevel: 'hot',
      dietary: ['sans-gluten']
    },
    {
      id: '10',
      name: 'Smoothie Baobab',
      description: 'Smoothie nutritif au fruit de baobab et saveurs tropicales',
      price: 6.99,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'beverages',
      rating: 4.5,
      reviews: 28,
      spiceLevel: 'mild',
      dietary: ['vegan', 'sans-gluten']
    }
  ];

  const filteredItems = menuItems
    .filter(item => activeCategory === 'all' || item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category
    });
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'mild': return 'text-green-600 bg-green-100';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-neutral-800">Notre Menu</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Explorez nos plats africains authentiques, soigneusement préparés avec des épices traditionnelles et des méthodes de cuisson ancestrales.
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Recherche */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des plats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filtres par Catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tri */}
        <div className="flex items-center space-x-4">
          <Filter size={20} className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="name">Trier par Nom</option>
            <option value="price">Trier par Prix</option>
            <option value="rating">Trier par Note</option>
          </select>
        </div>
      </div>

      {/* Articles du Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="card overflow-hidden group">
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSpiceLevelColor(item.spiceLevel)}`}>
                  {getSpiceLevelText(item.spiceLevel)}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
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

              {/* Prix et Ajouter au Panier */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">{item.price}€</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Aucun plat trouvé</h3>
          <p className="text-neutral-600">Essayez d'ajuster vos critères de recherche ou de filtre.</p>
        </div>
      )}
    </div>
  );
}