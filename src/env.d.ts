/// <reference types="vite/client" />
/// <reference types="@dcloudio/types" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare type TBaseRes<T> = {
  code: number;
  msg: string;
  data: T;
};