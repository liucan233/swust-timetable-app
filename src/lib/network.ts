/**网络请求参数 */
type TUniRequestOptions = UniNamespace.RequestOptions;

/**无"success、fail、complete和data的网络请求参数 */
type TUniRequestOptionsOmit = Omit<
  TUniRequestOptions,
  "success" | "fail" | "complete" | "data"
>;

/**无"success、fail、complete、method、url和data的网络请求参数 */
type TNetworkRequestOptions = Omit<
  TUniRequestOptions,
  "success" | "fail" | "complete" | "data" | "url" | "method"
>;

/**无success、fail、complete和data的部分网络请求参数 */
type TPartialUniRequestOptionsOmit = Partial<TUniRequestOptionsOmit>;

/**uni请求的body */
type TUniBody = TUniRequestOptions["data"];

/**调用请求方法的返回结构 */
interface IRequestTask<T> extends PromiseLike<T | null> {
  /**uni原始的方法 */
  task: UniNamespace.RequestTask;
}

/**
 * 网络请求类，类似axios
 * 构造函数url属性为请求的base url
 */
export class Network {
  private defaultConfig: TPartialUniRequestOptionsOmit = {};
  onReq: undefined | ((config: TUniRequestOptions) => TUniRequestOptions);
  onRes:
    | undefined
    | ((data: UniNamespace.RequestSuccessCallbackResult) => unknown);
  onErr: undefined | ((v: unknown) => unknown);
  constructor(config?: TPartialUniRequestOptionsOmit) {
    if (config) {
      this.defaultConfig = config;
    }
  }
  /**发生错误时执行onErr */
  private tryResolveErr(
    reject: (v: unknown) => unknown,
    resolve: (v: null) => any,
    error: unknown
  ) {
    if (this.onErr) {
      try {
        this.onErr(error);
        resolve(null);
      } catch (e) {
        reject(e);
      }
    } else {
      reject(error);
    }
  }
  /**调用uni发送请求 */
  private request<T>(config: TUniRequestOptions): IRequestTask<T> {
    let task: IRequestTask<T>["task"] = {} as IRequestTask<T>["task"];
    const request = new Promise<T | null>((resolve, reject) => {
      let newConfig = config;
      if (this.onReq) {
        try {
          newConfig = this.onReq(config);
        } catch (error) {
          this.tryResolveErr(
            reject,
            resolve,
            new Error("执行请求拦截器时拦截器抛出错误")
          );
        }
      }
      const fail = (e: unknown) => {
        this.tryResolveErr(reject, resolve, e);
      };
      const success = (v: UniApp.RequestSuccessCallbackResult) => {
        if (this.onRes) {
          try {
            const result = this.onRes(v) as T;
            resolve(result);
          } catch (error) {
            this.tryResolveErr(reject, resolve, error);
          }
        } else {
          resolve(v as T);
        }
      };
      task = uni.request({
        ...newConfig,
        fail,
        success,
      });
    }) as unknown as IRequestTask<T>;

    request.task = task;
    return request;
  }

  private getAbsoluteUrl(url: string) {
    const httpFlag = /^http:\/\//.test(url);
    return (httpFlag ? "" : this.defaultConfig.url || "") + url;
  }

  private getUniConfig({
    config,
    data,
    url,
    method,
  }: {
    config?: Omit<TUniRequestOptionsOmit, "url">;
    url: string;
    method?: TUniRequestOptions["method"];
    data?: TUniBody;
  }): TUniRequestOptions {
    return {
      ...this.defaultConfig,
      ...config,
      url: this.getAbsoluteUrl(url),
      method,
      data,
    };
  }

  get<T = unknown>(
    url: string,
    config?: TNetworkRequestOptions
  ): IRequestTask<T> {
    return this.request<T>(this.getUniConfig({ config, url }));
  }

  post<T = unknown>(
    url: string,
    body: TUniBody,
    config?: TNetworkRequestOptions
  ) {
    return this.request<T>(
      this.getUniConfig({ config, url, method: "POST", data: body })
    );
  }

  put<T = unknown>(
    url: string,
    body: TUniBody,
    config?: TNetworkRequestOptions
  ): IRequestTask<T> {
    return this.request<T>(
      this.getUniConfig({ config, url, method: "PUT", data: body })
    );
  }

  delete<T = unknown>(
    url: string,
    body: TUniBody,
    config?: TNetworkRequestOptions
  ): IRequestTask<T> {
    return this.request<T>(
      this.getUniConfig({ config, url, method: "DELETE", data: body })
    );
  }

  options<T = unknown>(
    url: string,
    body: TUniBody,
    config?: TNetworkRequestOptions
  ): IRequestTask<T> {
    return this.request<T>(
      this.getUniConfig({ config, url, method: "OPTIONS", data: body })
    );
  }
}
