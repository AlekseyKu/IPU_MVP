export const ru = {
  // Общие элементы
  common: {
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    submit: 'Отправить',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
    copy: 'Скопировать ссылку',
    share: 'Отправить',
    removeMedia: 'Удалить медиа',
    sending: 'Отправка...',
    like: 'Лайк',
    shareUnavailable: 'Поделиться недоступно на этом устройстве',
  },

  // Навигация
  navigation: {
    home: 'Главная',
    profile: 'Профиль',
    settings: 'Настройки',
    challenges: 'Челленджи',
    promises: 'Обещания',
    leaders: 'Лидеры',
    shop: 'Магазин',
  },

  // Онбординг
  onboarding: {
    welcome: {
      title: 'Добро пожаловать в',
      subtitle: 'IPU - это место, где обещания становятся реальными действиями.',
      description: 'Твое слово - твоя сила!',
      startButton: 'Начать',
    },
    features: {
      title: 'Что ты можешь в IPU?',
      features: {
        0: 'Обещать себе или другим',
        1: 'Получать поддержку и одобрение',
        2: 'Запускать челленджи и следить за ходом выполнения',
        3: 'Копить "Карму" за действия',
        4: 'Получать титулы. Быть примером.',
      },
      nextButton: 'Далее',
    },
    promises: {
      title: 'Обещания в IPU',
      features: {
        0: 'Себе или другим',
        1: 'Публично или лично',
        2: 'С описанием, фото, видео',
        3: 'С дедлайном и деталями',
      },
      description: 'Выполнил обещание — получил "Карму". Особенно если пообещал не себе, а кому-то.',
      nextButton: 'Далее',
    },
    challenges: {
      title: 'Челленджи в IPU',
      features: {
        0: 'Придумывай вызов — себе и друзьям',
        1: 'Задай ритм: каждый день или по расписанию',
        2: 'Делись, зови друзей, набирай поддержку',
        3: 'Выполняй — получай "Карму" и награды',
      },
      nextButton: 'Далее',
    },
    terms: {
      title: 'Перед стартом:',
      description: 'Используя IPU, вы принимаете:',
      privacyPolicy: 'Политику конфиденциальности',
      termsOfService: 'Условия использования',
      acceptButton: 'Я согласен(а)',
      dontShowAgain: 'Не показывать это снова при входе',
      startButton: 'Вперёд!',
    },
  },

  // Меню
  menu: {
    title: 'Меню',
    website: 'Наш сайт',
    telegram: 'Telegram',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'Youtube',
    profileSettings: 'Профиль и настройки',
    settings: 'Настройки',
    faq: 'Вопросы и ответы',
    support: 'Поддержка',
    legal: 'Правовая информация',
    privacyPolicy: 'Политика конфиденциальности',
    termsOfUse: 'Условия использования',
  },

  // История кармы
  karmaHistory: {
    title: 'История кармы',
    subtitle: 'Просмотр ваших достижений и изменений кармы',
    loading: 'Загрузка истории кармы...',
    error: 'Ошибка загрузки',
    currentKarma: 'Текущая карма',
    recentChanges: 'Последние изменения',
    records: 'записей',
    loadMore: 'Загрузить еще',
    empty: 'История кармы пуста',
    emptyDescription: 'Создавайте и выполняйте обещания, чтобы заработать карму!',
  },

  // Профиль
  profile: {
    userInfo: {
      title: 'Информация о пользователе',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      about: 'О себе',
      saveButton: 'Сохранить',
    },
  },

  // Магазин и лидеры
  store: {
    title: 'IPU Store in development',
  },
  leaders: {
    title: 'Топ-30 пользователей',
    loading: 'Загрузка...',
    empty: 'Пока нет лидеров',
    periods: {
      day: 'День',
      week: 'Неделя',
      all: 'За все время',
    },
    error: {
      loading: 'Ошибка загрузки',
      retry: 'Попробовать снова',
    },
  },

  // Статусы
  status: {
    deadlinePassed: 'Истек дедлайн',
    progress: 'Прогресс',
    deadline: 'Дедлайн',
    created: 'Создано',
    active: 'Активно',
    completed: 'Завершено',
    challenge: 'Челлендж',
    waitingCompletion: 'Ожидание завершения',
    notConfirmed: 'Не подтверждено',
    result: 'Результат',
  },

  // Подписки
  subscriptions: {
    mySubscriptions: 'Мои подписки',
    observers: 'Наблюдатели',
  },

  // Список постов
  list: {
    mySubscriptions: 'Мои подписки',
    loadingPosts: 'Загрузка постов...',
    guest: 'Гость',
  },

  // Создание обещаний
  promiseCreate: {
    title: 'Создать обещание',
    subtitle: 'Опишите ваше обещание, выберите тип, и при необходимости — дедлайн.',
    form: {
      title: 'Название обещания',
      type: 'Тип обещания',
      public: 'Публичное',
      private: 'Личное',
      recipient: 'Кому вы даёте обещание?',
      toYourself: 'Обещание себе',
      toSomeone: 'Обещание кому-то',
      deadline: 'Выберите дату выполнения',
      description: 'Введите текст обещания',
      hashtags: 'Хештеги (до 5)',
      hashtagsPlaceholder: 'Введите хештег и нажмите Enter',
      popularHashtags: 'Популярные хештеги:',
      media: 'Прикрепить фото/видео',
    },
    buttons: {
      cancel: 'Отмена',
      create: 'Создать',
    },
    errors: {
      deadlinePast: 'Дедлайн должен быть в будущем.',
    },
  },

  // Создание челленджей
  challengeCreate: {
    title: 'Создать челендж',
    subtitle: 'Опишите ваш челендж, выберите частоту и количество отчётных действий.',
    form: {
      title: 'Введите краткое название',
      frequency: 'Выберите, как часто нужно выполнять:',
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
      reportsCount: 'Количество отчётов (от 1-100)',
      description: 'Опишите челендж, в чём суть и цель',
      hashtags: 'Хештеги (до 5)',
      hashtagsPlaceholder: 'Введите хештег и нажмите Enter',
      popularHashtags: 'Популярные хештеги:',
      media: 'Прикрепите фото или видео',
    },
    buttons: {
      cancel: 'Отмена',
      create: 'Создать',
    },
  },

  // Просмотр челленджей
  challengeView: {
    frequency: {
      daily: 'Ежедневный',
      weekly: 'Еженедельный',
      monthly: 'Ежемесячный',
    },
    noReports: 'Нет отчетов',
    loadingParticipants: 'Загрузка участников...',
    nextCheck: 'Следующий Чек дня:',
    deleteChallenge: 'Удалить челлендж',
    confirmDelete: 'Вы уверены, что хотите удалить этот челлендж?',
  },

  // Челлендж в процессе
  challengeProgress: {
    title: 'Челлендж продолжается!',
    subtitle: 'Вы на верном пути — сделайте отчёт и станьте на шаг ближе к цели!',
    report: 'Ваш отчёт',
    description: 'Опишите, что вы сделали сегодня',
    media: 'Прикрепить фото/видео',
    submitButton: 'Сделать чек дня',
  },

  // Завершение обещания
  promiseComplete: {
    title: 'Завершить обещание',
    subtitle: 'Опишите результат, прикрепите фото или видео — если хотите.',
    result: 'Введите результат обещания',
    media: 'Прикрепить фото / видео',
    buttons: {
      cancel: 'Отмена',
      complete: 'Завершить',
    },
  },

  // Результат обещания
  promiseResult: {
    title: 'Результат обещания',
    completedOn: 'Завершено:',
    closeButton: 'Закрыть',
  },

  // Действия с обещаниями
  promiseActions: {
    accept: 'Принять',
    reject: 'Отказать',
  },

  // Создание
  create: {
    promise: 'Создать обещание',
    challenge: 'Создать челендж',
  },

  // Трекер
  tracker: {
    createdOn: 'Создано',
    dailyCheck: 'Чек дня',
    progressTracker: 'Трекер прогресса',
    followChallenge: 'Следить за челленджем',
    followedChallenge: 'Вы подписаны',
  },

  // Карточка лидера
  leaderCard: {
    rank: 'Ранг',
    karma: 'Карма',
  },

  // Карточка профиля
  profileCard: {
    subscribers: 'Подписчики',
    promises: 'Обещания',
    completed: 'Выполнено',
    karma: 'Карма',
    saving: 'Сохранение...',
    save: 'Сохранить',
    notSpecified: 'Не указано',
    processing: 'Обработка...',
    subscribed: 'Вы подписаны',
    subscribe: 'Подписаться',
  },

  // Детали профиля
  profileDetail: {
    information: 'Информация',
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'Email',
    about: 'О себе',
    name: 'Имя',
    notSpecified: 'Не указано',
    telegramUsername: 'TG Username',
    telegramUsernameTooltip: 'Telegram username остается неизменным для оптимального поиска и привязки пользователей к аккаунту.',
  },

  // Просмотр обещаний
  promiseView: {
    guest: 'Гость',
    private: 'Личное',
    createReport: 'Создать отчет',
    confirmCompletion: 'Подтвердить выполнение',
    tooltip: {
      earlyCompletion: 'Завершить обещание можно не раньше, чем через 3 часа после создания',
      deadlineOnly: 'Завершить обещание можно только до дедлайна',
      timeRemaining: 'Осталось',
    },
    menu: {
      viewProfile: 'Посмотреть профиль',
      deletePromise: 'Удалить обещание',
    },
    confirm: {
      delete: 'Вы уверены, что хотите удалить это обещание?',
    },
    success: {
      linkCopied: 'Ссылка скопирована!',
    },
    errors: {
      completionError: 'Ошибка при завершении обещания',
      uploadError: 'Ошибка загрузки файла',
      reportError: 'Ошибка при отправке отчета',
      shareUnavailable: 'Поделиться недоступно на этом устройстве',
    },
  },

  // Отчет о выполнении для получателя
  promiseCompleteForRecipient: {
    title: 'Создать отчет о выполнении',
    description: 'Напишите отчет о том, как вы выполнили обещание. После отправки получатель сможет подтвердить выполнение.',
    form: {
      placeholder: 'Опишите, как вы выполнили обещание...',
      attachMedia: 'Прикрепить фото/видео',
    },
    buttons: {
      submit: 'Отправить отчет',
    },
  },

  // Поиск пользователей
  userSearch: {
    placeholder: 'Поиск пользователей...',
    loading: 'Загрузка...',
    noResults: 'Ничего не найдено',
    errors: {
      searchError: 'Ошибка поиска',
    },
  },

  // Заголовок
  header: {
    notifications: 'Уведомления',
    user: 'Пользователь',
    min: 'мин',
    notificationMessage: 'Это сообщение уведомления.',
    resources: 'Ресурсы',
    account: 'Аккаунт',
  },

  // Страница пользователя
  userProfile: {
    loadingProfile: 'Загрузка профиля...',
  },

  // Страница настроек
  settings: {
    loadingSettings: 'Загрузка настроек...',
  },

  // Магазин
  shop: {
    title: 'Магазин IPU',
    inDevelopment: 'в разработке',
  },

  // Хэштеги
  hashtags: {
    placeholder: 'Введите хештег и нажмите Enter',
    popular: 'Популярные хештеги',
    maxReached: 'Максимум 5 хештегов',
    addHashtag: 'Добавить хештег',
    removeHashtag: 'Удалить хештег',
  },

  // Причины кармы
  karmaReasons: {
    challengeCreation: 'Создание челленджа',
    promiseCreation: 'Создание обещания',
    userSubscription: 'Подписка на пользователя',
    promiseCompletion: 'Получение выполненного обещания',
    challengeReport: 'Отчет в челлендже',
    promiseAccepted: 'Обещание принято',
    promiseRejected: 'Обещание отклонено',
    challengeCompleted: 'Челлендж завершен',
    dailyCheck: 'Ежедневный чек',
    weeklyCheck: 'Еженедельный чек',
    monthlyCheck: 'Ежемесячный чек',
    promiseDeletion: 'Удаление обещания',
    promiseCompletionForOther: 'Выполнение обещания для другого',
  },
}; 