const SITE_CONFIG_EXAMPLE = {
  ABOUT: {
    ACTIVE: true
  },
  ACTIVITY: {
    ACTIVE: true
  },
  CUSTOM_FIELDS: {
    ACTIVE: false
  },
  DASHBOARD: {
    ACTIVE: true
  },
  DATASET: {
    ACTIVE: true
  },
  DISCUSSION: {
    ACTIVE: true
  },
  DOCUMENT: {
    ACTIVE: true,
    GEOENTITY_SEARCH: true
  },
  FEEDBACK: {
    ACTIVE: true
  },
  FILTER: {
    DISTRICT: true,
    STATE: true,
    PROTECTED_AREAS:true,
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
  HOME: {
    DONORS: false,
    FEATURES: true,
    GALLERY: true,
    MAP: [],
    PARTNERS: true,
    SPONSORS: true,
    STATS: true
  },
  LANDSCAPE: {
    ACTIVE: true
  },
  LANG: {
    DEFAULT: "en",
    DEFAULT_ID: 205,
    LIST: {
      en: {
        ID: 205,
        NAME: "English"
      },
      fr: {
        ID: 219,
        NAME: "Français"
      },
      mg: {
        ID: 365,
        NAME: "Malagasy"
      }
    },
    SWITCHER: true
  },
  LICENSE: {
    DEFAULT: "822"
  },
  LEADERBOARD: {
    ACTIVE: true
  },
  MAP: {
    ACTIVE: true,
    CENTER: {
      latitude: 23.2,
      longitude: 83,
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
    ACTIVE: true
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
      ICON: "/get/crop/logo/gov.png",
      NAME: "Government of XYZ",
      ACTIVE: false
    },
    ICON: "/get/crop/logo/IBP.png",
    TITLE: "India Biodiversity Portal",
    TITLE_LOCAL: "xyz",
    URL: "http://localhost:3000"
  },
  SPECIES: {
    ACTIVE: true
  },
  TAXONOMY: {
    ROOT: 265799
  },
  TOKENS: {
    GMAP: "AIzax",
    MAPBOX: "pk.x",
    OAUTH_GOOGLE: "x.apps.googleusercontent.com",
    RECAPTCHA: "x",
    SENTRY_DSN: null
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
