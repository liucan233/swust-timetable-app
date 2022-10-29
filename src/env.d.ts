/// <reference types="vite/client" />
/// <reference types="@dcloudio/types" />

import type { DefineComponent } from "vue";

declare module "*.vue" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}