import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Image as ImageIcon, 
  Film, 
  Youtube, 
  HardDrive, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { MovieFormData, MOVIE_CATEGORIES } from '../../types';
import { validateMovieForm, ValidationErrors } from '../../lib/validators';
import { parseYouTubeUrl } from '../../lib/youtube';
import { parseGoogleDriveUrl } from '../../lib/googleDrive';

interface MovieFormProps {
  initialData?: MovieFormData;
  onSubmit: (data: MovieFormData) => Promise<void>;
  isEditing?: boolean;
}

export const MovieForm: React.FC<MovieFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<MovieFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    posterUrl: initialData?.posterUrl || '',
    trailerUrl: initialData?.trailerUrl || '',
    driveUrl: initialData?.driveUrl || '',
    category: initialData?.category || 'Action',
    featured: initialData?.featured || false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Live parsed states for previews
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
  const [driveParsed, setDriveParsed] = useState<{ isValid: boolean; fileId: string | null }>({
    isValid: false,
    fileId: null
  });
  const [posterValid, setPosterValid] = useState<boolean | null>(null);

  // Sync initialData changes if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Update YouTube preview whenever trailerUrl changes
  useEffect(() => {
    if (formData.trailerUrl) {
      const parsed = parseYouTubeUrl(formData.trailerUrl);
      if (parsed.isValid && parsed.embedUrl) {
        setTrailerPreview(parsed.embedUrl);
      } else {
        setTrailerPreview(null);
      }
    } else {
      setTrailerPreview(null);
    }
  }, [formData.trailerUrl]);

  // Update Drive preview status whenever driveUrl changes
  useEffect(() => {
    if (formData.driveUrl) {
      const parsed = parseGoogleDriveUrl(formData.driveUrl);
      setDriveParsed({
        isValid: parsed.isValid,
        fileId: parsed.fileId
      });
    } else {
      setDriveParsed({ isValid: false, fileId: null });
    }
  }, [formData.driveUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific validation error on change
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit

    setSubmitError(null);

    // Validate inputs
    const { isValid, errors: validationErrors } = validateMovieForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      // Scroll to first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err: any) {
      setSubmitError(err?.message || 'Gagal menyimpan data film.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Notifications */}
      {submitError && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold">Gagal Menyimpan Data</h5>
            <p className="mt-0.5 leading-relaxed">{submitError}</p>
          </div>
        </div>
      )}

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Film berhasil {isEditing ? 'diperbarui' : 'ditambahkan'}! Mengalihkan ke panel admin...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Controls (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Judul Film */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
              Judul Film <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Interstellar"
              maxLength={200}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none transition-all ${
                errors.title
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)]'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>
            )}
          </div>

          {/* 2. Deskripsi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
              Sinopsis & Deskripsi Film <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tuliskan sinopsis lengkap, latar cerita, dan alur film..."
              maxLength={5000}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none transition-all ${
                errors.description
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)]'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-xs text-red-400">{errors.description}</p>
              ) : <div />}
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {formData.description.length} / 5000 karakter
              </span>
            </div>
          </div>

          {/* 3. Kategori & Featured Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                Kategori Film <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)] text-sm text-[var(--color-text-primary)] focus:outline-none cursor-pointer"
              >
                {MOVIE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-400 mt-1.5">{errors.category}</p>
              )}
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-3 rounded-xl glass-card border border-[var(--color-border-subtle)] cursor-pointer hover:border-[var(--color-border-glass)] transition-all">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                    Jadikan Film Unggulan
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Link Poster */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
              Link Poster Gambar (URL HTTP/HTTPS) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none transition-all ${
                  errors.posterUrl
                    ? 'border-red-500'
                    : 'border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)]'
                }`}
              />
            </div>
            {errors.posterUrl && (
              <p className="text-xs text-red-400 mt-1.5">{errors.posterUrl}</p>
            )}
          </div>

          {/* 5. Link Google Drive Video */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Link Video Google Drive <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-[var(--color-gold-primary)] flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                Format File ID Auto-Extract
              </span>
            </div>
            <input
              type="text"
              name="driveUrl"
              value={formData.driveUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/file/d/1a2b3c4d.../view?usp=sharing"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none transition-all ${
                errors.driveUrl
                  ? 'border-red-500'
                  : 'border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)]'
              }`}
            />
            {errors.driveUrl && (
              <p className="text-xs text-red-400 mt-1.5">{errors.driveUrl}</p>
            )}
            {driveParsed.isValid && (
              <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Google Drive File ID terdeteksi: <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded">{driveParsed.fileId}</code>
              </p>
            )}

            {/* Helper notice for Google Drive access */}
            <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Penting:</strong> Pastikan setelan berbagi file di Google Drive diatur ke <em>"Siapa saja yang memiliki link dapat melihat" (Anyone with the link can view)</em> agar penonton dapat memutar video langsung tanpa kendala otorisasi Drive.
              </p>
            </div>
          </div>

          {/* 6. Link Trailer YouTube */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
              Link Trailer YouTube (Opsional)
            </label>
            <input
              type="text"
              name="trailerUrl"
              value={formData.trailerUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none transition-all ${
                errors.trailerUrl
                  ? 'border-red-500'
                  : 'border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)]'
              }`}
            />
            {errors.trailerUrl && (
              <p className="text-xs text-red-400 mt-1.5">{errors.trailerUrl}</p>
            )}
          </div>
        </div>

        {/* Right Column: Previews & Actions (1 Col) */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-[var(--color-border-glass)] space-y-4">
            <h4 className="font-cinzel text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[var(--color-gold-primary)]" />
              Live Preview Poster
            </h4>

            <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-black/60 border border-[var(--color-border-subtle)] relative flex items-center justify-center">
              {formData.posterUrl ? (
                <img
                  src={formData.posterUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPosterValid(false)}
                  onLoad={() => setPosterValid(true)}
                />
              ) : (
                <div className="text-center p-4 text-[var(--color-text-muted)]">
                  <Film className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Poster akan tampil di sini saat URL diisi</p>
                </div>
              )}

              {posterValid === false && formData.posterUrl && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center text-red-400">
                  <AlertCircle className="w-6 h-6 mb-1" />
                  <p className="text-xs">Gagal memuat gambar poster dari URL tersebut</p>
                </div>
              )}
            </div>

            {/* YouTube Preview if provided */}
            {trailerPreview && (
              <div className="pt-2">
                <h5 className="text-xs font-bold text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  Preview Trailer YouTube
                </h5>
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-white/10">
                  <iframe
                    src={trailerPreview}
                    title="Trailer Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="glass-panel p-5 rounded-2xl border border-[var(--color-border-glass)] space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gold-button py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Firebase...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Simpan Perubahan' : 'Publikasikan Film'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin')}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
