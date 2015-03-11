#!/bin/bash
FILES=crosswords/*.json
shopt -s nullglob
for f in $FILES
do
  echo "Importing $f..."
  mongoimport --db onedown --collection crosswords --file $f --jsonArray
done

