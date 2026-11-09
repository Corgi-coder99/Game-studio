FROM node:24-bookworm-slim
WORKDIR /app
COPY --chown=node:node . .
RUN mkdir -p /data && chown node:node /data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 GAME_DATABASE=/data/world.sqlite
EXPOSE 3000
CMD ["node", "online/server.mjs"]
