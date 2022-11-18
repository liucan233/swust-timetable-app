/**显示toast时必要的内容 */
export type IDetail = { title: string; content: string };

/**组件向本模块注册的回调函数，本模块被调用时将回调这个函数 */
type THandleChange = (detail: IDetail) => any;

/**储存info组件注册的回调 */
let handleInfo: THandleChange | null = null;
export const setHandleInfo = (h: THandleChange) => {
  handleInfo = h;
};

/**储存error组件注册的回调 */
let handleError: THandleChange | null = null;
export const setHandleError = (h: THandleChange) => {
  handleError = h;
};

/**储存success组件注册的回调 */
let handleSuccess: THandleChange | null = null;
export const setHandleSuccess = (h: THandleChange) => {
  handleSuccess = h;
};

/**显示error toast */
export const error = (detail: IDetail) => {
  if (handleError) {
    handleError(detail);
  } else {
    Promise.reject(new TypeError("组件未向error toast注册回调函数"));
  }
};

/**显示success toast */
export const success = (detail: IDetail) => {
  if (handleSuccess) {
    handleSuccess(detail);
  } else {
    Promise.reject(new TypeError("组件未向success toast注册回调函数"));
  }
};

/**显示info toast */
export const info = (detail: IDetail) => {
  if (handleInfo) {
    handleInfo(detail);
  } else {
    Promise.reject(new TypeError("组件未向info toast注册回调函数"));
  }
};
