import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Informations Entreprise */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FÊBLIHI SÔHI</span>
            </div>
            <p className="text-gray-300 text-sm">
              Cuisine africaine authentique préparée avec amour et des recettes traditionnelles transmises de génération en génération.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Suivi Commandes
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  À Propos
                </a>
              </li>
            </ul>
          </div>

          {/* Catégories Menu */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Notre Menu</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Entrées
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Plats Principaux
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Desserts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Boissons
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nous Contacter</h3>
            <div className="space-y-3">
             {/*  <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary-400" />
                <span className="text-gray-300 text-sm">+33 1 23 45 67 89</span>
              </div> */}
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary-400" />
                <span className="text-gray-300 text-sm">contact@feblihisohi.fr</span>
              </div>
             {/*  <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Rue de l'Afrique<br />
                  Quartier Culturel, Paris 75001
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 FÊBLIHI SÔHI. Tous droits réservés. Fait avec ❤️ pour la cuisine africaine authentique.
          </p>
        </div>
      </div>
    </footer>
  );
}