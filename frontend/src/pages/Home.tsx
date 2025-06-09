import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Utensils, Users } from 'lucide-react';

export default function Home() {
  const featuredDishes = [
    {
      id: '1',
      name: 'Riz Jollof',
      description: 'Riz épicé ouest-africain avec légumes et votre choix de protéine',
      price: 18.99,
      image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=500',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Plateau Injera Éthiopien',
      description: 'Pain plat traditionnel au levain servi avec divers ragoûts et légumes',
      price: 24.99,
      image: 'https://images.pexels.com/photos/5737327/pexels-photo-5737327.jpeg?auto=compress&cs=tinysrgb&w=500',
      rating: 4.9
    },
    {
      id: '3',
      name: 'Tajine Marocain',
      description: 'Ragoût mijoté avec viande tendre, fruits secs et épices aromatiques',
      price: 22.99,
      image: 'https://images.pexels.com/photos/6107788/pexels-photo-6107788.jpeg?auto=compress&cs=tinysrgb&w=500',
      rating: 4.7
    }
  ];

  const stats = [
    { icon: Users, value: '10 000+', label: 'Clients Satisfaits' },
    { icon: Utensils, value: '50+', label: 'Plats Authentiques' },
    { icon: Star, value: '4.8', label: 'Note Moyenne' },
    { icon: Clock, value: '30min', label: 'Livraison Moyenne' }
  ];

  const testimonials = [
    {
      name: 'Sarah Dubois',
      comment: 'La cuisine africaine la plus authentique que j\'aie jamais goûtée en dehors de l\'Afrique. Saveurs incroyables !',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Michel Chen',
      comment: 'Livraison rapide et goût incroyable. Le riz jollof est absolument parfait.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Amara Williams',
      comment: 'Ça me rappelle la maison ! Chaque plat est préparé avec amour et des épices authentiques.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Goûtez aux Saveurs
                <span className="text-secondary-400 block">Authentiques d'Afrique</span>
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed">
                Découvrez le riche patrimoine culinaire de l'Afrique avec nos plats soigneusement préparés, 
                issus de recettes traditionnelles et des meilleurs ingrédients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu" className="btn-secondary inline-flex items-center justify-center">
                  Explorer le Menu
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link to="/orders" className="btn-outline inline-flex items-center justify-center text-white border-white hover:bg-white hover:text-primary-600">
                  Suivre Commande
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Cuisine africaine"
                className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
              />
              <div >
               {/*  <div className="flex items-center space-x-2">
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <span className="font-bold text-lg">4.8</span>
                  <span className="text-sm">Note</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <stat.icon size={32} className="text-primary-600" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-neutral-800">{stat.value}</div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Plats Vedettes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-neutral-800">Plats Vedettes</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Découvrez nos plats les plus populaires, chacun préparé avec des ingrédients authentiques et des méthodes de cuisson traditionnelles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <div key={dish.id} className="card overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{dish.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-neutral-800">{dish.name}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{dish.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">{dish.price}€</span>
                  <button className="btn-primary">Ajouter au Panier</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/menu" className="btn-outline inline-flex items-center">
            Voir le Menu Complet
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Témoignages */}
     {/*  <section className="bg-accent-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-neutral-800">Ce Que Disent Nos Clients</h2>
            <p className="text-lg text-neutral-600">
              Ne nous croyez pas sur parole - écoutez nos clients satisfaits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6 space-y-4">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-600 italic">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-neutral-800">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Section CTA */}
     {/*  <section className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold">Prêt à Commencer Votre Voyage Culinaire ?</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits et découvrez le goût authentique de l'Afrique livré directement chez vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu" className="btn-secondary">
                Commander Maintenant
              </Link>
              <Link to="/register" className="btn-outline text-white border-white hover:bg-white hover:text-primary-600">
                Créer un Compte
              </Link>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}