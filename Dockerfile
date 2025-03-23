FROM alpine:3.21.3 AS build
RUN apk add musl-dev npm python3 py3-setuptools make g++ gcompat
COPY . /code
WORKDIR /code
RUN npm i
RUN npm run build:linux

FROM scratch AS export-stage
COPY --from=build /code/dist/wartlock-1.0.0.AppImage ./wartlock.AppImage
