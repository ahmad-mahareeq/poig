#!/bin/bash
HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "0000000")
sed -i.bak "s/?v=__HASH__/?v=$HASH/g" index.html
rm -f index.html.bak
