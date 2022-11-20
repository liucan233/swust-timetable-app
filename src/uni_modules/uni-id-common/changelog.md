## 1.0.13（2022-07-21）

- 修复 创建 token 时未传角色权限信息生成的 token 不正确的 bug

## 1.0.12（2022-07-15）

- 提升与旧版本 uni-id 的兼容性（补充读取配置文件时回退平台 app-plus、h5），但是仍推荐使用新平台名进行配置（app、web）

## 1.0.11（2022-07-14）

- 修复 部分情况下报`read property 'reduce' of undefined`的错误

## 1.0.10（2022-07-11）

- 将 token 存储在用户表的 token 字段内，与旧版本 uni-id 保持一致

## 1.0.9（2022-07-01）

- checkToken 兼容 token 内未缓存角色权限的情况，此时将查库获取角色权限

## 1.0.8（2022-07-01）

- 修复 clientDB 默认依赖时部分情况下获取不到 uni-id 配置的 Bug

## 1.0.7（2022-06-30）

- 修复 config 文件不合法时未抛出具体错误的 Bug

## 1.0.6（2022-06-28）

- 移除插件内的数据表 schema

## 1.0.5（2022-06-27）

- 修复使用多应用配置时报`Cannot read property 'appId' of undefined`的 Bug

## 1.0.4（2022-06-27）

- 修复使用自定义 token 内容功能报错的 Bug [详情](https://ask.dcloud.net.cn/question/147945)

## 1.0.2（2022-06-23）

- 对齐旧版本 uni-id 默认配置

## 1.0.1（2022-06-22）

- 补充对 uni-config-center 的依赖

## 1.0.0（2022-06-21）

- 提供 uni-id token 创建、校验、刷新接口，简化旧版 uni-id 公共模块
