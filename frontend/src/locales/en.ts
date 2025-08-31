export const en = {
  // Common elements
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    back: "Back",
    next: "Next",
    submit: "Submit",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    copy: "Copy link",
    share: "Share",
    removeMedia: "Remove media",
    sending: "Sending...",
    like: "Like",
    shareUnavailable: "Sharing is not available on this device",
  },

  // Navigation
  navigation: {
    home: "Home",
    profile: "Profile",
    settings: "Settings",
    challenges: "Challenges",
    promises: "Promises",
    leaders: "Leaders",
    shop: "Shop",
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: "Welcome to",
      subtitle: "IPU is where promises turn into action.",
      description: "Your word is your power!",
      startButton: "Start",
    },
    features: {
      title: "What can you do in IPU?",
      features: {
        0: "Make promises to yourself or others",
        1: "Get support and validation",
        2: "Launch challenges and track them",
        3: 'Earn "Karma" through action',
        4: "Gain achievements. Be the role model.",
      },
      nextButton: "Next",
    },
    promises: {
      title: "Promises in IPU",
      features: {
        0: "To yourself or someone else",
        1: "Public or private",
        2: "Add details, photos, or videos",
        3: "Set deadlines and conditions",
      },
      description:
        'Complete a promise — earn "Karma". Extra Karma if it was made to someone else.',
      nextButton: "Next",
    },
    challenges: {
      title: "Challenges in IPU",
      features: {
        0: "Create your own challenge",
        1: "Choose frequency: daily, weekly, or monthly",
        2: "Share, invite friends, get support",
        3: 'Stay on track — earn "Karma" and rewards',
      },
      nextButton: "Next",
    },
    terms: {
      title: "Before you begin:",
      description: "By using IPU, you agree to:",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Use",
      acceptButton: "I agree",
      dontShowAgain: "Don't show this again",
      startButton: "Let's Go!",
    },
  },

  // Menu
  menu: {
    title: "Menu",
    website: "Website",
    telegram: "Telegram",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "Youtube",
    profileSettings: "Profile & Settings",
    settings: "Settings",
    faq: "FAQ",
    support: "Support",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
  },

  // Karma History
  karmaHistory: {
    title: "Karma History",
    subtitle: "View your achievements and karma changes",
    loading: "Loading karma history...",
    error: "Loading error",
    currentKarma: "Current karma",
    recentChanges: "Recent changes",
    records: "records",
    loadMore: "Load more",
    empty: "Karma history is empty",
    emptyDescription: "Create and complete promises to earn karma!",
    info: {
      title: "What is Karma?",
      description:
        "Karma is the internal points system. You earn it by:\n• Completing promises\n• Fulfilling challenges\n• Inviting users\n• Supporting others",
      buttons: {
        close: "Got it",
      },
      aria: {
        openInfo: "Open information",
      },
    },
  },

  // Profile
  profile: {
    userInfo: {
      title: "User Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      about: "About You",
      saveButton: "Save Changes",
    },
  },

  // Store and leaders
  store: {
    title: "IPU Store in development",
  },
  leaders: {
    title: "Top-30 Users",
    loading: "Loading...",
    empty: "No leaders yet",
    periods: {
      day: "Day",
      week: "Week",
      all: "All time",
    },
    error: {
      loading: "Loading error",
      retry: "Try again",
    },
  },

  // Status
  status: {
    deadlinePassed: "The deadline has passed",
    progress: "Progress",
    deadline: "Deadline",
    created: "Created date",
    active: "Active",
    completed: "Completed",
    challenge: "Challenge",
    waitingCompletion: "Waiting for completion",
    notConfirmed: "Not confirmed",
    result: "Result",
  },

  // Subscriptions
  subscriptions: {
    mySubscriptions: "My subscriptions",
    observers: "Observers",
  },

  // Posts list
  list: {
    mySubscriptions: "My subscriptions",
    loadingPosts: "Loading posts...",
    guest: "Guest",
    loadMore: "Load more",
    noMorePosts: "No more posts",
  },

  // Create promises
  promiseCreate: {
    title: "Create a Promise",
    subtitle:
      "Describe your promise, choose the type, and set a deadline if needed.",
    form: {
      title: "Promise title",
      type: "Promise Type",
      public: "Public",
      private: "Private",
      recipient: "Who are you making a promise to?",
      toYourself: "Promise to yourself",
      toSomeone: "Promise to someone",
      deadline: "Choose a due date",
      description: "Enter promise text",
      hashtags: "Hashtags (up to 5)",
      hashtagsPlaceholder: "Enter a hashtag and press Enter",
      popularHashtags: "Popular hashtags:",
      media: "Attach photo/video",
    },
    info: {
      publicPrivate: {
        title: "Private / Public",
        private:
          "Private — only you can see your promise. Great for personal goals and habits.",
        public:
          "Public — your promise will be visible to other users. It helps you get support, inspiration, and extra motivation.",
      },
      toSelfToSomeone: {
        title: "Promise to yourself / Promise to someone",
        toYourself:
          "To yourself — a regular promise: you set the goal and track your own progress.",
        toSomeone:
          "To someone — a directed promise: choose a recipient who can accept or decline it. Completion is confirmed by both sides.",
      },
      buttons: {
        close: "Got it",
        moreInfo: "Learn more",
      },
      aria: {
        openInfo: "Open information",
      },
    },
    buttons: {
      cancel: "Cancel",
      create: "Create",
    },
    errors: {
      deadlinePast: "Deadline must be in the future.",
    },
  },

  // Create challenges
  challengeCreate: {
    title: "Create a Challenge",
    subtitle:
      "Describe your challenge, set the frequency and number of required reports.",
    form: {
      title: "Enter a short title",
      frequency: "Choose how often to complete actions:",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      reportsCount: "Enter the number of check-ins (1-100)",
      description: "Describe the goal and details of the challenge",
      hashtags: "Hashtags (up to 5)",
      hashtagsPlaceholder: "Enter a hashtag and press Enter",
      popularHashtags: "Popular hashtags:",
      media: "Attach a photo or video",
    },
    info: {
      title: "What is a challenge?",
      description:
        "A challenge is a series of actions with regularity and purpose. You define the frequency and number of check-ins, attach photos/videos, and track progress.",
      reportsCount:
        'Number of reports is how many times you need to report on completion. For example, if "Daily" is selected and 30 reports, the challenge lasts 30 days.',
      buttons: {
        close: "Got it",
      },
      aria: {
        openInfo: "Open information",
      },
    },
    buttons: {
      cancel: "Cancel",
      create: "Create",
    },
  },

  // Challenge view
  challengeView: {
    frequency: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
    },
    noReports: "No reports",
    loadingParticipants: "Loading participants...",
    nextCheck: "Next Check-in:",
    deleteChallenge: "Delete challenge",
    confirmDelete: "Are you sure you want to delete this challenge?",
  },

  // Challenge in progress
  challengeProgress: {
    title: "Challenge in Progress!",
    subtitle:
      "You're on track — log your progress and get one step closer to your goal!",
    report: "Your Check-In",
    description: "Describe what you did today",
    media: "Attach Photo/Video",
    submitButton: "Submit Check-In",
  },

  // Complete promise
  promiseComplete: {
    title: "Complete Your Promise",
    subtitle: "Describe the result. Attach a photo or video if needed.",
    result: "Promise Result",
    media: "Attach Photo / Video",
    buttons: {
      cancel: "Cancel",
      complete: "Complete",
    },
  },

  // Promise result
  promiseResult: {
    title: "Promise Result",
    completedOn: "Completed on:",
    closeButton: "Close",
  },

  // Promise actions
  promiseActions: {
    accept: "Accept",
    reject: "Reject",
  },

  // Create
  create: {
    promise: "Create a promise",
    challenge: "Create a challenge",
  },

  // Tracker
  tracker: {
    createdOn: "Created on",
    dailyCheck: "Daily check-in",
    progressTracker: "Progress tracker",
    followChallenge: "Follow the challenge",
  },

  // Leader card
  leaderCard: {
    rank: "Rank",
    karma: "Karma",
  },

  // Profile card
  profileCard: {
    subscribers: "Subscribers",
    promises: "Promises",
    completed: "Completed",
    karma: "Karma",
    saving: "Saving...",
    save: "Save",
    notSpecified: "Not specified",
    processing: "Processing...",
    subscribed: "You are subscribed",
    subscribe: "Subscribe",
  },

  // Profile details
  profileDetail: {
    information: "Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    about: "About",
    name: "Name",
    notSpecified: "Not specified",
    telegramUsername: "TG Username",
    telegramUsernameTooltip:
      "Telegram username remains unchanged for optimal user search and account linking.",
  },

  // Promise view
  promiseView: {
    guest: "Guest",
    private: "Private",
    createReport: "Create report",
    confirmCompletion: "Confirm completion",
    tooltip: {
      earlyCompletion:
        "You can complete a promise no earlier than 3 hours after creation",
      deadlineOnly: "You can complete a promise only before the deadline",
      timeRemaining: "Remaining",
    },
    menu: {
      viewProfile: "View profile",
      deletePromise: "Delete promise",
    },
    confirm: {
      delete: "Are you sure you want to delete this promise?",
    },
    success: {
      linkCopied: "Link copied!",
    },
    errors: {
      completionError: "Error completing promise",
      uploadError: "File upload error",
      reportError: "Error sending report",
      shareUnavailable: "Sharing is not available on this device",
    },
  },

  // Promise completion report for recipient
  promiseCompleteForRecipient: {
    title: "Create completion report",
    description:
      "Write a report about how you completed the promise. After submission, the recipient will be able to confirm completion.",
    form: {
      placeholder: "Describe how you completed the promise...",
      attachMedia: "Attach photo/video",
    },
    buttons: {
      submit: "Submit report",
    },
  },

  // User search
  userSearch: {
    placeholder: "Search users...",
    loading: "Loading...",
    noResults: "No results found",
    errors: {
      searchError: "Search error",
    },
  },

  // Header
  header: {
    notifications: "Notifications",
    user: "User",
    min: "min",
    notificationMessage: "This is a notification message.",
    resources: "Resources",
    account: "Account",
  },

  // User profile page
  userProfile: {
    loadingProfile: "Loading profile...",
    loadMore: "Load more",
    noMorePosts: "No more posts",
  },

  // Settings page
  settings: {
    loadingSettings: "Loading settings...",
  },

  // Shop
  shop: {
    title: "IPU Shop",
    inDevelopment: "in development",
  },

  // Hashtags
  hashtags: {
    placeholder: "Enter hashtag and press Enter",
    popular: "Popular hashtags",
    maxReached: "Maximum 5 hashtags",
    addHashtag: "Add hashtag",
    removeHashtag: "Remove hashtag",
  },

  // Karma reasons
  karmaReasons: {
    challengeCreation: "Challenge creation",
    promiseCreation: "Promise creation",
    userSubscription: "User subscription",
    promiseCompletion: "Promise completion",
    challengeReport: "Challenge report",
    promiseAccepted: "Promise accepted",
    promiseRejected: "Promise rejected",
    challengeCompleted: "Challenge completed",
    dailyCheck: "Daily check",
    weeklyCheck: "Weekly check",
    monthlyCheck: "Monthly check",
    promiseDeletion: "Promise deletion",
    promiseCompletionForOther: "Promise completion for another person",
  },

  // Privacy Policy
  privacyPolicy: {
    title: "Privacy Policy",
    description:
      "This Privacy Policy explains how DexStudioApp Inc collects, uses, and protects your data when you use the IPU Telegram Mini App.",
    effectiveDate: "Effective Date: August 14, 2025",
    lastUpdated: "Last Updated: August 14, 2025",
    entity: "Effective entity: DexStudioApp Inc",
    address: "Registered Address: 8 The Green, Dover, DE 19901, Delaware, USA",
    contactEmail: "Contact email: info@dexsa.site",
    intro:
      'DexStudioApp Inc ("DexStudioApp", "we", "us", or "our") values your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our IPU application, available as a Telegram Mini App.',
    sections: {
      whatWeCollect: {
        title: "1. What We Collect",
        items: [
          "Telegram user ID, username, and profile picture.",
          "Actions within the app (promises, challenges, referrals, etc.).",
          "Device data for diagnostics (OS, browser).",
          "Referral and gamification activity.",
          "Operational data stored in our database (Supabase/PostgreSQL) for app functionality.",
        ],
      },
      whyWeCollect: {
        title: "2. Why We Collect It",
        items: [
          "Enable core features (e.g., progress tracking, social interactions).",
          "Improve user experience and app performance.",
          "Detect abuse and ensure fair use.",
          "Provide customer support.",
        ],
      },
      legalBasis: {
        title: "3. Legal Basis & Consent",
        text: "By using our app, you consent to the collection and processing of your data in accordance with this Privacy Policy. If you do not agree, please stop using the app and request data deletion.",
      },
      dataSharing: {
        title: "4. Data Sharing",
        text: "We do not share your data with anyone, except trusted service providers (e.g., Supabase for hosting and database, analytics tools) strictly to operate app features. If required by law, we may disclose your data to authorities.",
      },
      dataStorage: {
        title: "5. Data Storage & Retention",
        items: [
          "Data is stored securely using encryption and access controls.",
          "Retention period: 3 months after your last activity. After this period, data is permanently deleted.",
        ],
      },
      internationalTransfers: {
        title: "6. International Data Transfers",
        text: "Our services may transfer and store your data outside your country, including in the United States, where our hosting and service providers operate. We take reasonable measures to ensure data protection in compliance with applicable laws.",
      },
      cookies: {
        title: "7. Cookies & Local Storage",
        text: "We use local storage within your browser to save session information and improve performance. We do not use third-party tracking cookies.",
      },
      yourRights: {
        title: "8. Your Rights",
        items: [
          "Request a copy of your data.",
          "Request correction or deletion of your data.",
          "Withdraw consent at any time by contacting info@dexsa.site.",
        ],
      },
      changes: {
        title: "9. Changes to this Policy",
        text: "We may update this Privacy Policy from time to time. Changes will be posted in the app and on our website. Continued use of the app after changes constitutes acceptance of the updated policy.",
      },
      contact: "Contact: info@dexsa.site",
    },
  },

  // Terms of Use
  termsOfUse: {
    title: "Terms of Use",
    description:
      'By using our services (the "Service"), including the IPU Telegram Mini App, you agree to these Terms.',
    effectiveDate: "Effective Date: August 16, 2025",
    entity: "Entity: DexStudioApp Inc, 8 The Green, Dover, DE 19901, USA",
    contact: "Contact: info@dexsa.site",
    sections: {
      eligibility: {
        title: "1. Eligibility & Account",
        text: "You must comply with Telegram's Terms of Service and all applicable laws. You are responsible for all activity performed under your Telegram account while using the Service.",
      },
      fairUse: {
        title: "2. Fair Use & Prohibited Conduct",
        text: "You agree not to: (a) spam, scam, harass, or abuse others; (b) upload or share illegal, harmful, or misleading content; (c) hack, probe, or disrupt the Service; (d) scrape or reverse-engineer without written permission; (e) impersonate others; (f) infringe IP or privacy rights.",
      },
      content: {
        title: "3. Content & License",
        text: "You retain rights to content you submit. You grant DexStudioApp a non-exclusive, worldwide, royalty-free license to host, display, and operate your content within the Service to provide its features. You represent you have the rights to grant this license.",
      },
      rewards: {
        title: "4. Rewards & Virtual Items (incl. Telegram Stars)",
        text: "Points, badges, and Telegram Stars are virtual items with no monetary value, unless expressly stated by us. Availability, balances, and rules may change or be revoked (e.g., for abuse). For Stars, Telegram's policies and refund rules apply.",
      },
      privacy: {
        title: "5) Privacy",
        text: "Our data processing is described in the Privacy Policy: /projects/ipu/privacy-policy. By using the Service, you acknowledge that policy.",
      },
      termination: {
        title: "6. Termination",
        text: "We may suspend or terminate access for violations of these Terms or applicable law. You may stop using the Service anytime and request data deletion per the Privacy Policy.",
      },
      disclaimer: {
        title: "7. Disclaimer; Limitation of Liability (short)",
        text: 'The Service is provided "as is" and "as available." To the maximum extent permitted by law, DexStudioApp is not liable for indirect, incidental, special, or consequential damages, or loss of data or profits. Nothing here limits liability where it cannot be limited by law. Your mandatory consumer rights remain unaffected.',
      },
      changes: {
        title: "8. Changes",
        text: "We may update the Service and these Terms. Material changes will be announced in-app. Continued use after changes take effect means you accept the updated Terms.",
      },
    },
  },

  // FAQ
  faq: {
    title: "Frequently Asked Questions (FAQ)",
    sections: {
      general: {
        title: "General",
        questions: [
          {
            question: "What is IPU?",
            answer:
              "IPU (I Promise You) is an app where your promises become actions. It's a personal growth tool and social network built on integrity, responsibility, and truth.",
          },
          {
            question: "Who created IPU?",
            answer:
              "IPU is a product of DEXSTUDIOAPP Inc. We're a Delaware-based startup with an international team building tools for the future.",
          },
          {
            question: "Why does this app exist?",
            answer:
              "To help people become better by standing behind their words. Here, your intentions turn into progress and social validation.",
          },
        ],
      },
      promises: {
        title: "Promises",
        questions: [
          {
            question: "What is a promise in IPU?",
            answer:
              "A promise is a commitment — to yourself or someone else. You can make it private or public, add a deadline, description, media, and hashtags.",
          },
          {
            question: "How to create a promise?",
            answer:
              '1. Tap "Create Promise"\n2. Set title, type (private/public)\n3. Choose who it\'s for: yourself or an IPU user\n4. If the person is not yet in IPU, invite them via referral link\n5. Set deadline\n6. Add description, tags, and media\n7. Tap "Create"',
          },
          {
            question: "Can I complete a promise early?",
            answer: "Yes, but not sooner than 3 hours after it's created.",
          },
          {
            question: "Can I delete a promise?",
            answer: "Yes, but only within 6 hours of creation.",
          },
          {
            question: "How do I earn karma for promises?",
            answer:
              "• Completing a personal promise = karma\n• Completing a promise to someone else = more karma\n• Inviting a user via referral = extra karma",
          },
          {
            question: "What happens when I give a promise to another user?",
            answer:
              "They must accept or decline it. Once accepted, it becomes active. After completion, they validate or reject the result.",
          },
        ],
      },
      challenges: {
        title: "Challenges",
        questions: [
          {
            question: "What is a challenge?",
            answer:
              "A recurring activity you commit to (e.g. daily journaling). You define frequency and number of reports.",
          },
          {
            question: "How to create a challenge?",
            answer:
              "1. Set name\n2. Choose frequency (daily/weekly/monthly)\n3. Set number of reports\n4. Add description, tags, and media\n5. Create and start",
          },
          {
            question: "How to begin a challenge?",
            answer: 'Press "Start", add your first report with text and media.',
          },
          {
            question: "Can I delete a challenge?",
            answer: "Yes, within 6 hours of creation.",
          },
        ],
      },
      following: {
        title: "Following Other Challenges",
        questions: [
          {
            question: "Can I join someone else's challenge?",
            answer:
              "Not yet. Currently, you can only follow their progress as an Observer.",
          },
          {
            question: "What is this feature called?",
            answer:
              'The button might say "Follow Challenge". Observers track the challenge and support the creator.',
          },
        ],
      },
      karma: {
        title: "Karma & Rewards",
        questions: [
          {
            question: "What is Karma?",
            answer:
              "Karma is the internal points system. You earn it by:\n• Completing promises\n• Fulfilling challenges\n• Inviting users\n• Supporting others",
          },
          {
            question: "What can I do with Karma?",
            answer:
              "A Marketplace is coming soon. You'll be able to trade karma for:\n• Visual rewards\n• Skins & upgrades\n• Access to special features",
          },
        ],
      },
      leaderboard: {
        title: "Leaderboard",
        questions: [
          {
            question: "Where can I see my progress?",
            answer:
              "Our Leaderboard is already live. You'll see:\n• Top promise keepers\n• Top challenge finishers\n• Most karma earned this week/month",
          },
        ],
      },
      profile: {
        title: "Profile & Settings",
        questions: [
          {
            question: "What can I change?",
            answer:
              '• First name, last name, email\n• Profile picture & background\n• "About me" section',
          },
          {
            question: "Why do I need an email?",
            answer:
              "It will be used for login in our main app and account recovery.",
          },
        ],
      },
      invites: {
        title: "Invites & Social",
        questions: [
          {
            question: "How to invite a friend?",
            answer:
              "When creating a promise to someone, enter their Telegram @username. They'll receive a referral link.",
          },
          {
            question: "Do I get Karma for referrals?",
            answer: "Yes. Successful invites bring bonus karma.",
          },
          {
            question: "Where to follow updates?",
            answer: "Stay connected:\n• Telegram-channel IPU",
          },
        ],
      },
      support: {
        title: "Support",
        questions: [
          {
            question: "Something's broken. What now?",
            answer: "Go to Support in the menu. We'll reply ASAP.",
          },
          {
            question: "Where are the rules?",
            answer: "In the app menu:\n• Privacy Policy\n• Terms of Use",
          },
        ],
      },
    },
  },
};

