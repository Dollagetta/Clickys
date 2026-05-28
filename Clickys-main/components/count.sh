#!/bin/bash

# Count frequency of the word 'name' in flipkartProducts.js

FILE="flipkartProducts.js"

if [ ! -f "$FILE" ]; then
  echo "File '$FILE' not found!"
  exit 1
fi

# Count the word 'name' (case-insensitive, whole word match)
count=$(grep -oiw 'name' "$FILE" | wc -l)

echo "The word 'name' appears $count times in the file '$FILE'."

