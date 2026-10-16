import React, { useCallback, useEffect, useState } from 'react';
import { Palette, RotateCcw, Save, Server } from 'lucide-react';
import { apiClient } from '../../api/client';
import { getApiErrorMessage } from '../../api/http';
import {
  THEME_FONTS,
  THEME_PALETTES,
  fetchTheme,
  resetTheme,
  updateTheme,
  type ThemeModeColors,
  type ThemeSettings,
} from '../../api/settings';
import { ErrorState, InlineAlert, LoadingState } from '../../components/ui/AsyncState';
import { useAuth } from '../../context/useAuth';

type Mode = 'light' | 'dark';

const COLOR_FIELDS: { key: keyof ThemeModeColors; label: string }[] = [
  { key: 'primary', label: 'Asosiy rang' },
  { key: 'primaryHover', label: 'Asosiy (hover)' },
  { key: 'primarySoft', label: 'Asosiy (yumshoq)' },
  { key: 'secondary', label: 'Ikkilamchi' },
  { key: 'secondarySoft', label: 'Ikkilamchi (yumshoq)' },
  { key: 'background', label: 'Fon' },
  { key: 'surface', label: 'Yuza' },
  { key: 'surfaceElevated', label: 'Ko‘tarilgan yuza' },
  { key: 'foreground', label: 'Matn' },
  { key: 'muted', label: 'Xira matn' },
  { key: 'border', label: 'Chegara' },
  { key: 'buttonBg', label: 'Tugma foni' },
  { key: 'buttonText', label: 'Tugma matni' },
  { key: 'buttonHover', label: 'Tugma (hover)' },
  { key: 'actionRed', label: 'Ogohlantirish (qizil)' },
];

/** Same rule as class-validator `@IsHexColor()`. */
const HEX_COLOR = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** `<input type="color">` only accepts `#rrggbb`. */
function toColorInputValue(value: string): string {
  const hex = value.replace('#', '');
  if (/^[0-9a-f]{6}$/i.test(hex)) return `#${hex}`;
  if (/^[0-9a-f]{3}$/i.test(hex)) return `#${hex.split('').map((c) => c + c).join('')}`;
  return '#000000';
}

