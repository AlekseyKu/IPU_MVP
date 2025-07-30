'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const router = useRouter();
  const { telegramId } = useUser();

  const screens = [
    {
      title: 'Добро пожаловать в \n I PROMISE YOU',
      subtitle: 'IPU - это приложение, где обещания становятся реальными действиями.',
      slogan: 'Твое слово - Твоя сила!',
      buttonText: 'Начать',
      showProgress: false
    },
    {
      title: 'Что ты можешь делать в IPU?',
      features: [
        'Обещать себе и другим',
        'Получать подтверждение и поддержку',
        'Запускать челленджи и звать друзей',
        'Зарабатывать очки и звёзды',
        'Получать титулы и становиться примером'
      ],
      buttonText: 'Далее',
      showProgress: true
    },
    {
      title: 'IPU Обещания',
      features: [
        'Создавай обещания для себя или другим',
        'Публичные или личные обещания',
        'Добавляй описание, фото или видео',
        'Устанавливай дедлайн и условия',
        'Получай бонусы за выполнение обещаний для других',
      ],
      buttonText: 'Далее',
      showProgress: true
    },
    {
      title: 'IPU Челленджи',
      features: [
        'Придумывай челленджи и ставь цель',
        'Выбирай частоту: ежедневно, еженедельно или ежемесячно',
        'Делись с друзьями и зови участников',
        'Отслеживай прогресс и получай награды'
      ],
      buttonText: 'Далее',
      showProgress: true
    },
    {
      title: 'Политики и условия',
      features: [
        'Используя IPU, вы принимаете:',
        '[Политику конфиденциальности]',
        '[Условия использования]'
      ],
      buttonText: 'Готово',
      showProgress: true,
      showCheckboxes: true
    }
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleComplete = async () => {
    if (!agreeToTerms) return;
    
    setLoading(true);
    
    if (dontShowAgain && telegramId) {
      const { error } = await supabase
        .from('users')
        .update({ hideWelcomePage: true })
        .eq('telegram_id', telegramId);

      if (error) {
        console.error('Failed to update hideWelcomePage:', error.message);
      }
    }
    
    onComplete();
  };

  const openPrivacyPolicy = () => {
    setShowPrivacyModal(true);
  };

  const openTermsOfService = () => {
    setShowTermsModal(true);
  };

  const currentScreenData = screens[currentScreen];

    return (
      <div className="d-flex justify-content-center align-items-center vh-100 p-3">
        <div className="card shadow-md rounded-xxl border-0 w-100 h-100" style={{ maxWidth: '600px' }}>
          <div className="onboarding-container d-flex flex-column h-100">
          {/* Header with back button - скрыт на первом экране */}
          <div className="onboarding-header p-3" style={{ visibility: currentScreen > 0 ? 'visible' : 'hidden' }}>
            <button 
              onClick={handleBack}
              className="btn btn-link text-decoration-none p-0"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          {/* Main content - между header и кнопкой */}
          <div className="onboarding-main-content flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div className="onboarding-content text-center px-3" style={{ maxWidth: '500px' }}>
              {/* Title, subtitle and slogan for screen 0 */}
              {currentScreen === 0 ? (
                <>
                  <h1 key={`title-${currentScreen}`} className="onboarding-title mb-4 fade-in text-center">
                    <div className="text-center">
                      Добро пожаловать в{' '} <br />
                      <span className="text-secondary">I</span>
                      {' '}
                      <span className="text-secondary">P</span>ROMISE{' '}YO
                      <span className="text-secondary">U</span>
                    </div>
                  </h1>
                  <p key={`subtitle-${currentScreen}`} className="onboarding-subtitle mb-3 fade-in text-center">
                    {currentScreenData.subtitle}
                  </p>
                  <p key={`slogan-${currentScreen}`} className="onboarding-slogan text-primary mb-4 fade-in text-center">
                    {currentScreenData.slogan}
                  </p>
                </>
              ) : (
                <>
                  <h1 key={`title-${currentScreen}`} className="onboarding-title mb-4 fade-in text-center" style={{ animationDelay: '0.1s' }}>
                    {currentScreenData.title}
                  </h1>
                </>
              )}

              {/* Features list for other screens */}
              {currentScreen > 0 && currentScreenData.features && currentScreen !== 4 && (
                <div key={`features-${currentScreen}`} className="onboarding-features mb-4">
                  {currentScreenData.features.map((feature, index) => (
                    <div 
                      key={`${currentScreen}-${index}`} 
                      className="onboarding-feature mb-3 fade-in"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Content for screen 4 */}
              {currentScreen === 4 && (
                <>
                  <div key={`policy-${currentScreen}`} className="onboarding-features mb-4">
                    <div className="onboarding-policy-text mb-3 fade-in text-center" style={{ animationDelay: '0.1s' }}>
                      <span>
                        Используя IPU, вы принимаете:{' '}
                        <button 
                          onClick={openPrivacyPolicy}
                          className="btn btn-link text-decoration-none p-0"
                          style={{ cursor: 'pointer' }}
                        >
                          Политику конфиденциальности
                        </button>
                        {' '}и{' '}
                        <button 
                          onClick={openTermsOfService}
                          className="btn btn-link text-decoration-none p-0"
                          style={{ cursor: 'pointer' }}
                        >
                          Условия использования
                        </button>
                      </span>
                    </div>
                  </div>
                  <div key={`checkboxes-${currentScreen}`} className="onboarding-checkboxes mb-4">
                    <div className="form-check color-black mb-3 fade-in" style={{ animationDelay: '0.3s' }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="agreeToTerms">
                        Согласен с политикой и условиями
                      </label>
                    </div>
                    <div className="form-check mb-3 fade-in" style={{ animationDelay: '0.4s' }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dontShowAgain"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="dontShowAgain">
                        Больше не показывать при входе
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action button - фиксирован над точками */}
          <div key={`actions-${currentScreen}`} className="onboarding-actions-section p-4">
            <div className="text-center">
              <button
                onClick={handleNext}
                className={`btn btn-outline-primary w-50 px-4 py-2 rounded fade-in ${currentScreen === 4 && !agreeToTerms ? 'disabled' : ''}`}
                disabled={currentScreen === 4 && !agreeToTerms || loading}
                style={{ animationDelay: '0.5s' }}
              >
                {loading ? 'Загрузка...' : currentScreenData.buttonText}
              </button>
            </div>
          </div>

          {/* Progress indicators - скрыт на первом экране */}
          <div key={`progress-${currentScreen}`} className="onboarding-progress p-3 fade-in" style={{ display: currentScreenData.showProgress ? 'block' : 'none', animationDelay: '0.6s' }}>
            <div className="d-flex justify-content-center gap-2">
              {screens.slice(1).map((_, index) => (
                <div
                  key={`${currentScreen}-${index}`}
                  className={`progress-dot ${currentScreen === index + 1 ? 'active' : ''}`}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: currentScreen === index + 1 ? '#0066ff' : '#cccccc',
                    transition: 'background-color 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Modals */}
          {showPrivacyModal && (
            <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
          )}
          {showTermsModal && (
            <TermsModal onClose={() => setShowTermsModal(false)} />
          )}
        </div>
        </div>
      </div>
    );
  };

export default Onboarding; 