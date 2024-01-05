---
description: 根据配置生成随机密码
outline: deep
---

# getRandomPassword

## 方法说明

根据配置生成随机密码

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| min | `number \| undefined` | 最小长度 | 8 |
| max | `number \| undefined` | 最大长度 | 16 |
| special | `string \| undefined` | 允许的特殊字符 | !@#$%^&*()-_=+,.:;?/~ |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `string` | 生成的随机密码 |
