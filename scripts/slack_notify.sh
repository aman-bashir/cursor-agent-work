#!/usr/bin/env bash
set -euo pipefail

# Load .env if present
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

usage() {
  echo "Usage: $0 [-t \"Title\"] [message]" >&2
  echo "   or: echo 'Message' | $0 [-t \"Title\"]" >&2
  exit 1
}

TITLE=""
while getopts ":t:" opt; do
  case "$opt" in
    t) TITLE="$OPTARG" ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))

# Determine message source: stdin or args
MESSAGE=""
if [ ! -t 0 ]; then
  MESSAGE="$(cat)"
fi
if [ -z "$MESSAGE" ] && [ "$#" -gt 0 ]; then
  MESSAGE="$*"
fi

if [ -z "${SLACK_WEBHOOK_URL:-}" ]; then
  echo "Error: SLACK_WEBHOOK_URL is not set. Add it to .env or environment." >&2
  exit 2
fi

if [ -z "$MESSAGE" ]; then
  usage
fi

json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$(printf '\r')/}"
  echo -n "$s"
}

PAYLOAD="{\"text\":\"$(json_escape "$MESSAGE")\""

if [ -n "$TITLE" ]; then
  PAYLOAD+=",\"attachments\":[{\"color\":\"#36a64f\",\"title\":\"$(json_escape "$TITLE")\"}]"
fi

if [ -n "${SLACK_USERNAME:-}" ]; then
  PAYLOAD+=",\"username\":\"$(json_escape "$SLACK_USERNAME")\""
fi
if [ -n "${SLACK_ICON_EMOJI:-}" ]; then
  PAYLOAD+=",\"icon_emoji\":\"$(json_escape "$SLACK_ICON_EMOJI")\""
fi
if [ -n "${SLACK_CHANNEL:-}" ]; then
  PAYLOAD+=",\"channel\":\"$(json_escape "$SLACK_CHANNEL")\""
fi

PAYLOAD+="}"

curl -sSf -X POST \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data "$PAYLOAD" \
  "$SLACK_WEBHOOK_URL"

echo "\nSlack notification sent."