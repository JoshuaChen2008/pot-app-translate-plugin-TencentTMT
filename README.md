# pot-app-translate-plugin-tencent-tmt

腾讯云机器翻译 TMT 插件 - 一个为 [Pot](https://github.com/pot-app/pot-app) 开发的翻译插件。

## 简介

这是一个基于腾讯云机器翻译 TMT API 的 Pot 翻译插件，支持多语言文本翻译。

插件使用腾讯云 API 3.0 签名方式，请求域名为：

```text
tmt.tencentcloudapi.com
```

调用接口为：

```text
TextTranslate
```

## 前置要求

- [Pot App](https://github.com/pot-app/pot-app)- 请先下载并安装Pot App
- 已开通腾讯云机器翻译 TMT 服务
- 已在腾讯云控制台创建 API 密钥

腾讯云 API 密钥页面：

```text
https://console.cloud.tencent.com/cam/capi
```

你需要准备：

```text
SecretId
SecretKey
```

## 功能特点

- 接入腾讯云机器翻译 TMT
- 支持 Pot 的常用语言互译
- 使用腾讯云官方 API 3.0 签名方式
- 支持配置腾讯云地域 Region
- 支持配置 ProjectId，默认使用 `0`

## 安装方法

1. 下载发布页面中的 `.potext` 插件文件。
2. 打开 Pot。
3. 进入偏好设置或服务配置。
4. 选择“翻译 - 添加外部插件”。
5. 选择下载好的 `.potext` 文件进行安装。

## 配置说明

安装插件后，需要在 Pot 的插件配置中填写：

```text
SecretId
SecretKey
Region
ProjectId
```

### SecretId

腾讯云 API 密钥的 SecretId。

### SecretKey

腾讯云 API 密钥的 SecretKey。请妥善保管，不要提交到公开仓库。

### Region

腾讯云地域。默认建议使用：

```text
ap-guangzhou
```

也可以选择插件内提供的其他地域，例如：

```text
ap-beijing
ap-shanghai
ap-chengdu
ap-chongqing
ap-hongkong
ap-singapore
```

### ProjectId

腾讯云项目 ID。没有特殊项目配置时，填写：

```text
0
```

## 使用说明

安装并配置完成后，在 Pot 的翻译服务列表中选择 `Tencent TMT` 即可使用。

## 文件说明

```text
main.js      插件主逻辑，负责签名并调用腾讯云 TMT API
info.json    插件元信息和配置项
tmt.svg      插件图标
```

## 注意事项

- 插件使用腾讯云机器翻译 TMT，不是媒体处理 MPS。
- 腾讯云 TMT 的接口域名是 `tmt.tencentcloudapi.com`。
- 腾讯云密钥不是普通单个 API Key，而是 `SecretId` 和 `SecretKey`。
- `ProjectId` 通常填 `0`。
- 翻译服务需要联网使用。
- 实际可用语言以腾讯云机器翻译 TMT 当前支持范围为准。

## 参考文档

- 腾讯云机器翻译 TMT 文本翻译接口：`https://cloud.tencent.com/document/product/551/15619`
- 腾讯云 API 3.0 签名方法：`https://cloud.tencent.com/document/product/213/30654`
