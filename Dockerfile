FROM node:18-alpine AS base

# 仅在需要时安装依赖项
FROM base AS deps
# 检查https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine以了解为什么可能需要libc6-compat。
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 基于首选包管理器安装依赖项
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

ENV NPM_REGISTRY=https://registry.npm.taobao.org

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 仅在需要时重新生成源代码
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

#Next.js收集关于一般用途的完全匿名的遥测数据。
#点击此处了解更多信息：https://nextjs.org/telemetry
#如果您想在构建过程中禁用遥测，请取消注释以下行。
#ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 生产映像，复制所有文件并运行下一个
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
#如果要在运行时禁用遥测，请取消注释以下行。
#ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 设置预呈现缓存的正确权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 自动利用输出跟踪来减小图像大小
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3403

ENV PORT 3403

# server.js由下一次构建从独立输出创建
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
