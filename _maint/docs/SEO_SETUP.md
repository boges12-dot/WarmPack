# SEO 설정 안내

이 프로젝트는 정적 사이트라서 `sitemap.xml`의 `<loc>` + 각 페이지의 `canonical/OG`에 **도메인(사이트 주소)** 이 필요합니다.

## 해야 할 일
배포 도메인이 정해지면 아래 중 1개 방식으로 처리하면 됩니다.

### 방법 A) 스크립트로 한 번에 치환 (추천)
```bash
# site 폴더에서 실행
python _maint/tools/set_domain.py https://example.com
```

### 방법 B) 수동 치환
1. 아래 파일들에서 `https://boges12-dot.github.io/WarmPack` 를 실제 도메인으로 교체
   - `sitemap.xml`
   - `robots.txt`
   - 각 페이지의 `<head>` (canonical/OG/Twitter)

## 배포 후 확인
- `https://<도메인>/robots.txt`
- `https://<도메인>/sitemap.xml`

(선택) Google Search Console에 사이트맵 등록
