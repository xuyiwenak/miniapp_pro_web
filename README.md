# 原色有感网页端

React、TypeScript 与 Vite 构建的品牌官网及会员网页端。

## 本地开发

```bash
npm ci
npm run dev
```

## 发布

服务器不执行前端构建。源码提交并推送至 `main` 后，在本机运行：

```bash
npm run deploy
```

脚本会在本地完成代码检查与生产构建，先同步带版本的静态资源，最后原子替换入口文件。默认同步至
`bn:/root/workspace/miniapp_pro_web_dist`，服务器只通过 Nginx 读取构建产物。
