const SITE_CONFIG_EXAMPLE = {
  ABOUT: {
    ACTIVE: true
  },
  ACTIVITY: {
    ACTIVE: true
  },
  CUSTOM_FIELDS: {
    ACTIVE: true
  },
  DASHBOARD: {
    ACTIVE: true
  },
  DATASET: {
    ACTIVE: true
  },
  DATATABLE: {
    ACTIVE: true
  },
  DISCUSSION: {
    ACTIVE: true
  },
  DOCUMENT: {
    ACTIVE: true,
    GEOENTITY_SEARCH: true
  },
  DOWNLOAD_LOGS: {
    ACTIVE: true
  },
  FEEDBACK: {
    ACTIVE: true,
    URL: "https://forms.gle/G4Gi6NpuvnRRuDCc8"
  },
  FILTER: {
    DISTRICT: true,
    STATE: true,
    PROTECTED_AREAS: false,
    TAHSIL: true
  },
  FOOTER: {
    ACTIVE: true,
    CREDITS: true,
    PARTNER: true,
    SOCIAL: {
      FACEBOOK: {
        LABEL: "footer.facebook",
        URL: "https://www.facebook.com/indiabiodiversity"
      },
      GITHUB: {
        LABEL: "footer.github",
        URL: "https://github.com/strandls?q=biodiv"
      },
      MAIL: {
        LABEL: "footer.email",
        URL: "mailto:support@indiabiodiversity.org"
      },
      TWITTER: {
        HANDLE: "@inbiodiversity",
        LABEL: "footer.twitter",
        URL: "https://twitter.com/inbiodiversity"
      }
    }
  },
  GEOSERVER: {
    STORE: "ibp",
    WORKSPACE: "biodiv"
  },
  HEADER: {
    IDAO: {
      ACTIVE: false,
      LINK: "x"
    }
  },
  HOME: {
    DONORS: false,
    FEATURES: "ibp",
    GALLERY: true,
    MAP: [],
    PARTNERS: true,
    SPONSORS: true,
    STATS: true
  },
  LANDSCAPE: {
    ACTIVE: false
  },
  LANG: {
    DEFAULT: "en",
    DEFAULT_ID: 205,
    LIST: {
      en: {
        I: "english",
        ID: 205,
        NAME: "English"
      }
    },
    SWITCHER: true
  },
  LEADERBOARD: {
    ACTIVE: true
  },
  LICENSE: {
    DEFAULT: "822"
  },
  MAP: {
    ACTIVE: true,
    CENTER: {
      latitude: 20.7,
      longitude: 79.05,
      zoom: 0
    },
    COUNTRY: "IN",
    DEFAULT_LAYERS: false
  },
  OBSERVATION: {
    ACTIVE: true
  },
  OFFLINE: {
    ACTIVE: false
  },
  PAGES: {
    ABOUT: "/page/show/1",
    ACTIVE: true,
    PRIVACY: "/page/show/1",
    TERMS: "/page/show/1"
  },
  PARTICIPANTS: {
    ACTIVE: true
  },
  REGISTER: {
    MOBILE: true
  },
  SITE: {
    API_ENDPOINT: "http://localhost:8010/proxy/",
    API_ENDPOINT_SSR: "http://localhost:8010/proxy/",
    DESCRIPTION: "A unique repository of information on India's biodiversity",
    GOV: {
      ACTIVE: false,
      ICON: "/get/crop/logo/gov.png",
      NAME: "Government of XYZ"
    },
    ICON: "/get/crop/logo/IBP.png",
    TITLE: {
      en: "India Biodiversity Portal"
    },
    TITLE_LOCAL: "xyz",
    URL: "http://localhost:3000"
  },
  SPECIES: {
    ACTIVE: true
  },
  TAXONOMY: {
    CLASSIFICATION_ID: 1,
    TAXON_ID: 1
  },
  TOKENS: {
    GMAP: "AIzax",
    MAPBOX: "pk.x",
    OAUTH_GOOGLE: "x.apps.googleusercontent.com",
    RECAPTCHA: "x",
    SENTRY_DSN: false
  },
  TRACKING: {
    ENABLED: true,
    GA_ID: "UA-x"
  },
  USERGROUP: {
    ACTIVE: true
  }
};

module.exports = SITE_CONFIG_EXAMPLE;
