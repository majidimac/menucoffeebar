
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MENU_ITEMS } from './constants';
import { MenuItem, CartItem, Order, AppView } from './types';

// PERFORMANCE OPTIMIZATION: Reuse Intl.NumberFormat instance
const priceFormatter = new Intl.NumberFormat('fa-IR');

const formatPrice = (price: number) => {
  return priceFormatter.format(price) + ' تومان';
};

// PERFORMANCE OPTIMIZATION: Memoize static SVG components
const CoffeeIcon = React.memo(() => (
  <div className="flex flex-col items-center">
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="text-black"
    >
      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
      <path d="M8 1c-.55 0-1 .45-1 1s1.45 1 1 2-1 .45-1 1 1.45 1 1 2c-.55 0-1 .45-1 1s1.45 1 1 2" />
      <path d="M12 1c-.55 0-1 .45-1 1s1.45 1 1 2-1 .45-1 1 1.45 1 1 2c-.55 0-1 .45-1 1s1.45 1 1 2" />
    </svg>
    <div className="w-10 h-1 bg-black mt-1 rounded-full opacity-30"></div>
  </div>
));

const bgImageUrl = "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop";

// Shared background component - Memoized and defined outside to prevent re-creation/unmounting on every render
const FullScreenBackground = React.memo(() => (
  <div className="fixed inset-0 z-[-1]">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${bgImageUrl}')` }}
    />
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]" />
  </div>
));

// PERFORMANCE OPTIMIZATION: Hoisted Admin components to prevent re-creation and full unmount cycles
const AdminLogin = React.memo(({
  loginForm,
  setLoginForm,
  handleAdminLogin,
  loginError,
  setView
}: {
  loginForm: any;
  setLoginForm: React.Dispatch<React.SetStateAction<any>>;
  handleAdminLogin: (e: React.FormEvent) => void;
  loginError: string;
  setView: (view: AppView) => void;
}) => (
  <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
    <FullScreenBackground />
    <div className="bg-white/95 backdrop-blur-md w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/20 animate-fade-in z-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold font-nastaliq mb-2">ورود مدیریت</h2>
        <p className="text-gray-400 text-sm italic">ورود با admin / admin</p>
      </div>
      <form onSubmit={handleAdminLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">نام کاربری</label>
          <input
            type="text"
            value={loginForm.username}
            onChange={e => setLoginForm(prev => ({...prev, username: e.target.value}))}
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-zinc-900 outline-none transition-all placeholder-gray-300"
            placeholder="نام کاربری..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">رمز عبور</label>
          <input
            type="password"
            value={loginForm.password}
            onChange={e => setLoginForm(prev => ({...prev, password: e.target.value}))}
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-zinc-900 outline-none transition-all placeholder-gray-300"
            placeholder="••••••••"
            required
          />
        </div>
        {loginError && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg text-center animate-shake">
            {loginError}
          </div>
        )}
        <button type="submit" className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-95">
          ورود به پنل
        </button>
      </form>
      <button onClick={() => setView('customer')} className="w-full mt-6 text-gray-400 hover:text-black text-sm transition-colors">
        ← بازگشت به منوی کافه
      </button>
    </div>
  </div>
));

