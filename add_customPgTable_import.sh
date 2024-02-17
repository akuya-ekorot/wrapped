#!/bin/zsh

# Check for required arguments
if [ $# -ne 2 ]; then
	echo "Usage: $0 <folder_path> <line_to_add>"
	exit 1
fi

folder_path=$1
line_to_add=$2

# Find all files in the folder
for file in "$folder_path"/*; do
	if [ -f "$file" ]; then
		# Use sed to insert the line at the beginning
		sed -i '1i'"$line_to_add" "$file"
	fi
done
