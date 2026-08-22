import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Check, Package, X } from 'lucide-react';
import type { Product } from '../../types';

const initialProducts: Product[] = [
  {
    id: 'prod_1',
    nameUz: 'SABO Tabiiy Sut 3.2%',
    nameRu: 'Молоко SABO 3.2%',
    nameEn: 'SABO Natural Milk 3.2%',
    slug: 'sabo-sut-3-2-1l',
    category: 'Sut',
    fatContent: '3.2%',
    volumeWeight: '1 Litr',
    shelfLife: '7 kun',
    storageTemp: '+2°C...+6°C',
    priceMinor: 12000,
    stock: 240,
    isActive: true,
    isFeatured: true,
    image: '/images/products/Sabo_Milk.jpg',
  },
  {
    id: 'prod_2',
    nameUz: 'SABO Kefir 2.5%',
    nameRu: 'Кефир SABO 2.5%',
    nameEn: 'SABO Kefir 2.5%',
    slug: 'sabo-kefir-1l',
    category: 'Kefir',
    fatContent: '2.5%',
    volumeWeight: '1 Litr',
    shelfLife: '10 kun',
    storageTemp: '+2°C...+6°C',
    priceMinor: 11000,
    stock: 180,
    isActive: true,
    isFeatured: true,
    image: '/images/products/Sabo_Kefir.jpg',
  },
  {
    id: 'prod_3',
    nameUz: 'SABO Qaymoq (Smetana) 20%',
    nameRu: 'Сметана SABO 20%',
    nameEn: 'SABO Sour Cream 20%',
    slug: 'sabo-smetana-20-400g',
    category: 'Smetana',
    fatContent: '20%',
    volumeWeight: '400 gr',
    shelfLife: '14 kun',
    storageTemp: '+2°C...+6°C',
    priceMinor: 15000,
    stock: 120,
    isActive: true,
    isFeatured: false,
    image: '/images/products/Sabo_Smetana.jpg',
  },
  {
    id: 'prod_4',
    nameUz: 'SABO Mevali Yogurt',
    nameRu: 'Фруктовый йогурт SABO',
    nameEn: 'SABO Fruit Yogurt',
    slug: 'sabo-yogurt-qulupnay-450g',
    category: 'Yogurt',
    fatContent: '2.5%',
    volumeWeight: '450 gr',
    shelfLife: '21 kun',
    storageTemp: '+2°C...+6°C',
    priceMinor: 13000,
    stock: 95,
    isActive: true,
    isFeatured: true,
    image: '/images/products/Sabo_Yogurt.jpg',
  },
  {
    id: 'prod_5',
    nameUz: 'SABO Tabiiy Sariyog‘ 82.5%',
    nameRu: 'Сливочное масло SABO 82.5%',
    nameEn: 'SABO Natural Butter 82.5%',
    slug: 'sabo-sariyog-82-5-200g',
    category: 'Sariyog‘',
    fatContent: '82.5%',
    volumeWeight: '200 gr',
    shelfLife: '30 kun',
    storageTemp: '-5°C...0°C',
    priceMinor: 26000,
    stock: 85,
    isActive: true,
    isFeatured: false,
    image: '/images/products/Sabo_Butter.jpg',
  },
];

