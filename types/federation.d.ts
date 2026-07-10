import '@originjs/vite-plugin-federation';

declare module '@originjs/vite-plugin-federation' {
  interface SharedConfig {
    singleton?: boolean;
    eager?: boolean;
    strictVersion?: boolean;
    shareKey?: string;
    packageName?: string;
  }
}
