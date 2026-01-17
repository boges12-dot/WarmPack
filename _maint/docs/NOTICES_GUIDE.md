# 공지 데이터 운영 가이드 (notices.json)

이 사이트의 공지는 **정적 JSON(`data/notices.json`)**을 기반으로 동작합니다.

## 파일 위치
- 공지 목록/상세 데이터: `site/data/notices.json`

## 공지 한 건의 형태 (필수 필드)
```json
{
  "id": "n-2026-01-17-01",
  "category": "업데이트",
  "title": "업데이트 안내",
  "summary": "패치/변경사항 안내.",
  "date": "2026-01-17",
  "content": "- 업데이트 내용\n- 두번째 줄"
}
```

### 필드 설명
- `id`: **고유값(중복 금지)**. 추천 포맷: `n-YYYY-MM-DD-##`
- `category`: 표기용(예: 업데이트, 서버점검, 이벤트, 서버규정)
- `title`: 공지 제목
- `summary`: 목록에서 보일 짧은 설명
- `date`: `YYYY-MM-DD` (정렬 기준)
- `content`: 본문. 여러 줄은 `\n`으로 줄바꿈

## 공지 추가 절차(안전)
1) `data/notices.json` 배열 맨 위에 새 항목 추가 (또는 아무 곳)
2) 루트에서 아래 실행
```bash
cd site
node _maint/tools/validate-data.mjs
```
- id 중복/날짜 형식 등을 검사하고
- 필요하면 최신 날짜 우선으로 자동 정렬합니다.

## 주의사항
- `id`를 바꾸면 기존에 공유된 `notice_view.html?id=...` 링크가 깨질 수 있어요.
- 날짜(`date`)는 반드시 `YYYY-MM-DD`로 유지해주세요.
