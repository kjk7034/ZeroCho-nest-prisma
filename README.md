# Docker 통합 Nest-Prisma 프로젝트

기존 nest-prisma에 Docker 추가하는 작업을 진행.

## 작업 과정

- `bcrypt`을 `bcryptjs`으로 변경.
- Docker, docker-compose 생성

## Docker 설정 및 프로그램 실행

```bash
# docker-compose 빌드
docker-compose build --no-cache

# docker-compose 실행
docker-compose up -d
```

- `http://localhost:9090/api` 접속 확인
- 회원가입 진행

## 기타

[이전 README.md](./docs/README.md)
