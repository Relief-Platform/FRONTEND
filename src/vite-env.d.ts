/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  /** 'true' → dùng mock auth; 'false' → real backend */
  readonly VITE_USE_MOCK_AUTH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
