import { useParams, Link, useNavigate } from "react-router-dom";
import { mockRestaurants } from "../data/mockData";
import { Star, MapPin, Phone, Clock, ArrowLeft, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 mb-4">Restaurante no encontrado</p>
        <Link to="/" className="text-orange-500 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Group menu items by category
  const menuByCategory = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurant.menu>);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-white px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{restaurant.rating}</span>
              </div>
              <span className="text-white">{restaurant.cuisine}</span>
              <span className="text-white">{restaurant.priceRange}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <p className="text-white/90 text-lg">{restaurant.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Menú</h2>
            
            <div className="space-y-8">
              {Object.entries(menuByCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm text-slate-600 mb-2">
                              {item.description}
                            </p>
                            <span className="text-lg font-bold text-orange-500">
                              ${item.price.toLocaleString('es-CO')}
                            </span>
                          </div>
                          {item.image && (
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Info & Reservation */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Información
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Dirección</p>
                    <p className="text-sm text-slate-600">{restaurant.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Teléfono</p>
                    <p className="text-sm text-slate-600">{restaurant.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Horario</p>
                    <p className="text-sm text-slate-600">{restaurant.openHours}</p>
                  </div>
                </div>
              </div>

              <Link
                to={`/reservar/${restaurant.id}`}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Hacer Reserva
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}