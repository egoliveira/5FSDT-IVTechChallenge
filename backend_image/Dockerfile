FROM node:24-slim

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY backend/run_app.sh .
COPY backend/package.json .
COPY backend/package-lock.json .
COPY backend/tsconfig.json .
COPY backend/src ./src
COPY backend/migrations ./migrations

RUN npm install && npm install typescript -g

RUN tsc

EXPOSE $BACKEND_DOCKER_PORT

RUN chmod +x ./run_app.sh

CMD ["./run_app.sh"]