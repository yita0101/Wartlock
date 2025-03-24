FROM node:lts-bookworm AS linux_build
COPY . /code
WORKDIR /code
RUN npm i
RUN npm run build:linux

RUN apt-get update && apt-get install -y zip && \
    zip -r /code/dist/linux-unpacked.zip /code/dist/linux-unpacked

FROM scratch AS export-stage
COPY --from=linux_build /code/dist/*.AppImage /wartlock.AppImage
COPY --from=linux_build /code/dist/linux-unpacked.zip ./linux-portable.zip