const AdminDashboard = React.memo(({
  orders,
  setView,
  markOrderAsCompleted,
  deleteOrder
}: {
  orders: Order[];
  setView: (view: AppView) => void;
  markOrderAsCompleted: (id: string) => void;
  deleteOrder: (id: string) => void;
}) => (
  <div className="min-h-screen flex flex-col relative overflow-hidden" dir="rtl">
    <FullScreenBackground />
    <header className="bg-white/90 backdrop-blur-lg border-b px-8 py-5 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-5">
        <h2 className="text-3xl font-bold font-nastaliq">داشبورد مدیریت</h2>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          سیستم آنلاین
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setView('customer')} className="px-5 py-2.5 text-sm font-bold border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-colors bg-white">مشاهده منو</button>
        <button onClick={() => setView('customer')} className="px-5 py-2.5 text-sm font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">خروج</button>
      </div>
    </header>

    <main className="flex-grow p-6 md:p-10 max-w-5xl mx-auto w-full z-10">
      <div className="grid grid-cols-1 gap-8">
        {orders.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md p-32 rounded-[2rem] border-2 border-dashed border-white/20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-gray-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-zinc-400">در حال حاضر سفارشی ندارید</h3>
            <p className="text-zinc-500 mt-2">به محض ثبت سفارش توسط مشتری، اینجا نمایش داده می‌شود.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="group bg-white/95 backdrop-blur-md rounded-[2rem] shadow-sm border-2 transition-all overflow-hidden border-gray-100 hover:border-black/10 hover:shadow-xl animate-fade-in">
              <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-50 gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-black text-2xl tracking-tighter">ORD-{order.id}</span>
                    <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase bg-amber-100 text-amber-700">
                      {order.status === 'pending' ? 'در صف تهیه' : 'تحویل شده'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>{new Date(order.timestamp).toLocaleTimeString('fa-IR')}</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(order.timestamp).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left">
                    <p className="text-xs text-zinc-400 font-bold mb-1">مبلغ نهایی</p>
                    <span className="text-2xl font-black text-zinc-900">{formatPrice(order.totalPrice)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markOrderAsCompleted(order.id)}
                      className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
                    >
                      تکمیل و حذف از لیست
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition-colors"
                      title="حذف اجباری"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-1c0-1.171-.933-2.144-2.106-2.144H9.123c-1.173 0-2.083.973-2.083 2.144v1m4.217 0a48.274 48.274 0 0 1 5.213 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-zinc-50/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-800">{item.name}</span>
                      <span className="text-[10px] text-zinc-400">{formatPrice(item.numericPrice)}</span>
                    </div>
                    <span className="bg-zinc-900 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm">
                      {item.quantity.toLocaleString('fa-IR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  </div>
));

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('customer');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Use lazy state initialization to avoid redundant render on mount
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('cafe_gandom_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Sync orders to localStorage
  const updateOrders = useCallback((newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('cafe_gandom_orders', JSON.stringify(newOrders));
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return newQty === 0 ? null : { ...i, quantity: newQty };
      }
      return i;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const submitOrder = () => {
    const newOrder: Order = {
      // CODE MAINTENANCE: Replaced deprecated substr with slice and ensured consistent length
      id: Math.random().toString(36).slice(2, 8).padEnd(6, '0').toUpperCase(),
      items: [...cart],
      totalPrice,
      timestamp: Date.now(),
      status: 'pending',
    };
    updateOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setShowOrderSuccess(true);
    setTimeout(() => setShowOrderSuccess(false), 3000);
  };

  const handleAdminLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin') {
      setView('admin-dashboard');
      setLoginError('');
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError('نام کاربری یا رمز عبور اشتباه است');
    }
  }, [loginForm, setView]);

  const markOrderAsCompleted = useCallback((id: string) => {
    // As per user request: When completing the order, it should be deleted/removed from the list
    setOrders(prev => {
      const filtered = prev.filter(o => o.id !== id);
      localStorage.setItem('cafe_gandom_orders', JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    if (window.confirm('آیا از حذف این سفارش مطمئن هستید؟')) {
      setOrders(prev => {
        const filtered = prev.filter(o => o.id !== id);
        localStorage.setItem('cafe_gandom_orders', JSON.stringify(filtered));
        return filtered;
      });
    }
  }, []);

  // --- ADMIN LOGIN VIEW ---
  if (view === 'admin-login') {
    return (
      <AdminLogin
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleAdminLogin={handleAdminLogin}
        loginError={loginError}
        setView={setView}
      />
    );
  }

  // --- ADMIN DASHBOARD VIEW ---
  if (view === 'admin-dashboard') {
    return (
      <AdminDashboard
        orders={orders}
        setView={setView}
        markOrderAsCompleted={markOrderAsCompleted}
        deleteOrder={deleteOrder}
      />
    );
  }

  // --- CUSTOMER VIEW ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden" dir="rtl">
      <FullScreenBackground />
      
      {/* Toast Notification */}
      {showOrderSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900/90 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-bounce border-2 border-white/20 backdrop-blur-xl">
           <div className="bg-green-500 rounded-full p-1">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
           </div>
          <span className="font-bold text-lg">سفارش شما با موفقیت ثبت شد!</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row min-h-[800px] overflow-hidden rounded-[2.5rem] relative border border-white/20 z-10">
        
        {/* Branding Section */}
        <div className="w-full md:w-[45%] relative flex flex-col items-center justify-center py-12 px-6 border-b md:border-b-0 md:border-l border-gray-100 bg-zinc-900 overflow-hidden">
          {/* Subtle inner-background pattern or overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-90"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight text-center mb-16 drop-shadow-2xl font-nastaliq">
              کافه گندم
            </h1>
            
            <div className="flex items-center justify-center relative w-full px-4">
               <div className="flex flex-col items-center">
                  <div className="w-60 h-60 md:w-80 md:h-80 rounded-full overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border-8 border-white/10 backdrop-blur-md group transition-transform duration-700 hover:scale-105">
                    <img 
                      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop"
                      alt="Coffee Cup" 
                      className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-1000"
                    />
                  </div>
                  <div className="mt-8 text-amber-100/30 font-nastaliq text-xl tracking-widest italic animate-pulse">
                    طعم واقعی اصالت
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Menu Items Section */}
        <div className="w-full md:w-[55%] bg-white py-12 px-6 md:px-12 flex flex-col">
          
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-3 font-nastaliq">منو کافه</h3>
            <CoffeeIcon />
          </div>

          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-100 to-transparent mb-10 mx-auto max-w-[80%] opacity-50"></div>

          <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar px-2">
            {MENU_ITEMS.map((item) => (
              <button 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="w-full group flex justify-between items-center p-3 rounded-2xl transition-all hover:bg-zinc-50 active:scale-[0.97]"
                dir="rtl"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl md:text-2xl text-zinc-900 font-bold group-hover:text-amber-900 transition-colors">{item.name}</span>
                  <div className="bg-zinc-900 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-black opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                    +
                  </div>
                </div>
                <div className="flex-grow mx-4 border-b-2 border-dotted border-zinc-100 h-0 self-end mb-2"></div>
                {/* PERFORMANCE OPTIMIZATION: Consistent price formatting */}
                <span className="text-left text-zinc-500 font-bold whitespace-nowrap text-lg md:text-xl tracking-tight">{formatPrice(item.numericPrice)}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 pt-8 text-center border-t border-zinc-50">
             <p className="text-zinc-300 text-xs mb-3 italic tracking-wide">© کافه گندم - جایی برای آرامش و طعم‌های ماندگار</p>
             <button 
                onClick={() => setView('admin-login')}
                className="inline-flex items-center gap-2 text-zinc-300 hover:text-zinc-900 text-[10px] font-black transition-all hover:tracking-[0.2em] bg-zinc-50/50 px-4 py-1.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full group-hover:bg-zinc-900"></span>
                پنل مدیریت
              </button>
          </div>
        </div>
      </div>

      {/* Floating Manager Button (Bottom-Left) */}
      <button 
        onClick={() => setView('admin-login')}
        className="fixed bottom-8 left-8 w-16 h-16 bg-white/90 backdrop-blur-md text-zinc-900 rounded-[1.5rem] shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-110 transition-all active:scale-90 z-40 border-2 border-white/20 group"
        title="پنل مدیریت"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>

      {/* Floating Cart Button (Bottom-Right) */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 w-20 h-20 bg-zinc-900 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-center hover:scale-110 transition-all active:scale-90 z-40 group overflow-hidden border-4 border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 relative z-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        {totalItemsCount > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-bounce border-2 border-zinc-900">
            {totalItemsCount.toLocaleString('fa-IR')}
          </span>
        )}
      </button>

      {/* Cart Sidebar Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          <div 
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div 
            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col p-10 animate-slide-left border-l border-gray-100"
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold font-nastaliq">لیست سفارشات</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-3 bg-gray-50 hover:bg-zinc-900 hover:text-white transition-all rounded-2xl active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-6 custom-scrollbar px-2">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                  <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 opacity-30">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold italic">هنوز انتخابی نداشته‌اید</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-zinc-50/50 p-6 rounded-3xl border border-gray-50 shadow-sm transition-all hover:bg-zinc-50">
                    <div className="flex flex-col">
                      <span className="font-bold text-2xl mb-1">{item.name}</span>
                      <span className="text-sm text-zinc-400 font-bold tracking-tighter">{formatPrice(item.numericPrice)}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center bg-white border-2 border-zinc-100 rounded-2xl overflow-hidden shadow-inner p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors rounded-xl font-black"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-black text-xl">
                          {item.quantity.toLocaleString('fa-IR')}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-green-50 hover:text-green-500 transition-colors rounded-xl font-black"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-1c0-1.171-.933-2.144-2.106-2.144H9.123c-1.173 0-2.083.973-2.083 2.144v1m4.217 0a48.274 48.274 0 0 1 5.213 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-10 pt-10 border-t-2 border-zinc-100">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-zinc-400 font-bold text-lg">جمع مبلغ نهایی:</span>
                  <span className="text-4xl font-black text-zinc-900 tracking-tighter">{formatPrice(totalPrice)}</span>
                </div>
                <button 
                  onClick={submitOrder}
                  className="w-full bg-zinc-900 text-white py-6 rounded-3xl font-black text-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.15)] group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10">تأیید و ثبت سفارش نهایی</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