export const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nameUz: '',
    category: 'Sut',
    fatContent: '3.2%',
    volumeWeight: '1 Litr',
    priceMinor: 12000,
    stock: 100,
  });

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.nameUz.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `prod_${Date.now()}`,
      nameUz: newProduct.nameUz,
      nameRu: newProduct.nameUz,
      nameEn: newProduct.nameUz,
      slug: newProduct.nameUz.toLowerCase().replace(/\s+/g, '-'),
      category: newProduct.category,
      fatContent: newProduct.fatContent,
      volumeWeight: newProduct.volumeWeight,
      priceMinor: Number(newProduct.priceMinor),
      stock: Number(newProduct.stock),
      isActive: true,
      isFeatured: false,
      image: '/images/products/Sabo_Milk.jpg',
    };
    setProducts([created, ...products]);
    setIsModalOpen(false);
    setNewProduct({
      nameUz: '',
      category: 'Sut',
      fatContent: '3.2%',
      volumeWeight: '1 Litr',
      priceMinor: 12000,
      stock: 100,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Rostdan ham ushbu mahsulotni o‘chirmoqchimisiz?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Mahsulotlar</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Barcha SABO tabiiy sut mahsulotlarini boshqarish va narxlash.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Yangi mahsulot qo‘shish</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#52796F]" />
          <input
            type="text"
            placeholder="Mahsulot nomi yoki slug bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-xs font-semibold text-[#1A2E26] focus:outline-none focus:border-[#0E3B2E]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-xs font-bold text-[#1A2E26] focus:outline-none focus:border-[#0E3B2E] cursor-pointer"
        >
          <option value="all">Barcha toifalar</option>
          <option value="Sut">Sut</option>
          <option value="Kefir">Kefir</option>
          <option value="Smetana">Smetana</option>
          <option value="Yogurt">Yogurt</option>
          <option value="Sariyog‘">Sariyog‘</option>
        </select>
      </div>

      {/* Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
              <th className="py-3 px-4">Mahsulot</th>
              <th className="py-3 px-4">Kategoriya</th>
              <th className="py-3 px-4">Yog‘lilik</th>
              <th className="py-3 px-4">Hajmi</th>
              <th className="py-3 px-4">Narxi</th>
              <th className="py-3 px-4">Omborda</th>
              <th className="py-3 px-4">Holat</th>
              <th className="py-3 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE3DA]/60">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-[#F8F6F0] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#F8F6F0] border border-[#EBE3DA] flex items-center justify-center font-bold text-[#0E3B2E]">
                      <Package className="size-5 text-[#2D6A4F]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1A2E26] text-sm">{prod.nameUz}</div>
                      <div className="text-[11px] text-[#52796F] font-mono">{prod.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#EBF7EE] text-[#0E3B2E] uppercase">
                    {prod.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#1A2E26]">{prod.fatContent || '—'}</td>
                <td className="py-3.5 px-4 text-[#52796F] font-semibold">{prod.volumeWeight}</td>
                <td className="py-3.5 px-4 font-black text-[#0E3B2E]">
                  {prod.priceMinor.toLocaleString()} UZS
                </td>
                <td className="py-3.5 px-4 font-bold text-[#1A2E26]">{prod.stock} dona</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                    <Check className="size-3" />
                    Faol
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1">
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-1.5 rounded-lg text-[#52796F] hover:text-[#E63946] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-[#EBE3DA] shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE3DA]">
              <h2 className="text-xl font-black text-[#0E3B2E]">Yangi Mahsulot Qo‘shish</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#52796F] hover:text-[#1A2E26]">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#52796F] mb-1">Mahsulot Nomi (UZ)</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: SABO Qatiq 3.2%"
                  value={newProduct.nameUz}
                  onChange={(e) => setNewProduct({ ...newProduct, nameUz: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#52796F] mb-1">Kategoriya</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]"
                  >
                    <option value="Sut">Sut</option>
                    <option value="Kefir">Kefir</option>
                    <option value="Smetana">Smetana</option>
                    <option value="Yogurt">Yogurt</option>
                    <option value="Sariyog‘">Sariyog‘</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#52796F] mb-1">Yog‘lilik</label>
                  <input
                    type="text"
                    value={newProduct.fatContent}
                    onChange={(e) => setNewProduct({ ...newProduct, fatContent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#52796F] mb-1">Narxi (UZS)</label>
                  <input
                    type="number"
                    value={newProduct.priceMinor}
                    onChange={(e) => setNewProduct({ ...newProduct, priceMinor: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#52796F] mb-1">Ombor miqdori</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBE3DA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE3DA] text-[#52796F] font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold shadow-md hover:bg-[#08281F]"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
