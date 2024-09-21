# Image Converter Web

Image Converter Web은 로컬 환경에서 이미지 파일의 확장자를 변경할 수 있는 웹 애플리케이션입니다. 
이 docker image는 개인 정보나 중요한 이미지를 안전하게 로컬에서 최적화하고자 하는 사용자를 위해 설계되었습니다.

## 주요 기능

- 다양한 이미지 포맷 간 변환 지원 (JPG, PNG, GIF, WebP, TIFF, AVIF)
- 드래그 앤 드롭 또는 파일 선택을 통한 간편한 이미지 업로드
- 변환된 이미지의 즉시 다운로드

## 사용 목적

1. 프라이버시 걱정 없는 이미지 변환
   - 온라인 이미지 변환 서비스를 신뢰할 수 없는 경우 로컬에서 안전하게 처리
   - 의료 기록, 법적 문서 등 민감한 정보가 포함된 이미지의 안전한 변환

2. 개인 콘텐츠 최적화
   - 개인 블로그나 Notion에 사용할 PNG 이미지를 효율적인 포맷(예: WebP, JPEG)으로 변환

3. 로컬 환경에서의 빠른 이미지 처리
   - 인터넷 연결 없이 즉시 이미지 변환 가능

## 설치 및 실행 방법

### Docker를 이용한 실행

#### Mac 및 Linux

1. [Docker desktop설치](https://docs.docker.com/desktop/install/mac-install/) (이미 설치되어 있다면 이 단계 건너뛰기)
2. 터미널에서 다음 명령어 실행:<br>
`docker run -d -p 4000:4000 ghcr.io/w-seok/image-converter:latest`
3. 다음 명령어로 컨테이너 목록에 image-converter 존재하는지 체크:
`docker ps`
<img width="999" alt="image" src="https://github.com/user-attachments/assets/67788201-619b-48ba-9dcb-fdf2fbd82661">

4. 브라우저에서 `http://localhost:4000` 접속

#### Windows
1. [Docker Desktop 설치](https://docs.docker.com/desktop/install/windows-install/) (이미 설치되어 있다면 이 단계 건너뛰기)
2. PowerShell 또는 명령 프롬프트에서 다음 명령어 실행:
`docker run -d -p 4000:4000 ghcr.io/w-seok/image-converter:latest`
3. 다음 명령어로 컨테이너 목록에 image-converter 존재하는지 체크:
`docker ps`
<img width="999" alt="image" src="https://github.com/user-attachments/assets/67788201-619b-48ba-9dcb-fdf2fbd82661">

4. 브라우저에서 `http://localhost:4000` 접속

### Docker Compose를 이용한 실행

1. `docker-compose.yaml` 파일 생성:

```yaml
services:
  node-container:
    container_name: node-docker
    image: ghcr.io/w-seok/image-converter:latest
    environment:
      - PORT=4000
    ports:
      - "4000:4000"
```
2. 터미널 또는 명령 프롬프트에서 다음 명령어 실행: <br>
`docker-compose up -d`

