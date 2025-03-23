FROM electronuserland/builder:wine AS build
COPY . /code
WORKDIR /code
RUN npm i
RUN npm run build:win

FROM scratch AS export-stage
COPY --from=build /code/dist/*.exe ./wartlock.exe