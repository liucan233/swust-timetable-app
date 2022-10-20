const _qs = {
  /**
   *  传入{key: value}返回querystring格式
   * @param obj
   * @returns
   */
  parse: (obj: Record<string, string>) => {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  },
};

export default _qs;
