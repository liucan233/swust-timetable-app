/**网络请求参数 */
type TNetworkConfig = Omit<
  UniNamespace.RequestOptions,
  "success" | "fail" | "complete"
>;

/**响应数据格式 */
interface TNetworkRes<T>
  extends Omit<UniNamespace.RequestSuccessCallbackResult, "data"> {
  /**
   * 开发者服务器返回的数据
   */
  data: T;
}

/**网络请求错误 */
export class RequestError extends Error {}

/**请求错误时的回调函数 */
let onErrorCb: null | ((msg: RequestError) => unknown) = null;

/**将uni app的回调式网络请求方式promise化 */
export const network = <IRes>(config: TNetworkConfig) => {
  type TOnFulfilled = TNetworkRes<IRes>;

  let abort: unknown = null;
  const promise = new Promise<TOnFulfilled>((resolve, reject) => {
    const task = uni.request({
      ...config,
      fail: ({ errMsg }) => {
        const err = new RequestError(errMsg);
        reject(err);
        onErrorCb?.(err);
      },
      success: result => {
        resolve(result as TOnFulfilled);
      },
    });

    abort = task.abort;
  });
  return {
    promise,
    abort: abort as () => void,
  };
};

/**监听网络请求的错误事件 */
export const onRequestError = (cb: typeof onErrorCb) => {
  onErrorCb = cb;
};
