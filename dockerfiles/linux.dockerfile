FROM node:lts-bookworm AS linux_build
COPY . /code
WORKDIR /code
RUN npm i
RUN npm run build:linux

FROM scratch AS export-stage

COPY --from=linux_build /code/dist/*.AppImage /output/wartlock.AppImage