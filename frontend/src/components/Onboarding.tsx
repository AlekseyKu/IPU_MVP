'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();

  const screens = [
    {
      title: t('onboarding.welcome.title'), // "Добро пожаловать в I PROMISE YOU"
      subtitle: t('onboarding.welcome.subtitle'), // "IPU - это место, где обещания становятся реальными действиями."
      slogan: t('onboarding.welcome.description'), // "Твое слово - твоя сила!"
      buttonText: t('onboarding.welcome.startButton'), // "Начать"
      showProgress: false
    },
    {
      title: t('onboarding.features.title'), // "Что ты можешь в IPU?"
      features: [
        t('onboarding.features.features.0'), // "Обещать себе или другим"
        t('onboarding.features.features.1'), // "Получать поддержку и одобрение"
        t('onboarding.features.features.2'), // "Запускать челленджи и следить за ходом выполнения"
        t('onboarding.features.features.3'), // "Копить "Карму" за действия"
        t('onboarding.features.features.4'), // "Получать титулы. Быть примером."
      ],
      buttonText: t('onboarding.features.nextButton'), // "Далее"
      showProgress: true
    },
    {
      title: t('onboarding.promises.title'), // "Обещания в IPU"
      features: [
        t('onboarding.promises.features.0'), // "Себе или другим"
        t('onboarding.promises.features.1'), // "Публично или лично"
        t('onboarding.promises.features.2'), // "С описанием, фото, видео"
        t('onboarding.promises.features.3'), // "С дедлайном и деталями"
      ],
      buttonText: t('onboarding.promises.nextButton'), // "Далее"
      showProgress: true
    },
    {
      title: t('onboarding.challenges.title'), // "Челленджи в IPU"
      features: [
        t('onboarding.challenges.features.0'), // "Придумывай вызов — себе и друзьям"
        t('onboarding.challenges.features.1'), // "Задай ритм: каждый день или по расписанию"
        t('onboarding.challenges.features.2'), // "Делись, зови друзей, набирай поддержку"
        t('onboarding.challenges.features.3'), // "Выполняй — получай "Карму" и награды"
      ],
      buttonText: t('onboarding.challenges.nextButton'), // "Далее"
      showProgress: true
    },
    {
      title: t('onboarding.terms.title'), // "Перед стартом:"
      features: [
        t('onboarding.terms.description'), // "Используя IPU, вы принимаете Политику конфиденциальности и Условия использования."
      ],
      buttonText: t('onboarding.terms.startButton'), // "Вперёд!"
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
                  <div className="d-flex justify-content-center align-items-center bg-white">
                    <img
                      src="/assets/images/ipu/logo_512.png"
                      alt="IPU Logo"
                      className="logo-onboarding"
                    />
                  </div>
                  <h1 key={`title-${currentScreen}`} className="onboarding-title mb-4 fade-in text-center">
                    <div className="text-center">
                      {t('onboarding.welcome.title')}
                      <br />
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
                  {Array.isArray(currentScreenData.features) && currentScreenData.features.map((feature: string, index: number) => (
                    <div 
                      key={`${currentScreen}-${index}`} 
                      className="d-flex justify-content-start align-items-start onboarding-feature mb-3 fade-in text-start"
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
                        {t('onboarding.terms.description')} {/* "Используя IPU, вы принимаете:" */}
                        <button 
                          onClick={openPrivacyPolicy}
                          className="btn btn-link text-decoration-none p-0"
                          style={{ cursor: 'pointer' }}
                        >
                          {t('onboarding.terms.privacyPolicy')} {/* "Политику конфиденциальности" */}
                        </button>
                        {' '}и{' '}
                        <button 
                          onClick={openTermsOfService}
                          className="btn btn-link text-decoration-none p-0"
                          style={{ cursor: 'pointer' }}
                        >
                          {t('onboarding.terms.termsOfService')} {/* "Условия использования" */}
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
                        {t('onboarding.terms.acceptButton')} {/* "Я согласен(а)" */}
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
                        {t('onboarding.terms.dontShowAgain')} {/* "Не показывать это снова при входе" */}
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
                {loading ? t('common.loading') : currentScreenData.buttonText}
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