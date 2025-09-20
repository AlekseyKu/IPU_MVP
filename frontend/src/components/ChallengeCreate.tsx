// frontend\src\components\ChallengeCreate.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useUser, useCreateChallengeModal } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, Image as ImageIcon, Info as InfoIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useChallengeApi } from "@/hooks/useChallengeApi";
import {
  addHashtag,
  removeHashtag,
  getRandomPopularHashtags,
  MAX_HASHTAGS,
} from "@/utils/hashtags";
import InfoModal from "./modals/InfoModal";

const ChallengeCreate: React.FC = () => {
  const { isCreateChallengeOpen, setIsCreateChallengeOpen } =
    useCreateChallengeModal();
  const { telegramId } = useUser();
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [totalReports, setTotalReports] = useState<string>(""); // empty for placeholder
  const [totalReportsError, setTotalReportsError] = useState<string | null>(
    null
  );
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [randomPopular, setRandomPopular] = useState<string[]>([]);
  const [showInfoChallenge, setShowInfoChallenge] = useState(false);
  const [showInfoReports, setShowInfoReports] = useState(false);

  const updateChallenges = () => {};
  const setError = (msg: string) => {
    console.error(msg);
  };
  const { handleCreateChallenge } = useChallengeApi(updateChallenges, setError);

  // --- Хештеги ---
  const handleHashtagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInput(e.target.value);
  };
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", " ", ","].includes(e.key)) {
      e.preventDefault();
      if (hashtagInput.trim()) {
        setHashtags((prev) => addHashtag(prev, hashtagInput));
        setHashtagInput("");
      }
    }
  };
  const handleRemoveHashtag = (tag: string) => {
    setHashtags((prev) => removeHashtag(prev, tag));
  };
  const handlePopularHashtagClick = (tag: string) => {
    setHashtags((prev) => addHashtag(prev, tag));
  };

  useEffect(() => {
    if (isCreateChallengeOpen) {
      setTitle("");
      setFrequency("daily");
      setTotalReports("");
      setContent("");
      setMedia(null);
      setPreviewUrl(null);
      setTotalReportsError(null);
    }
  }, [isCreateChallengeOpen]);

  const { language } = useLanguage();

  useEffect(() => {
    if (isCreateChallengeOpen) {
      setRandomPopular(getRandomPopularHashtags([], 6, language));
    }
  }, [isCreateChallengeOpen, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId) return;

    const numericReports = Number(totalReports);
    if (isNaN(numericReports) || numericReports < 1) {
      setTotalReportsError("Количество отчетов должно быть не менее 1.");
      return;
    }

    setTotalReportsError(null);
    setLoading(true);
    try {
      let mediaUrl = null;
      if (media) {
        const formData = new FormData();
        formData.append("file", media);
        formData.append("telegramId", telegramId.toString());
        const response = await fetch("/api/challenges/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        mediaUrl = data.url;
      }

      const challengeData = {
        user_id: telegramId,
        title,
        frequency,
        total_reports: numericReports,
        content,
        media_url: mediaUrl,
        completed_reports: 0,
        is_public: true,
      };

      const created = await handleCreateChallenge({
        ...challengeData, // остальные поля
        hashtags, // <--- добавляем хештеги
      });
      if (created && created.id) {
        setIsCreateChallengeOpen(false);
        setTitle("");
        setFrequency("daily");
        setTotalReports("");
        setContent("");
        setMedia(null);
        setPreviewUrl(null);
        setTotalReportsError(null);
      }
    } catch (error) {
      console.error("Error saving challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setIsCreateChallengeOpen(false);
  };

  if (!isCreateChallengeOpen || typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        padding: "1rem",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        className="card shadow-xss rounded-xxl border-0 p-4 bg-white w-100"
        style={{
          maxWidth: "500px",
          position: "relative",
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "auto",
          transform: "translateY(20px)",
          animation: "popupSlideIn 0.3s ease-out",
        }}
      >
        {/* Кнопка закрытия модального окна */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
          }}
          // "Закрыть"
          aria-label={t("common.close")}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Заголовок модального окна */}
        <div className="d-flex align-items-center mb-3 gap-2">
          <h2 className="fw-bold mb-0">{t("challengeCreate.title")}</h2>
          <button
            type="button"
            className="btn btn-link p-0 d-flex align-items-center"
            aria-label={t("challengeCreate.info.aria.openInfo")}
            onClick={() => setShowInfoChallenge(true)}
          >
            <InfoIcon size={18} />
          </button>
        </div>

        {/* Описание модального окна */}
        {/* "Опишите ваш челендж, выберите частоту и количество отчётных действий." */}
        <p className="text-muted mb-3">{t("challengeCreate.subtitle")}</p>

        {/* Предварительный просмотр медиафайла */}
        {previewUrl && (
          <div className="mb-2 position-relative">
            {previewUrl.endsWith(".mp4") ? (
              <video
                controls
                className="w-100 rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              >
                <source src={previewUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-100 rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            )}
            {/* Кнопка удаления медиафайла */}
            <button
              onClick={handleRemoveMedia}
              className="btn btn-sm btn-danger position-absolute"
              style={{ top: "5px", right: "5px" }}
              // "Удалить"
              aria-label={t("common.delete")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Поле для названия челленджа */}
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // "Введите краткое название"
            placeholder={t("challengeCreate.form.title")}
            className="form-control mb-2"
            required
          />

          {/* Селект для выбора частоты */}
          <select
            id="frequency"
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as "daily" | "weekly" | "monthly")
            }
            className="form-control mb-2"
            required
            style={{ lineHeight: 1.5 }}
          >
            <option value="daily">{t("challengeCreate.form.daily")}</option>
            <option value="weekly">{t("challengeCreate.form.weekly")}</option>
            <option value="monthly">{t("challengeCreate.form.monthly")}</option>
          </select>

          {/* Поле для количества отчетов */}
          <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between gap-2">
              <input
                id="quantity-report"
                type="number"
                inputMode="numeric"
                value={totalReports}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,3}$/.test(val)) {
                    const num = parseInt(val, 10);
                    if (!val || (num >= 1 && num <= 100)) {
                      setTotalReports(val);
                    }
                  }
                }}
                placeholder={t("challengeCreate.form.reportsCount")}
                className="form-control"
                min="1"
                required
                aria-describedby="quantity-report-help"
              />
              <button
                type="button"
                className="btn btn-link p-2 d-flex align-items-center"
                aria-label={t("challengeCreate.info.aria.openInfo")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowInfoReports(true)}
              >
                <InfoIcon size={20} />
              </button>
            </div>
          </div>
          {totalReportsError && (
            <div className="text-danger font-xsss mb-2">
              {totalReportsError}
            </div>
          )}

          {/* Поле для описания челленджа */}
          <textarea
            id="description"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            // "Опишите челендж, в чём суть и цель"
            placeholder={t("challengeCreate.form.description")}
            className="form-control mb-2 lh-30"
            style={{ height: "200px" }}
            required
          />

          {/* Секция хештегов */}
          <div className="mb-2">
            <label className="text-muted form-label">
              {t("challengeCreate.form.hashtags")}:
            </label>
            <div className="mb-1">
              {hashtags.map((tag) => (
                <span key={tag} className="badge bg-primary me-1 mb-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="btn btn-outline-primary text-white px-1 py-0"
                    tabIndex={-1}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={hashtagInput}
              onChange={handleHashtagInputChange}
              onKeyDown={handleHashtagKeyDown}
              placeholder={t("hashtags.placeholder")}
              className="form-control mb-1"
              disabled={hashtags.length >= MAX_HASHTAGS}
              maxLength={30}
            />
            {hashtags.length >= MAX_HASHTAGS && (
              <div className="text-muted font-xsss mb-1">
                {t("hashtags.maxReached")}
              </div>
            )}
            <div className="mt-1">
              <span className="text-muted font-xsss">
                {t("hashtags.popular")}:
              </span>
              {randomPopular.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="btn btn-sm"
                  onClick={() => handlePopularHashtagClick(tag)}
                  disabled={hashtags.length >= MAX_HASHTAGS}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка прикрепления медиафайла */}
          <div className="mb-3">
            <label
              htmlFor="media-upload"
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
            >
              <input
                id="media-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="d-none"
                ref={fileInputRef}
              />
              <ImageIcon className="me-2" />
              {/* "Прикрепить фото/видео" */}
              {t("challengeCreate.form.media")}
            </label>
          </div>

          {/* Кнопки действий */}
          <div className="d-flex w-100 gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-light w-50"
              disabled={loading}
            >
              {/* "Отмена" */}
              {t("challengeCreate.buttons.cancel")}
            </button>
            <button
              type="submit"
              className="btn btn-outline-primary w-50"
              disabled={loading}
            >
              {loading
                ? t("common.loading")
                : t("challengeCreate.buttons.create")}
            </button>
          </div>
        </form>
      </div>

      {/* Модалка с информацией о челленджах */}
      {showInfoChallenge && (
        <InfoModal
          onClose={() => setShowInfoChallenge(false)}
          title={t("challengeCreate.info.title")}
        >
          <p className="mb-3">{t("challengeCreate.info.description")}</p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => setShowInfoChallenge(false)}
            >
              {t("challengeCreate.info.buttons.close")}
            </button>
          </div>
        </InfoModal>
      )}

      {/* Модалка с информацией о количестве отчетов */}
      {showInfoReports && (
        <InfoModal
          onClose={() => setShowInfoReports(false)}
          title={t("challengeCreate.form.reportsCount")}
        >
          <p className="mb-3">{t("challengeCreate.info.reportsCount")}</p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => setShowInfoReports(false)}
            >
              {t("challengeCreate.info.buttons.close")}
            </button>
          </div>
        </InfoModal>
      )}
    </div>,
    document.body
  );
};

export default ChallengeCreate;
