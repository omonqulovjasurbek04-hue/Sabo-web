import React from 'react';
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
}) => {
  const { t } = useTranslation();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { favoritesCount } = useFavorites();

  const items = [
    { key: 'home', label: t.nav.home, icon: Home },
    { key: 'products', label: t.nav.products, icon: Grid },
    { key: 'cart', label: t.nav.cart, icon: ShoppingCart, isCartButton: true },
    { key: 'favorites', label: t.nav.favorites, icon: Heart, badge: favoritesCount, isFavTab: true },
    { key: 'account', label: t.nav.account, icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#151B22]/95 backdrop-blur-md border-t border-[#DCE3E8] dark:border-[#29323C] px-2 py-2 lg:hidden shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = !item.isCartButton && currentPage === item.key;

          const handleClick = () => {
            if (item.isCartButton) {
              setIsCartOpen(true);
            } else {
              onNavigate(item.key);
            }
          };

          return (
            <button
              key={`${item.key}-${idx}`}
              onClick={handleClick}
              className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-2xl transition-all cursor-pointer ${
                isActive ? 'text-[#C71925] dark:text-[#E32935]' : 'text-[#59636D] dark:text-[#AEB7C0] hover:text-[#17202A] dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : ''}`} />
                
                {item.isCartButton && totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-[#C71925] rounded-full px-1 shadow-sm">
                    {totalItemCount}
                  </span>
                )}

                {item.isFavTab && favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-[#C71925] rounded-full px-1 shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold text-[#C71925] dark:text-[#E32935]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

