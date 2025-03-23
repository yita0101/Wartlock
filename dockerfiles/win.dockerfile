FROM electronuserland/builder:wine AS build
COPY . /code
WORKDIR /code
RUN npm i
RUN npm run build:win

RUN apt-get update && apt-get install -y zip && \
    zip -r /code/dist/win-unpacked.zip /code/dist/win-unpacked

FROM scratch AS export-stage
COPY --from=build /code/dist/*.exe ./wartlock.exe
COPY --from=build /code/dist/win-unpacked.zip ./win-portable.zip