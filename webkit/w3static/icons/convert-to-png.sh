for f in *.svg; do
  inkscape "$f" --export-type=png --export-width=512
done
