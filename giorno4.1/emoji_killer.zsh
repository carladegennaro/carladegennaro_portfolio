#!/bin/zsh

input="$1"
output="$2"

if [[ -z "$input" || -z "$output" ]]; then
  echo "Uso: $0 input.txt output.txt"
  exit 1
fi

perl -CSDA -pe 's/[\p{Extended_Pictographic}\p{Emoji_Modifier}\x{200D}\x{FE0F}]//g' "$input" > "$output"
