# PROMPT 09 — Production readiness

Production release'ni tayyorlashdan oldin audit va staging acceptance talab qil.
- Environment schema validation; secretlar source control'da yo‘q.
- Docker non-root/multi-stage, health/readiness, logs.
- HTTPS, CORS allowlist, security headers, DB private access.
- Migration review, backup va restore rehearsal.
- Sentry/monitoring PII scrubbing, alerts, uptime checks.
- Click/Payme production credentials faqat provider bilan sandbox acceptance va account approval'dan keyin.
- DNS, TLS, domain redirects, sitemap/canonical.
- CI lint/typecheck/test/build, dependency audit.
- Rollback va incident runbook.
Hech qanday production secret, destructive migration yoki real charge'ni aniq ruxsatsiz bajarma. Yakunda go/no-go checklist va unresolved risks.
