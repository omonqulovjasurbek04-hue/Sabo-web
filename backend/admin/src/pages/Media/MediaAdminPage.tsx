import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { getApiErrorMessage, resolveMediaUrl, type PaginationMeta } from '../../api/http';
import { MEDIA_FOLDERS, deleteMedia, fetchMedia, formatFileSize, uploadMedia, type MediaItem } from '../../api/media';
import { EmptyState, ErrorState, InlineAlert, LoadingState } from '../../components/ui/AsyncState';
import { useAuth } from '../../context/useAuth';

const PAGE_SIZE = 48;

export const MediaAdminPage: React.FC = () => {
  const { user } = useAuth();
  const canDelete = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const [items, setItems] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [folder, setFolder] = useState<string>('all');
  const [uploadFolder, setUploadFolder] = useState<string>('general');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetchMedia({ page: 1, limit: PAGE_SIZE, ...(folder !== 'all' ? { folder } : {}) });
      setItems(res.items);
      setMeta(res.meta);
    } catch (err) {
      setItems([]);
      setMeta(null);
      setLoadError(getApiErrorMessage(err, 'Media fayllarni yuklab bo‘lmadi.'));
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMore = async () => {
    if (!meta?.hasNext) return;
    setLoadingMore(true);
    setActionError(null);
    try {
      const res = await fetchMedia({ page: meta.page + 1, limit: PAGE_SIZE, ...(folder !== 'all' ? { folder } : {}) });
      setItems((prev) => [...prev, ...res.items]);
      setMeta(res.meta);
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Keyingi sahifani yuklab bo‘lmadi.'));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setActionError(null);
    setNotice(null);
    const failed: string[] = [];
    let uploaded = 0;
    // The endpoint accepts a single file per request.
    for (const file of Array.from(files)) {
      try {
        await uploadMedia({ file, folder: uploadFolder });
        uploaded += 1;
      } catch (err) {
        failed.push(`${file.name}: ${getApiErrorMessage(err, 'yuklanmadi')}`);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
    if (uploaded > 0) setNotice(`${uploaded} ta fayl yuklandi.`);
    if (failed.length > 0) setActionError(failed.join(' · '));
    if (uploaded > 0) await load();
  };

  const handleDelete = async (m: MediaItem) => {
    if (!confirm(`“${m.originalName}” faylini o‘chirmoqchimisiz?`)) return;
    setDeletingId(m.id);
    setActionError(null);
    setNotice(null);
    try {
      await deleteMedia(m.id);
      setItems((prev) => prev.filter((x) => x.id !== m.id));
      setMeta((prev) => (prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev));
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Faylni o‘chirib bo‘lmadi.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Media Kutubxona</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Sayt va mahsulotlar uchun yuklangan rasmlar, PDF va 3D fayllar{meta ? ` — jami ${meta.total} ta` : ''}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-xs font-bold text-[#1A2E26] cursor-pointer"
            aria-label="Yuklash papkasi"
          >
            {MEDIA_FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.glb,.gltf"
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Upload className="size-4" />
            <span>{uploading ? 'Yuklanmoqda...' : 'Fayl yuklash'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', ...MEDIA_FOLDERS].map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              folder === f ? 'bg-[#0E3B2E] text-white shadow-sm' : 'bg-white border border-[#EBE3DA] text-[#52796F] hover:bg-[#F5EFEB]'
            }`}
          >
            {f === 'all' ? 'Barchasi' : f}
          </button>
        ))}
      </div>

      {notice && <InlineAlert tone="success" message={notice} onClose={() => setNotice(null)} />}
      {actionError && <InlineAlert tone="error" message={actionError} onClose={() => setActionError(null)} />}

      {loading ? (
        <LoadingState />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState title="Bu papkada fayl yo‘q" hint="“Fayl yuklash” tugmasi orqali rasm yoki hujjat qo‘shing." />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {items.map((m) => {
              const url = resolveMediaUrl(m.url);
              const isImage = m.mimeType.startsWith('image/');
              return (
                <div
                  key={m.id}
                  className="group relative p-4 rounded-2xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <a
                    href={url ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="h-28 rounded-xl bg-[#F8F6F0] flex items-center justify-center mb-3 overflow-hidden"
                  >
                    {isImage && url ? (
                      <img src={url} alt={m.altText ?? m.originalName} loading="lazy" className="h-full w-full object-cover" />
                    ) : isImage ? (
                      <ImageIcon className="size-10 text-[#2D6A4F]/60" />
                    ) : (
                      <FileText className="size-10 text-[#2D6A4F]/60" />
                    )}
                  </a>
                  <div>
                    <div className="font-bold text-xs text-[#1A2E26] truncate" title={m.originalName}>
                      {m.originalName}
                    </div>
                    <div className="text-[10px] text-[#52796F] mt-0.5">
                      {formatFileSize(m.size)}
                      {m.width && m.height ? ` • ${m.width}x${m.height}` : ''} • {m.folder}
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => void handleDelete(m)}
                      disabled={deletingId === m.id}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 border border-[#EBE3DA] text-[#52796F] hover:text-[#E63946] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50 cursor-pointer"
                      aria-label="O‘chirish"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {meta?.hasNext && (
            <div className="flex justify-center">
              <button
                onClick={() => void loadMore()}
                disabled={loadingMore}
                className="px-5 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-xs font-bold text-[#0E3B2E] hover:bg-[#F8F6F0] disabled:opacity-60 cursor-pointer"
              >
                {loadingMore ? 'Yuklanmoqda...' : 'Ko‘proq ko‘rsatish'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
