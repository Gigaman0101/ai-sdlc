#!/usr/bin/env bash
# PreToolUse hook: block destructive Bash commands (rm -rf, git push --force).
# Exit code 2 blocks the tool call and feeds stderr back to Claude.

cmd=$(jq -r '.tool_input.command // ""')

# rm with both recursive and force flags, e.g. rm -rf, rm -fr, rm -r -f, rm --recursive --force
if echo "$cmd" | grep -Eq '(^|[;&|[:space:]])(sudo[[:space:]]+)?rm[[:space:]]' &&
   echo "$cmd" | grep -Eq '(^|[[:space:]])-[a-zA-Z]*[rR]|--recursive' &&
   echo "$cmd" | grep -Eq '(^|[[:space:]])-[a-zA-Z]*f|--force'; then
  echo "Blocked by hook: 'rm -rf' is not allowed in this project." >&2
  exit 2
fi

# git push with --force / -f / --force-with-lease / +refspec
if echo "$cmd" | grep -Eq '(^|[;&|[:space:]])git[[:space:]]+([^;&|]*[[:space:]])?push([[:space:]]|$)' &&
   echo "$cmd" | grep -Eq '(^|[[:space:]])(--force(-with-lease|-if-includes)?(=[^[:space:]]*)?|-[a-zA-Z]*f[a-zA-Z]*|\+[^[:space:]]+)([[:space:]]|$)'; then
  echo "Blocked by hook: 'git push --force' is not allowed in this project." >&2
  exit 2
fi

exit 0
