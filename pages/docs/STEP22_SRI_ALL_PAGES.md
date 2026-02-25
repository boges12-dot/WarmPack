# STEP22 (2026-01-17) - SRI (integrity) 적용 범위 확대

## 변경 요약

- `css/main.20260116_16.min.css`
- `js/main.20260116_16.min.js`
- `js/notice.20260116_16.min.js`

위 3개 로컬 자산에 대해, **index.html 뿐 아니라 /pages 전체 HTML과 404.html까지** `integrity` + `crossorigin="anonymous"` 를 일괄 적용했습니다.

## 목적

- GitHub Pages/정적호스팅 환경에서 파일이 변조되거나 캐시 오염이 있을 경우 브라우저가 로드를 차단하도록 하여 안전성/일관성을 높입니다.

## 참고

- `assets_hashes.json` 값이 기준이며, CSS/JS를 수정하면 반드시 해시와 HTML의 integrity를 함께 갱신해야 합니다.
- 갱신은 `tools/preflight_check.py`로 검증합니다.
