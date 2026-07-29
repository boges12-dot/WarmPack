# 광어 서버 홈페이지 정리 보고서

작업일: 2026-07-29

## Git 저장소 문제 해결

- 원본 ZIP의 손상된 `.git` 폴더 전체를 결과물에서 제거
- 최종 프로젝트 폴더에는 `.git`이 없으므로 GitKraken 또는 GitHub Desktop에서 새 저장소로 초기화 가능
- 별도 검증 저장소에서 기본 브랜치 `main`으로 초기화, 전체 400개 파일 스테이징, Initial Commit을 실제 완료
- 검증 결과 `HEAD=refs/heads/main`, 커밋 1개, 변경 상태 0건
- 검증용 Git 데이터는 프로젝트 외부에서 생성했으며 최종 ZIP에는 포함하지 않음

## 수정한 파일

- 57개 일반 HTML: CSS 연결을 `base.css`, `content.css`, `hunting-boss.css`, `skill.css`, `responsive.css` 순서로 통일
- 인형 상세 HTML 9개: 중복된 내부 `<style>` 제거
- `js/main.js`: 모바일 메뉴 상태 전달, 화면 크기 변경 시 초기화, 카드 내부 링크·버튼 클릭 충돌 방지, 기능별 초기화 함수 분리
- `js/skill_accordion.js`: 안전한 초기화와 함수 단위 구조로 정리하면서 기존 단일 열림 동작 유지
- `README.md`: 현재 구조, 실행·배포 방법, 사냥터 목록과 검사 결과로 갱신

## 새로 만든 CSS

- `css/base.css`: 공통 기반, 헤더, 내비게이션, 푸터
- `css/content.css`: 아이템·인형·세트·일반 텍스트 콘텐츠
- `css/hunting-boss.css`: 사냥터 카드, 이미지, 보스 배지, 통합 보스정보
- `css/skill.css`: 기존 스킬 전용 CSS와 스킬 페이지 스타일 통합
- `css/responsive.css`: 태블릿·모바일 미디어 쿼리

## 삭제한 파일

- `css/style.css`: 역할별 CSS로 분리
- `css/skill_image_90.css`, `css/skill_table_auto_fit.css`: `skill.css`로 통합
- `js/components.js`: 어느 HTML에서도 사용하지 않는 이전 구조 잔여 파일
- `assets/images/gwangeo-hero-before-text-balance.png`: 참조되지 않는 이전 배너
- `assets/images/gwangeo-hero-modified.png`: 현재 배너와 내용이 같은 미사용 복사본

## CSS 정리 결과

- 9개 인형 페이지의 동일 스타일을 `content.css`의 `.doll-card` 영역으로 통합
- 사냥터 이미지와 아이템 이미지 규칙을 서로 다른 파일과 선택자 영역으로 분리
- 보스 배지는 기존 높이를 유지하면서 고정 `height` 대신 `min-height` 사용
- 모든 반응형 규칙을 마지막 `responsive.css`로 이동

## 링크 및 문서 검사

- HTML 59개 검사
- HTML/CSS 로컬 참조 3,599개 검사
- 존재하지 않는 HTML·이미지·CSS·JavaScript: 0
- 잘못된 내부 앵커: 0
- 중복 ID: 0
- 누락된 이미지 `alt`: 0
- 누락된 `lang`, `charset`, `viewport`, `title`: 0
- JavaScript 문법 오류: 0

## 반응형 검사

- PC: 기본 그리드와 1200px 분기 규칙의 문법·적용 순서 확인
- 태블릿: 1200px·1100px·900px 분기 규칙을 마지막 스타일시트에서 확인
- 모바일: 760px·520px 분기, 단일 열 카드, 모바일 메뉴 상태 처리 확인
- 자동 브라우저 화면 비교는 실행 환경의 로컬 주소 접근 제한으로 수행하지 못했으며, 정적 구조·경로·스타일 우선순위 검사로 대체

## 유지한 구조와 보류 사항

- `file://` 더블클릭 실행을 위해 헤더·푸터를 외부 `fetch()` 컴포넌트로 변경하지 않음
- 보스정보는 JavaScript 데이터 렌더링으로 바꾸지 않고 정적 HTML을 유지
- 인형 상세 페이지는 모바일 길이와 기존 링크 호환성을 위해 한 페이지로 강제 통합하지 않음
- 참조 중인 중복 이미지 폴더는 링크 안정성을 위해 삭제하지 않음
