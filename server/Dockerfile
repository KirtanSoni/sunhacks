# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder

WORKDIR /app

COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . /app

ENV FLASK_ENV=development
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0  
ENV FLASK_RUN_PORT=8000


ENTRYPOINT ["flask"]
CMD ["run"]
