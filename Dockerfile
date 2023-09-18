FROM debian:bookworm as builder

ARG NODE_VERSION=19.3.0

RUN apt-get update; apt install -y curl python-is-python3 pkg-config build-essential
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

ENV VOLTA_FEATURE_PNPM 1
RUN volta install pnpm

#######################################################################

RUN mkdir /app
WORKDIR /app

ENV NODE_ENV production

COPY . .

RUN pnpm install --prod --frozen-lockfile --ignore-scripts
RUN pnpm run build
FROM debian:bookworm

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

EXPOSE 8080
ENV PORT 8080

CMD [ "node", "dist/index.js" ]
