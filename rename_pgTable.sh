#!/bin/zsh

# Check for required arguments
if [ $# -ne 3 ]; then
    echo "Usage: $0 <folder_path> <replacement_word>"
    exit 1
fi

folder_path=$1
og_word=$2
replacement_word=$3

# Find all files in the folder (not recursive)
for file in "$folder_path"/*; do
    if [ -f "$file" ]; then  # Make sure it's a regular file
        # Use sed to replace 'pgTable' within the file's contents
        sed -i "s/$og_word/$replacement_word/g" "$file"
    fi
done
