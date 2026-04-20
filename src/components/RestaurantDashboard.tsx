import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RestaurantInfo {
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  description: string;
  openHours: string;
  priceRange: string;
  image: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export function RestaurantDashboard() {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Mi Restaurante",
    cuisine: "Internacional",
    address: "Carrera 7 #45-50, Bogotá",
    phone: "+57 1 555 0000",
    description: "Descripción de tu restaurante",
    openHours: "12:00 - 23:00",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1657593088889-5105c637f2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzcxMjgyODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Plato de Ejemplo",
      description: "Descripción del plato",
      price: "35000",
      category: "Entrantes",
    },
  ]);

  const [editingInfo, setEditingInfo] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: "",
    category: "Entrantes",
  });
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  const categories = ["Entrantes", "Principales", "Postres", "Bebidas"];

  const handleInfoChange = (field: keyof RestaurantInfo, value: string) => {
    setRestaurantInfo({ ...restaurantInfo, [field]: value });
  };

  const handleMenuItemChange = (id: string, field: keyof MenuItem, value: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddMenuItem = () => {
    if (newItem.name && newItem.price) {
      const newMenuItem: MenuItem = {
        ...newItem,
        id: Date.now().toString(),
      };
      setMenuItems([...menuItems, newMenuItem]);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "Entrantes",
      });
      setShowNewItemForm(false);
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Panel de Restaurante
      </h1>

      {/* Restaurant Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Información del Restaurante
          </h2>
          <button
            onClick={() => setEditingInfo(!editingInfo)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {editingInfo ? (
              <>
                <Save className="w-4 h-4" />
                Guardar
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Editar
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nombre del Restaurante
              </label>
              {editingInfo ? (
                <input
                  type="text"
                  value={restaurantInfo.name}
                  onChange={(e) => handleInfoChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-700">{restaurantInfo.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Tipo de Cocina
              </label>
              {editingInfo ? (
                <input
                  type="text"
                  value={restaurantInfo.cuisine}
                  onChange={(e) => handleInfoChange("cuisine", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-700">{restaurantInfo.cuisine}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Dirección
              </label>
              {editingInfo ? (
                <input
                  type="text"
                  value={restaurantInfo.address}
                  onChange={(e) => handleInfoChange("address", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-700">{restaurantInfo.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Teléfono
              </label>
              {editingInfo ? (
                <input
                  type="text"
                  value={restaurantInfo.phone}
                  onChange={(e) => handleInfoChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-700">{restaurantInfo.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Descripción
              </label>
              {editingInfo ? (
                <textarea
                  value={restaurantInfo.description}
                  onChange={(e) => handleInfoChange("description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-slate-700">{restaurantInfo.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Horario
              </label>
              {editingInfo ? (
                <input
                  type="text"
                  value={restaurantInfo.openHours}
                  onChange={(e) => handleInfoChange("openHours", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-700">{restaurantInfo.openHours}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Rango de Precios
              </label>
              {editingInfo ? (
                <select
                  value={restaurantInfo.priceRange}
                  onChange={(e) => handleInfoChange("priceRange", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="$">$ (Económico)</option>
                  <option value="$$">$$ (Moderado)</option>
                  <option value="$$$">$$$ (Caro)</option>
                  <option value="$$$$">$$$$ (Muy Caro)</option>
                </select>
              ) : (
                <p className="text-slate-700">{restaurantInfo.priceRange}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Gestión del Menú</h2>
          <button
            onClick={() => setShowNewItemForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Añadir Plato
          </button>
        </div>

        {/* New Item Form */}
        {showNewItemForm && (
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Nuevo Plato</h3>
              <button
                onClick={() => setShowNewItemForm(false)}
                className="text-slate-600 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nombre del plato"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Precio (COP)
                </label>
                <input
                  type="text"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="35000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Categoría
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Descripción del plato"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowNewItemForm(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMenuItem}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Añadir Plato
              </button>
            </div>
          </div>
        )}

        {/* Menu Items by Category */}
        <div className="space-y-6">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 border-b pb-2">
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {editingItem === item.id ? (
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleMenuItemChange(item.id, "name", e.target.value)
                            }
                            className="px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Nombre"
                          />
                          <input
                            type="text"
                            value={item.price}
                            onChange={(e) =>
                              handleMenuItemChange(item.id, "price", e.target.value)
                            }
                            className="px-3 py-2 border border-slate-300 rounded-lg"
                            placeholder="Precio"
                          />
                          <select
                            value={item.category}
                            onChange={(e) =>
                              handleMenuItemChange(item.id, "category", e.target.value)
                            }
                            className="px-3 py-2 border border-slate-300 rounded-lg"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleMenuItemChange(item.id, "description", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Descripción"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItem(null)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-slate-900">
                              {item.name}
                            </h4>
                            <span className="text-lg font-bold text-orange-500">
                              ${item.price}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingItem(item.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">
                No hay platos en el menú. Haz clic en "Añadir Plato" para empezar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Vista Previa
        </h2>
        <p className="text-slate-600 mb-4">
          Así se verá tu restaurante en la plataforma:
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="relative h-48">
            <ImageWithFallback
              src={restaurantInfo.image}
              alt={restaurantInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {restaurantInfo.name}
            </h3>
            <p className="text-sm text-slate-600 mb-2">
              {restaurantInfo.cuisine} • {restaurantInfo.priceRange}
            </p>
            <p className="text-slate-700 text-sm">{restaurantInfo.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}