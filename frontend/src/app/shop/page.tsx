// // frontend/src/app/shop/page.tsx
'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Appfooter from '@/components/Appfooter'
import { useLanguage } from '@/context/LanguageContext'

export default function Leaders() {
  const { t } = useLanguage()
  return (
    <>
      <Header />
      <div style={{ marginTop: '100px', minHeight: 'calc(100vh - 200px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="fw-400 font-xs" style={{ textAlign: 'center' }}>{t('shop.title')} <br/> {t('shop.inDevelopment')}</h2> {/* "Магазин IPU в разработке" */}
        </motion.div>
      </div>
      <Appfooter />
    </>
  )
}




// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import Header from '@/components/Header'
// import Appfooter from '@/components/Appfooter'
// import { 
//   ShoppingCart, 
//   Heart, 
//   Star, 
//   Filter, 
//   Search, 
//   Plus, 
//   Minus,
//   X,
//   Package,
//   Truck,
//   Shield,
//   CreditCard,
//   ChevronDown,
//   ChevronUp
// } from 'lucide-react'

// // Типы данных
// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   originalPrice?: number;
//   image: string;
//   category: string;
//   rating: number;
//   reviews: number;
//   inStock: boolean;
//   isNew?: boolean;
//   isSale?: boolean;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// // Моковые данные товаров
// const mockProducts: Product[] = [
//   {
//     id: 1,
//     name: "IPU Premium Подписка",
//     description: "Полный доступ ко всем функциям платформы IPU на 30 дней",
//     price: 999,
//     originalPrice: 1499,
//     image: "/assets/images/ipu/ipu_512.svg",
//     category: "Подписки",
//     rating: 4.8,
//     reviews: 156,
//     inStock: true,
//     isSale: true
//   },
//   {
//     id: 2,
//     name: "IPU Курс 'Эффективные обещания'",
//     description: "Онлайн-курс по постановке и выполнению целей",
//     price: 2499,
//     image: "/assets/images/ipu/ipu_512.svg",
//     category: "Курсы",
//     rating: 4.9,
//     reviews: 89,
//     inStock: true,
//     isNew: true
//   },
//   {
//     id: 3,
//     name: "IPU Мерч - Футболка",
//     description: "Стильная футболка с логотипом IPU",
//     price: 1299,
//     image: "/assets/images/ipu/ipu_512.svg",
//     category: "Мерч",
//     rating: 4.7,
//     reviews: 234,
//     inStock: true
//   },
//   {
//     id: 4,
//     name: "IPU Мерч - Кепка",
//     description: "Бейсболка с вышитым логотипом IPU",
//     price: 899,
//     image: "/assets/images/ipu/ipu_512.svg",
//     category: "Мерч",
//     rating: 4.6,
//     reviews: 67,
//     inStock: true
//   },
//   {
//     id: 5,
//     name: "IPU Консультация",
//     description: "Персональная консультация по достижению целей",
//     price: 3999,
//     image: "/assets/images/ipu/ipu_512.svg",
//     category: "Услуги",
//     rating: 5.0,
//     reviews: 45,
//     inStock: true
//   },
//   {
//     id: 6,
//     name: "IPU Книга 'Путь к успеху'",
//     description: "Авторская книга о достижении целей и самодисциплине",
//     price: 799,
//     originalPrice: 999,
//     image: "/assets/images/ipu/ipu_512.svg",
//     category: "Книги",
//     rating: 4.5,
//     reviews: 123,
//     inStock: true,
//     isSale: true
//   }
// ];

// const categories = [
//   { id: 'all', name: 'Все товары', icon: Package },
//   { id: 'Подписки', name: 'Подписки', icon: CreditCard },
//   { id: 'Курсы', name: 'Курсы', icon: Star },
//   { id: 'Мерч', name: 'Мерч', icon: Truck },
//   { id: 'Услуги', name: 'Услуги', icon: Shield },
//   { id: 'Книги', name: 'Книги', icon: Package }
// ];

// export default function Shop() {
//   const [products, setProducts] = useState<Product[]>(mockProducts);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
//   const [showFilters, setShowFilters] = useState(false);
//   const [showCart, setShowCart] = useState(false);
//   const [sortBy, setSortBy] = useState('popular');

//   // Фильтрация товаров
//   useEffect(() => {
//     let filtered = products;

//     // Фильтр по категории
//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(product => product.category === selectedCategory);
//     }

//     // Фильтр по поиску
//     if (searchQuery) {
//       filtered = filtered.filter(product => 
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Фильтр по цене
//     filtered = filtered.filter(product => 
//       product.price >= priceRange.min && product.price <= priceRange.max
//     );

//     // Сортировка
//     switch (sortBy) {
//       case 'price-asc':
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-desc':
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case 'rating':
//         filtered.sort((a, b) => b.rating - a.rating);
//         break;
//       case 'popular':
//       default:
//         filtered.sort((a, b) => b.reviews - a.reviews);
//         break;
//     }

//     setFilteredProducts(filtered);
//   }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

//   // Добавление в корзину
//   const addToCart = (product: Product) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
//       if (existingItem) {
//         return prevCart.map(item =>
//           item.id === product.id 
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [...prevCart, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   // Удаление из корзины
//   const removeFromCart = (productId: number) => {
//     setCart(prevCart => prevCart.filter(item => item.id !== productId));
//   };

//   // Изменение количества в корзине
//   const updateQuantity = (productId: number, newQuantity: number) => {
//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
//     setCart(prevCart =>
//       prevCart.map(item =>
//         item.id === productId ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   // Общая сумма корзины
//   const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

//   // Компонент карточки товара
//   const ProductCard = ({ product }: { product: Product }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="card bg-white border-0 shadow-sm rounded-xxl mb-3"
//     >
//       <div className="position-relative">
//         <img 
//           src={product.image} 
//           alt={product.name}
//           className="w-100 rounded-top-xxl"
//           style={{ height: '200px', objectFit: 'cover' }}
//         />
//         {product.isNew && (
//           <span className="position-absolute top-0 start-0 m-3 badge bg-primary">Новинка</span>
//         )}
//         {product.isSale && (
//           <span className="position-absolute top-0 end-0 m-3 badge bg-danger">Скидка</span>
//         )}
//         <button 
//           onClick={() => addToCart(product)}
//           className="position-absolute bottom-0 end-0 m-3 btn btn-primary btn-sm rounded-circle"
//           style={{ width: '40px', height: '40px' }}
//         >
//           <Plus size={16} />
//         </button>
//       </div>
      
//       <div className="card-body p-3">
//         <h6 className="fw-600 font-sm mb-1">{product.name}</h6>
//         <p className="text-grey-500 font-xssss mb-2">{product.description}</p>
        
//         <div className="d-flex align-items-center mb-2">
//           <div className="d-flex align-items-center me-2">
//             {[...Array(5)].map((_, i) => (
//               <Star 
//                 key={i} 
//                 size={12} 
//                 className={i < Math.floor(product.rating) ? 'text-warning' : 'text-grey-300'} 
//                 fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
//               />
//             ))}
//           </div>
//           <span className="text-grey-500 font-xsssss">({product.reviews})</span>
//         </div>
        
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             {product.originalPrice && (
//               <span className="text-grey-400 text-decoration-line-through me-2 font-xsssss">
//                 {product.originalPrice} ₽
//               </span>
//             )}
//             <span className="fw-700 text-primary font-sm">{product.price} ₽</span>
//           </div>
//           <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'} font-xsssss`}>
//             {product.inStock ? 'В наличии' : 'Нет в наличии'}
//           </span>
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <>
//       <Header />
      
//       <div className="bg-grey-50" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '100px' }}>
//         <div className="container-fluid">
//           <div className="row">
//             {/* Боковая панель с фильтрами */}
//             <div className="col-lg-3 col-md-4">
//               <div className="card bg-white border-0 shadow-sm rounded-xxl p-4 mb-4">
//                 <h5 className="fw-600 mb-3">Фильтры</h5>
                
//                 {/* Поиск */}
//                 <div className="mb-4">
//                   <div className="position-relative">
//                     <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-grey-400" size={16} />
//                     <input
//                       type="text"
//                       placeholder="Поиск товаров..."
//                       className="form-control ps-5"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Категории */}
//                 <div className="mb-4">
//                   <h6 className="fw-600 mb-2">Категории</h6>
//                   {categories.map(category => (
//                     <button
//                       key={category.id}
//                       onClick={() => setSelectedCategory(category.id)}
//                       className={`d-flex align-items-center w-100 text-start p-2 rounded mb-1 border-0 ${
//                         selectedCategory === category.id 
//                           ? 'bg-primary text-white' 
//                           : 'bg-grey-100 text-grey-700'
//                       }`}
//                     >
//                       <category.icon size={16} className="me-2" />
//                       <span className="font-xssss">{category.name}</span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Сортировка */}
//                 <div className="mb-4">
//                   <h6 className="fw-600 mb-2">Сортировка</h6>
//                   <select 
//                     className="form-select"
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                   >
//                     <option value="popular">По популярности</option>
//                     <option value="rating">По рейтингу</option>
//                     <option value="price-asc">По цене (возрастание)</option>
//                     <option value="price-desc">По цене (убывание)</option>
//                   </select>
//                 </div>

//                 {/* Диапазон цен */}
//                 <div className="mb-4">
//                   <h6 className="fw-600 mb-2">Цена</h6>
//                   <div className="d-flex gap-2">
//                     <input
//                       type="number"
//                       placeholder="От"
//                       className="form-control"
//                       value={priceRange.min}
//                       onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
//                     />
//                     <input
//                       type="number"
//                       placeholder="До"
//                       className="form-control"
//                       value={priceRange.max}
//                       onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Основной контент */}
//             <div className="col-lg-9 col-md-8">
//               {/* Заголовок и корзина */}
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div>
//                   <h4 className="fw-700 mb-1">Маркетплейс IPU</h4>
//                   <p className="text-grey-500 mb-0">Найдено товаров: {filteredProducts.length}</p>
//                 </div>
                
//                 <button
//                   onClick={() => setShowCart(true)}
//                   className="btn btn-primary position-relative"
//                 >
//                   <ShoppingCart size={20} />
//                   {cartItemsCount > 0 && (
//                     <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//                       {cartItemsCount}
//                     </span>
//                   )}
//                 </button>
//               </div>

//               {/* Товары */}
//               <div className="row">
//                 {filteredProducts.map(product => (
//                   <div key={product.id} className="col-lg-4 col-md-6 col-sm-6 mb-4">
//                     <ProductCard product={product} />
//                   </div>
//                 ))}
//               </div>

//               {filteredProducts.length === 0 && (
//                 <div className="text-center py-5">
//                   <Package size={64} className="text-grey-300 mb-3" />
//                   <h5 className="text-grey-500">Товары не найдены</h5>
//                   <p className="text-grey-400">Попробуйте изменить параметры поиска</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Модальное окно корзины */}
//       {showCart && (
//         <div className="modal-backdrop show" onClick={() => setShowCart(false)}>
//           <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-content border-0 shadow-lg rounded-xxl">
//               <div className="modal-header border-0 pb-0">
//                 <h5 className="fw-600">Корзина ({cartItemsCount})</h5>
//                 <button 
//                   type="button" 
//                   className="btn-close" 
//                   onClick={() => setShowCart(false)}
//                 />
//               </div>
              
//               <div className="modal-body">
//                 {cart.length === 0 ? (
//                   <div className="text-center py-4">
//                     <ShoppingCart size={48} className="text-grey-300 mb-3" />
//                     <h6 className="text-grey-500">Корзина пуста</h6>
//                     <p className="text-grey-400">Добавьте товары для покупки</p>
//                   </div>
//                 ) : (
//                   <>
//                     {cart.map(item => (
//                       <div key={item.id} className="d-flex align-items-center mb-3 p-3 bg-grey-50 rounded">
//                         <img 
//                           src={item.image} 
//                           alt={item.name}
//                           className="rounded me-3"
//                           style={{ width: '60px', height: '60px', objectFit: 'cover' }}
//                         />
//                         <div className="flex-grow-1">
//                           <h6 className="fw-600 mb-1">{item.name}</h6>
//                           <p className="text-grey-500 font-xssss mb-0">{item.price} ₽</p>
//                         </div>
//                         <div className="d-flex align-items-center me-3">
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                             className="btn btn-sm btn-outline-secondary rounded-circle"
//                             style={{ width: '30px', height: '30px' }}
//                           >
//                             <Minus size={12} />
//                           </button>
//                           <span className="mx-3 fw-600">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                             className="btn btn-sm btn-outline-secondary rounded-circle"
//                             style={{ width: '30px', height: '30px' }}
//                           >
//                             <Plus size={12} />
//                           </button>
//                         </div>
//                         <div className="text-end">
//                           <div className="fw-600">{item.price * item.quantity} ₽</div>
//                           <button
//                             onClick={() => removeFromCart(item.id)}
//                             className="btn btn-sm text-danger p-0"
//                           >
//                             <X size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
                    
//                     <div className="border-top pt-3">
//                       <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h6 className="fw-600">Итого:</h6>
//                         <h5 className="fw-700 text-primary">{cartTotal} ₽</h5>
//                       </div>
//                       <button className="btn btn-primary w-100">
//                         Оформить заказ
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <Appfooter />
//     </>
//   )
// }