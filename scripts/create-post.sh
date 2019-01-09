#!bin/bash

# credit: https://gist.github.com/oneohthree/f528c7ae1e701ad990e6
function slugify () {
  echo "$1" | iconv -t ascii//TRANSLIT | sed -r s/[^a-zA-Z0-9]+/-/g | sed -r s/^-+\|-+$//g | tr '[:upper:]' '[:lower:]'
}

title="${1:-'title'}"
slug="$(slugify "$title")"
folder="./content/posts/$(date +%F)--$slug"

#extract name of image
function getImage(){
    find "$folder" -type f \( -name "*.jpg" -or -name "*.png" \) -printf "%f\n"
}

if [ -d "$folder" ]; then
  printf "\\nWARNING: Post already exists: \"%s\"\\n\\n" "$title"
  printf "To delete current post: \\n  rm -rf %s\\n\\n" "$folder"
  exit -1
fi

if [ "" != "$2" ]; then
  category="$2"
else
  read -rp "Enter post category: " category
fi

if [ "" != "$3" ]; then
  author="$3"
else
  read -rp "Enter post author: " author
fi

if [ "" != "$4" ]; then
    cover="$4"
else
    read -rp "Enter path cover: " cover
fi

mkdir "$folder"
cp "$cover" "$folder"
imageName="$(getImage)"


# Template index.md
cat << EOF > "$folder/index.md"
---
title: "$title"
category: "$category"
cover: $imageName
author: $author
---
EOF

printf "\\nDone: Post created at %s/index.md\\n\\n" "$folder"
