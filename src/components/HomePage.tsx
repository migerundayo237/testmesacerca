import { useState } from "react";
import { Link } from "react-router-dom";
import { mockRestaurants } from "../data/mockData";
import { MapPin, Star, Phone, Clock, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HomePage() {
  const [selectedCuisine, setSelectedCuisine] = useState<string>("Todas");

  const cuisines = ["Todas", "Italiana", "Mexicana", "Japonesa", "Americana"];

  const filteredRestaurants = selectedCuisine === "Todas" 
    ? mockRestaurants 
    : mockRestaurants.filter(r => r.cuisine === selectedCuisine);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Map Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Restaurantes Cercanos
        </h1>
        <div className="bg-slate-200 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
          {/* Mock Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400"></div>
          <div className="relative z-10 text-center">
            <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-2" />
            <p className="text-slate-700">Vista de mapa de restaurantes cercanos</p>
            <p className="text-sm text-slate-600 mt-2">
              {mockRestaurants.length} restaurantes en tu zona
            </p>
          </div>
          
          {/* Mock pins */}
          {mockRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="absolute bg-red-500 rounded-full w-4 h-4 border-2 border-white shadow-lg animate-pulse"
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + (index % 2) * 30}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">
          Filtrar por Cocina
        </h2>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCuisine === cuisine
                  ? "bg-orange-500 text-white"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-orange-500"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <ImageWithFallback
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold">{restaurant.rating}</span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {restaurant.cuisine} • {restaurant.priceRange}
                  </p>
                </div>
              </div>
              
              <p className="text-slate-700 text-sm mb-3 line-clamp-2">
                {restaurant.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.openHours}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/restaurante/${restaurant.id}`}
                  className="flex-1 bg-white border border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-center"
                >
                  Ver Menú
                </Link>
                <Link
                  to={`/reservar/${restaurant.id}`}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center flex items-center justify-center gap-2"
                >
                  Reservar
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No se encontraron restaurantes de esta cocina.</p>
        </div>
      )}
    </div>
  );
}
