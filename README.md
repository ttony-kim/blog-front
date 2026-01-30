# 🎨 Blog Project (Frontend)

<div align="right">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white">
</div>
<br />

**Next.js**와 **JavaScript** 기반으로 구현한 블로그 서비스의 프론트엔드 프로젝트입니다.

본 프로젝트는 **Java/Spring Boot로 구현된 백엔드 API와 연동**되며, **MUI**를 활용한 UI와 **giscus**를 통한 GitHub 기반 댓글 시스템을 제공합니다.  
표준화된 개발 및 운영 환경을 위해 **Docker**와 **GitHub Actions**를 이용한 CI/CD 배포 자동화 파이프라인을 구축하였습니다.

<br/>

> **Backend Repository**: [ttony-kim/blog-backend](https://github.com/ttony-kim/blog-backend)  
> **Comment Repository**: [ttony-kim/blog-comment](https://github.com/ttony-kim/blog-comments)

<br/>

## 🛠 사용 기술

- **Framework:** Next.js (Pages Router)
- **Language:** JavaScript
- **UI Library:** MUI (Material UI)
- **Editor:** Tiptap
- **Comment System:** giscus
- **HTTP Client:** Axios (API 통신 및 인터셉터 처리)

<br/>

## 🖼 스크린샷

### 1. 메인 페이지

<p align="center">
  <img src="https://github.com/user-attachments/assets/751fb103-7bae-4b9f-8543-0b9dceeee12b" width="70%" />
</p>
작성된 게시글 리스트를 확인할 수 있으며, 검색 기능과 카테고리별 필터링을 통해 게시글을 선별하여 조회할 수 있습니다.

### 2. 게시글 상세 페이지

<p align="center">
  <img src="https://github.com/user-attachments/assets/a966cad0-6e26-4b62-9049-12720158ed60" width="70%" />
  <img src="https://github.com/user-attachments/assets/75e4fa33-db81-4663-ae1d-1cc4934f1f46" width="70%" />
</p>
게시글을 상세 조회할 수 있으며, giscus를 통한 댓글 작성이 가능합니다.

### 3. 게시글 글 쓰기

<p align="center">
  <img src="https://github.com/user-attachments/assets/0faf5ac2-2676-497a-9cd7-46b5ad498012" width="70%" />
<p>
로그인 후 Tiptap 에디터를 활용한 게시글 작성과 첨부파일 업로드 기능을 제공합니다.

### 4. 카테고리 관리 페이지

<p align="center">
  <img src="https://github.com/user-attachments/assets/80c4271b-f766-4210-872d-f63130bb8cfa" width="70%" />
</p>
게시글 분류를 위한 카테고리 생성, 수정 및 삭제 등 관리자 전용 기능을 제공합니다.

<br/>
<br/>

## 🏗 CI/CD 파이프라인

**GitHub Actions**을 활용하여 CI/CD 파이프라인을 구축했으며, 운영 안정성을 위해 `workflow_dispatch`를 통해 수동으로 제어됩니다.

- Flow: GitHub Actions → SSH/SCP → 온프레미스 Server

<br/>

## 🔐 보안

JWT 기반의 인증 및 인가 체계를 통해 보안을 강화했습니다.

- **전역 인증 관리**: `Context API`를 활용하여 전역 로그인 상태를 유지합니다.
- **토큰 유효성 검증**: 페이지 진입 시 `JWT의 유효성을 검사`하고 만료 시 세션을 자동 종료합니다.
- **Route Guard**: 비인가 사용자의 관리자 페이지 접근을 차단하고 로그인 페이지로 리다이렉트합니다.

<br/>

## ⚙️ 환경 변수 설정

정상적인 구동을 위해 루트 디렉토리에 `.env` 파일을 생성하고 아래 항목들을 설정해야 합니다.

```env
# Backend API 주소
API_URL=http://localhost:8080

# giscus 설정
NEXT_PUBLIC_GISCUS_REPO=your-id/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_...
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_...
```

<br/>

## ✨ 주요 기능

- **MUI 기반 UI**: Material UI를 활용한 블로그 레이아웃 구현
- **블로그 서비스**: Tiptap 에디터를 활용한 게시글 작성, 첨부파일 업로드 및 카테고리 관리 기능
- **giscus 댓글**: GitHub Discussions 연동을 통한 댓글 기능 관리
- **API 통신 관리**: Axios를 활용하여 백엔드 API 호출 로직을 분리

<br/>

## 📂 주요 파일 구조

- `.github/workflows/`: 배포 YAML 워크플로우 파일
- `pages/`: 라우팅 및 페이지 컴포넌트
- `components/`: 재사용 가능한 컴포넌트
- `api/`: Axios 기반 서버 통신 모듈
- `contexts/`: 사용자 인증 상태 및 페이지 접근 권한 관리