export const SettingsAdminPage: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [draft, setDraft] = useState<ThemeSettings | null>(null);
  const [mode, setMode] = useState<Mode>('light');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchTheme();
      setTheme(data);
      setDraft(data);
    } catch (err) {
      setTheme(null);
      setDraft(null);
      setLoadError(getApiErrorMessage(err, 'Mavzu sozlamalarini yuklab bo‘lmadi.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const isDirty = theme !== null && draft !== null && JSON.stringify(theme) !== JSON.stringify(draft);
  const invalidFields = draft
    ? (['light', 'dark'] as const).flatMap((m) =>
        COLOR_FIELDS.filter((f) => !HEX_COLOR.test(draft[m][f.key])).map((f) => `${m}.${f.key}`),
      )
    : [];

  const setColor = (key: keyof ThemeModeColors, value: string) => {
    setDraft((d) => (d ? { ...d, [mode]: { ...d[mode], [key]: value } } : d));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setActionError(null);
    setNotice(null);
    try {
      // `brand` is left out on purpose: the server merges, so existing brand settings stay intact.
      const saved = await updateTheme({
        palette: draft.palette,
        fontFamily: draft.fontFamily,
        light: draft.light,
        dark: draft.dark,
      });
      setTheme(saved);
      setDraft(saved);
      setNotice('Mavzu saqlandi. Sayt keyingi yuklanishda yangi ranglarni oladi.');
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Mavzuni saqlab bo‘lmadi.'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Mavzu standart holatga qaytarilsinmi? Saqlangan ranglar o‘chiriladi.')) return;
    setSaving(true);
    setActionError(null);
    setNotice(null);
    try {
      const defaults = await resetTheme();
      setTheme(defaults);
      setDraft(defaults);
      setNotice('Mavzu standart holatga qaytarildi.');
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Mavzuni tiklab bo‘lmadi.'));
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E] disabled:opacity-60';

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Sayt Sozlamalari</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Sayt mavzusi: ranglar palitrasi, shrift va yorug‘/qorong‘i rejim ranglari (/settings/theme).
          </p>
        </div>
        {canManage && draft && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => void handleReset()}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-white text-[#52796F] font-bold text-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <RotateCcw className="size-4" />
              Standartga qaytarish
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={saving || !isDirty || invalidFields.length > 0}
              className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <Save className="size-4" />
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        )}
      </div>

      {notice && <InlineAlert tone="success" message={notice} onClose={() => setNotice(null)} />}
      {actionError && <InlineAlert tone="error" message={actionError} onClose={() => setActionError(null)} />}
      {!canManage && <InlineAlert tone="info" message="Mavzuni faqat SUPER_ADMIN va ADMIN o‘zgartira oladi." />}

      {loading ? (
        <LoadingState />
      ) : loadError || !draft ? (
        <ErrorState message={loadError ?? 'Mavzu topilmadi.'} onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2 font-black text-[#0E3B2E] text-base">
              <Palette className="size-5 text-[#2D6A4F]" />
              <span>Umumiy</span>
            </div>
            <div className="text-xs space-y-3">
              <div>
                <label className="block font-bold text-[#52796F] mb-1">Palitra</label>
                <select
                  value={draft.palette}
                  disabled={!canManage}
                  onChange={(e) => {
                    const palette = THEME_PALETTES.find((p) => p === e.target.value);
                    if (palette) setDraft({ ...draft, palette });
                  }}
                  className={selectClass}
                >
                  {THEME_PALETTES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#52796F] mb-1">Shrift</label>
                <select
                  value={draft.fontFamily}
                  disabled={!canManage}
                  onChange={(e) => {
                    const fontFamily = THEME_FONTS.find((f) => f === e.target.value);
                    if (fontFamily) setDraft({ ...draft, fontFamily });
                  }}
                  className={selectClass}
                >
                  {THEME_FONTS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-[11px] text-[#52796F]">
                Oxirgi o‘zgarish:{' '}
                {new Date(draft.updatedAt).getTime() > 0 ? new Date(draft.updatedAt).toLocaleString() : 'standart (hali saqlanmagan)'}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBE3DA] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-black text-[#0E3B2E]">
                <Server className="size-4 text-[#2D6A4F]" />
                <span>Backend API</span>
              </div>
              <div className="font-mono text-[11px] break-all text-[#1A2E26]">{apiClient.defaults.baseURL}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="font-black text-[#0E3B2E] text-base">Ranglar</div>
              <div className="flex gap-2">
                {(['light', 'dark'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      mode === m ? 'bg-[#0E3B2E] text-white' : 'bg-white border border-[#EBE3DA] text-[#52796F]'
                    }`}
                  >
                    {m === 'light' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}
                  </button>
                ))}
              </div>
            </div>

            {invalidFields.length > 0 && (
              <InlineAlert tone="error" message={`Noto‘g‘ri HEX rang: ${invalidFields.join(', ')}`} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {COLOR_FIELDS.map(({ key, label }) => {
                const value = draft[mode][key];
                return (
                  <div key={key} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8F6F0]">
                    <input
                      type="color"
                      value={toColorInputValue(value)}
                      disabled={!canManage}
                      onChange={(e) => setColor(key, e.target.value)}
                      className="size-9 rounded-lg border border-[#EBE3DA] bg-white cursor-pointer disabled:cursor-not-allowed"
                      aria-label={label}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#1A2E26]">{label}</div>
                      <input
                        type="text"
                        value={value}
                        disabled={!canManage}
                        onChange={(e) => setColor(key, e.target.value.trim())}
                        className={`w-full mt-0.5 bg-transparent font-mono text-[11px] focus:outline-none ${
                          HEX_COLOR.test(value) ? 'text-[#52796F]' : 'text-[#E63946]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="p-5 rounded-2xl border"
              style={{ background: draft[mode].background, borderColor: draft[mode].border, color: draft[mode].foreground }}
            >
              <div className="text-sm font-black">Ko‘rinish namunasi</div>
              <p className="text-xs mt-1" style={{ color: draft[mode].muted }}>
                SABO tabiiy sut mahsulotlari
              </p>
              <div className="mt-3 flex gap-2">
                <span
                  className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background: draft[mode].buttonBg, color: draft[mode].buttonText }}
                >
                  Savatga qo‘shish
                </span>
                <span
                  className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background: draft[mode].secondarySoft, color: draft[mode].foreground }}
                >
                  Batafsil
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
