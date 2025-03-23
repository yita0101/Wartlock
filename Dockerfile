FROM node:lts-bookworm AS build
COPY . /code
WORKDIR /code
RUN npm i
RUN npm run build:linux

FROM scratch AS export-stage
COPY --from=build /code/dist/wartlock-1.0.0.AppImage ./wartlock.AppImage
