#!/bin/bash

# Script to prepend 'export const dynamic = "force-dynamic";' to all page.jsx files
echo "🔍 Scanning for page.jsx files..."

# Loop through all page.jsx files in the app directory
find ./app -type f -name 'page.jsx' | while read -r file; do
  # Check if 'export const dynamic' is already present
  if ! grep -q "export const dynamic" "$file"; then
    echo "⚙️ Prepending to: $file"
    # Create a temp file with the dynamic line prepended
    echo "export const dynamic = 'force-dynamic';" | cat - "$file" > temp && mv temp "$file"
  else
    echo "✅ Already set in: $file"
  fi
done

echo "✅ Done prepending all page.jsx files with dynamic = 'force-dynamic'."

