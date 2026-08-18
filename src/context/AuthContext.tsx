import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderCustomerInfo } from '../types';

export interface UserProfile {
  id?: string;
  fullName: string;
  name?: string;
  phone: string;
  email: string;
  bonusPoints?: number;
  addresses: Array<{
    id: string;
    title: string;
    region: string;
    address: string;
    isDefault?: boolean;
  }>;
}

interface AuthContextType {
  user: UserProfile | null;
  orders: Order[];
  login: (phone: string, password?: string) => Promise<boolean> | boolean;
  register: (name: string, phone: string, password?: string) => Promise<boolean> | boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: { title: string; region: string; address: string; isDefault?: boolean }) => void;
  deleteAddress: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'sabo_user_profile';
const ORDERS_STORAGE_KEY = 'sabo_user_orders';

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  fullName: 'Bobur Abdullaev',
  name: 'Bobur Abdullaev',
  phone: '+998 (90) 123-45-67',
  email: 'bobur.abdullaev@sabo.uz',
  bonusPoints: 45000,
  addresses: [
    {
      id: 'addr-1',
      title: 'Uy (Asosiy)',
      region: 'Toshkent shahri, Chilonzor tumani',
      address: '9-mavze, 12-uy, 34-xonadon',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Ofis',
      region: 'Toshkent shahri, Mirobod tumani',
      address: 'Nukus ko\'chasi, 29-uy, 4-qavat',
      isDefault: false,
    },
  ],
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'SABO-89412',
    createdAt: '2026-05-10T14:30:00.000Z',
    status: 'delivered',
    subtotal: 96000,
    deliveryFee: 0,
    discount: 9600,
    total: 86400,
    customer: {
      fullName: 'Bobur Abdullaev',
      phone: '+998 (90) 123-45-67',
      email: 'bobur.abdullaev@sabo.uz',
      region: 'Toshkent shahri',
      address: 'Chilonzor tumani, 9-mavze, 12-uy, 34-xonadon',
      paymentMethod: 'click',
      deliveryDate: '2026-05-11',
      deliveryTimeSlot: '09:00 - 12:00',
    },
    items: [
      {
        product: {
          id: 'sabo-milk-32',
          slug: 'sabo-pasterizatsiyalangan-sut-3-2',
          name: {
            uz: 'SABO Pasterizatsiyalangan Sut 3.2%',
            ru: 'SABO Пастеризованное молоко 3.2%',
            en: 'SABO Pasteurized Whole Milk 3.2%',
          },
          shortDescription: {
            uz: '100% tabiiy sut',
            ru: '100% молоко',
            en: '100% natural milk',
          },
          fullDescription: { uz: '', ru: '', en: '' },
          category: 'milk',
          categoryLabel: { uz: 'Sut', ru: 'Молоко', en: 'Milk' },
          images: ['/image/SaboSutim.jpg'],
          fatContent: '3.2%',
          volumeOptions: [{ volume: '1000 ml', price: 11000 }],
          shelfLife: { uz: '7 kun', ru: '7 дней', en: '7 days' },
          storageConditions: { uz: '+4C', ru: '+4C', en: '+4C' },
          ingredients: { uz: 'Sut', ru: 'Молоко', en: 'Milk' },
          nutrition: { calories: 59, proteins: 3, fats: 3.2, carbohydrates: 4.7 },
          certifications: ['ISO 9001', 'Halol'],
          rating: 4.9,
          reviewsCount: 140,
          inStock: true,
        },
        selectedVolume: '1000 ml',
        price: 11000,
        quantity: 2,
      },
      {
        product: {
          id: 'sabo-smetana-20',
          slug: 'sabo-smetana-20',
          name: {
            uz: 'SABO Smetana 20%',
            ru: 'SABO Сметана 20%',
            en: 'SABO Sour Cream 20%',
          },
          shortDescription: { uz: '', ru: '', en: '' },
          fullDescription: { uz: '', ru: '', en: '' },
          category: 'sourcream_butter',
          categoryLabel: { uz: 'Smetana', ru: 'Сметана', en: 'Sour Cream' },
          images: ['/image/Sabo_Smetana.jpg'],
          fatContent: '20%',
          volumeOptions: [{ volume: '400 g', price: 16000 }],
          shelfLife: { uz: '14 kun', ru: '14 дней', en: '14 days' },
          storageConditions: { uz: '+4C', ru: '+4C', en: '+4C' },
          ingredients: { uz: 'Qaymoq, maxsus laxtalash zamburug\'lari', ru: 'Сливки, закваска', en: 'Cream, active cultures' },
          nutrition: { calories: 206, proteins: 2.5, fats: 20, carbohydrates: 3.4 },
          certifications: ['ISO 9001', 'Halol'],
          rating: 4.95,
          reviewsCount: 198,
          inStock: true,
        },
        selectedVolume: '400 g',
        price: 16000,
        quantity: 1,
      },
    ],
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  const login = async (phone: string, password?: string) => {
    // Simulate login delay
    await new Promise(r => setTimeout(r, 400));
    const cleanPhone = phone.trim();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: 'Jasur Boburov',
      name: 'Jasur Boburov',
      phone: cleanPhone,
      email: 'client@sabo.uz',
      bonusPoints: 35000,
      addresses: DEFAULT_USER.addresses,
    };
    setUser(newUser);
    return true;
  };

  const register = async (name: string, phone: string, password?: string) => {
    await new Promise(r => setTimeout(r, 400));
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: name.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: '',
      bonusPoints: 10000,
      addresses: [],
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...data, name: data.fullName || prev.name || prev.fullName } : null));
  };

  const addAddress = (newAddress: { title: string; region: string; address: string; isDefault?: boolean }) => {
    const id = `addr-${Date.now()}`;
    setUser(prev => {
      if (!prev) return prev;
      let updatedAddresses = [...prev.addresses];
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
      }
      return {
        ...prev,
        addresses: [...updatedAddresses, { id, ...newAddress }],
      };
    });
  };

  const deleteAddress = (id: string) => {
    setUser(prev => (prev ? {
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id),
    } : null));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `PM-${randomNum}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      ...orderData,
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
