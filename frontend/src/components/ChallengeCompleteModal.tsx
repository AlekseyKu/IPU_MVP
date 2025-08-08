import React from "react";
import ReactDOM from "react-dom";
import { X, Share2, Star, Trophy, Calendar, Target } from "lucide-react";
import { ChallengeData } from "@/types";

interface ChallengeCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeData;
  isOwner?: boolean;
  ownerName?: string;
}

const ChallengeCompleteModal: React.FC<ChallengeCompleteModalProps> = ({
  isOpen,
  onClose,
  challenge,
  isOwner = false,
  ownerName,
}) => {
  if (!isOpen || typeof window === "undefined") return null;

  const totalDays = Math.max(1, challenge.total_reports || 1);
  const cappedDaysCompleted = Math.min(
    challenge.completed_reports || 0,
    totalDays
  );
  const completionPercentage = Math.round(
    (cappedDaysCompleted / totalDays) * 100
  );
  const daysCompleted = cappedDaysCompleted;

  const handleShare = async () => {
    const shareData = {
      title: isOwner
        ? `Я завершил челлендж: ${challenge.title}`
        : `Челлендж завершён: ${challenge.title}`,
      text: isOwner
        ? `Поздравьте меня! Я успешно завершил челлендж "${challenge.title}" с прогрессом ${completionPercentage}% (${daysCompleted}/${totalDays} дней)`
        : `${ownerName || "Пользователь"} завершил челлендж с прогрессом ${completionPercentage}% (${daysCompleted}/${totalDays} дней)`,
      url: `${window.location.origin}/challenge/${challenge.id}`,
    } as const;

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Ошибка при попытке поделиться:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert("Ссылка скопирована в буфер обмена!");
      } catch (error) {
        console.log("Ошибка при копировании:", error);
      }
    }
  };

  const getRewardStars = () => {
    if (completionPercentage >= 100) return 5;
    if (completionPercentage >= 80) return 4;
    if (completionPercentage >= 60) return 3;
    if (completionPercentage >= 40) return 2;
    return 1;
  };

  const stars = getRewardStars();

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        pointerEvents: "auto",
      }}
    >
      <div
        className="card shadow-xss rounded-xxl border-0 p-4 bg-white w-100"
        style={{
          maxWidth: "500px",
          position: "relative",
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
          }}
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Заголовок */}
        <div className="text-center mb-4">
          {isOwner && (
            <>
              <div className="mb-3">
                <Trophy className="w-16 h-16 text-warning mx-auto mb-2" />
              </div>
              <h2 className="fw-bold text-success mb-2">Поздравляем!</h2>
            </>
          )}
          <h3 className="fw-bold mb-2">Челлендж завершён!</h3>
          <p className="text-muted">
            {isOwner
              ? "Вы достигли своей цели"
              : `${ownerName || "Пользователь"} уже завершил челлендж`}
          </p>
          <h6 className="fw-bold mb-2">{challenge.title}</h6>
        </div>

        {/* Статистика */}
        <div className="mb-4">
          <div className="row g-3">
            <div className="col-6">
              <div className="card bg-light border-0 p-3 text-center">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="fw-bold text-primary">
                  {completionPercentage}%
                </div>
                <div className="text-muted font-xsss">Выполнено</div>
              </div>
            </div>
            <div className="col-6">
              <div className="card bg-light border-0 p-3 text-center">
                <Calendar className="w-6 h-6 text-success mx-auto mb-2" />
                <div className="fw-bold text-success">
                  {daysCompleted}/{totalDays}
                </div>
                <div className="text-muted font-xsss">Дней</div>
              </div>
            </div>
          </div>
        </div>

        {/* Награды / Оценка */}
        <div className="mb-4">
          <h5 className="fw-bold mb-3">
            {isOwner ? "Ваши награды:" : "Оценка челленджа:"}
          </h5>
          <div className="d-flex justify-content-center mb-3">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-6 h-6 me-1 ${index < stars ? "text-warning fill-current" : "text-muted"}`}
              />
            ))}
          </div>
          <div className="text-center">
            <span className="badge bg-warning text-dark px-3 py-2">
              {isOwner ? `${stars} из 5 звёзд` : `${stars} из 5 звёзд`}
            </span>
          </div>
        </div>

        {/* Детали челленджа */}
        <div className="mb-4">
          <div className="card bg-light border-0 p-3">
            <h6 className="fw-bold mb-2">Детали челленджа:</h6>
            {challenge.content && (
              <p className="text-muted font-xsss mb-2">{challenge.content}</p>
            )}
            <div className="d-flex justify-content-between text-muted font-xsss">
              <span>
                Частота:{" "}
                {challenge.frequency === "daily"
                  ? "Ежедневно"
                  : challenge.frequency === "weekly"
                    ? "Еженедельно"
                    : "Ежемесячно"}
              </span>
              <span>
                Создан:{" "}
                {new Date(challenge.created_at).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-light flex-grow-1"
          >
            Закрыть
          </button>
          {isOwner && (
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <Share2 className="w-4 h-4 me-2" />
              Поделиться
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChallengeCompleteModal;

