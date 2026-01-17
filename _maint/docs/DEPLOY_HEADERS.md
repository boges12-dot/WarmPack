# Deploy headers (optional)

이 파일은 **선택 사항**입니다. 서버가 지원하는 경우에만 적용하세요.

## Apache
- `site/.htaccess` 포함
- 장점: 이미지/아이콘 장기 캐시, CSS/JS 7일 캐시, 기본 gzip

## Netlify
- `site/_headers` 사용

### STEP18: 보안 헤더/CSP
`site/_headers` 와 `site/.htaccess`에 **기본 보안 헤더 + CSP**가 추가되어 있습니다.

자세한 내용과(외부 스크립트/폰트 추가 시) CSP 완화 방법은 `_maint/docs/SECURITY_HEADERS.md`를 참고하세요.

## Nginx (예시)
```nginx
location ~* \.(png|jpe?g|gif|webp|svg|ico)$ {
  add_header Cache-Control "public, max-age=2592000, immutable";
}
location ~* \.(css|js)$ {
  add_header Cache-Control "public, max-age=604800";
}
```
