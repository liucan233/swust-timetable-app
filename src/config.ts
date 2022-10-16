const isDev = process.env.NODE_ENV === 'development';

/**后端服务前缀 */
export const BACKEND_PERFIX = isDev ? 'https://mock.apifox.cn/m1/1656693-0-default' : ''