import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  X,
  HeartHandshake,
  TrendingUp,
  TrendingDown,
  Info as InfoIcon,
} from "lucide-react";
import { useKarma } from "@/hooks/useKarma";
import { formatDate } from "@/utils/formatDate";
import { useLanguage } from "@/context/LanguageContext";
import { translateKarmaReason } from "@/utils/karmaTranslations";
import InfoModal from "./modals/InfoModal";

interface KarmaHistoryProps {
  userId: number;
  isVisible?: boolean;
  onClose?: () => void;
}

const KarmaHistory: React.FC<KarmaHistoryProps> = ({
  userId,
  isVisible = false,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const [showInfoKarma, setShowInfoKarma] = useState(false);
  // Хук вызывается только когда модальное окно видимо
  const {
    karmaHistory,
    karmaStats,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  } = useKarma(isVisible ? userId : 0);

  if (!isVisible || typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
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
        paddingBottom: "2rem",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        className="card shadow-xss rounded-xxl border-0 bg-white w-100 d-flex flex-column"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "500px",
          height: "calc(100vh - 2rem)",
          position: "relative",
          animation: "popupSlideIn 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="p-4 pb-0">
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
            }}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-primary me-2" />
              {/* "История кармы" */}
              <h2 className="text-lg mb-0">{t("karmaHistory.title")}</h2>
              <button
                type="button"
                className="btn btn-link p-0 d-flex align-items-center"
                aria-label={t("karmaHistory.info.aria.openInfo")}
                onClick={() => setShowInfoKarma(true)}
              >
                <InfoIcon size={18} />
              </button>
            </div>
          </div>

          {/* "Просмотр ваших достижений и изменений кармы" */}
          <p className="text-muted font-xss mb-3">
            {t("karmaHistory.subtitle")}
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-grow-1 overflow-y-auto px-4">
          {isLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t("common.loading")}</span>
              </div>
              {/* "Загрузка истории кармы..." */}
              <p className="text-muted mt-2">{t("karmaHistory.loading")}</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {/* "Ошибка загрузки:" */}
              <strong>{t("karmaHistory.error")}:</strong> {error}
            </div>
          )}

          {!isLoading && !error && karmaStats && (
            <div className="card bg-light border-0 mb-3">
              <div className="card-body text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <HeartHandshake className="w-5 h-5 text-primary me-2" />
                  <h4 className="mb-0 fw-bold text-primary">
                    {karmaStats.karma_points}
                  </h4>
                </div>
                {/* "Текущая карма" */}
                <p className="text-muted mb-0 font-xsss">
                  {t("karmaHistory.currentKarma")}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && karmaHistory.length > 0 && (
            <div className="karma-history">
              <h6 className="mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <TrendingUp className="w-4 h-4 me-2" />
                  {/* "Последние изменения" */}
                  {t("karmaHistory.recentChanges")}
                </div>
                <small className="text-muted font-xsss">
                  {/* "записей" */}
                  {karmaHistory.length} {t("karmaHistory.records")}
                </small>
              </h6>
              <div className="list-group list-group-flush font-xss">
                {karmaHistory.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3"
                  >
                    <div className="flex-grow-1">
                      <div className="fw-medium text-dark">
                        {translateKarmaReason(transaction.reason, t)}
                      </div>
                      <small className="text-muted">
                        {formatDate(transaction.created_at, language)}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      {transaction.amount > 0 ? (
                        <TrendingUp className="w-4 h-4 text-primary me-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-secondary me-1" />
                      )}
                      <span
                        className={`fs-6 fw-bold ${
                          transaction.amount > 0
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Кнопка "Загрузить еще" */}
              {hasMore && (
                <div className="text-center mt-3">
                  {isLoadingMore ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="spinner-border spinner-border-sm text-primary me-2"
                        role="status"
                      >
                        <span className="visually-hidden">
                          {t("common.loading")}
                        </span>
                      </div>
                      {/* "Загрузка..." */}
                      <span className="text-muted font-xsss">
                        {t("common.loading")}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-primary border-0 btn-sm pb-2"
                      onClick={loadMore}
                    >
                      {/* "Загрузить еще" */}
                      {t("karmaHistory.loadMore")}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && karmaHistory.length === 0 && (
            <div className="text-center py-4">
              <HeartHandshake className="w-12 h-12 text-muted mb-3" />
              {/* "История кармы пуста" */}
              <h6 className="text-muted">{t("karmaHistory.empty")}</h6>
              {/* "Создавайте и выполняйте обещания, чтобы заработать карму!" */}
              <p className="text-muted font-xsss">
                {t("karmaHistory.emptyDescription")}
              </p>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="p-4">
          <button
            type="button"
            className="btn btn-outline-primary w-100"
            onClick={onClose}
          >
            {/* "Закрыть" */}
            {t("common.close")}
          </button>
        </div>
      </div>
      {/* Модалка с информацией о карме */}
      {showInfoKarma && (
        <InfoModal
          onClose={() => setShowInfoKarma(false)}
          title={t("karmaHistory.info.title")}
        >
          <p className="mb-3" style={{ whiteSpace: "pre-line" }}>
            {t("karmaHistory.info.description")}
          </p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => setShowInfoKarma(false)}
            >
              {t("karmaHistory.info.buttons.close")}
            </button>
          </div>
        </InfoModal>
      )}
    </div>,
    document.body
  );
};

export default KarmaHistory;
