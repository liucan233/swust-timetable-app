interface IBaseResponse<T> {
  code: number;
  msg: string;
  data: T;
}
