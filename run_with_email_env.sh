#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   cp .env.example .env
#   (edit .env with your real credentials)
#   chmod +x run_with_email_env.sh
#   ./run_with_email_env.sh

set -a
if [ -f .env ]; then
  # shellcheck disable=SC1091
  source .env
fi
set +a

export DJANGO_SETTINGS_MODULE=revivalsite.settings

python manage.py runserver 0.0.0.0:8000

