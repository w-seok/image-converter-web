FROM node:18.20-alpine3.20

# 기본 패키지 설치
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*


# 작업 디렉토리 설정
WORKDIR /app

# app 디렉토리의 모든 내용을 현재 작업 디렉토리로 복사
COPY app/* ./


# 의존성 설치
RUN npm install

# 컨테이너 실행 시 Node.js 앱 시작
CMD ["node", "app.js"]