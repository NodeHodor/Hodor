#!/bin/bash
convert out.jpg -auto-orient -strip -write mpr:out.jpg +delete mpr:out.jpg -quality 80 -crop "3936x2623+624+0" -resize "150x150" -write out-thumb.jpg +delete mpr:out.jpg -quality 80 -crop "2624x2623+1280+0" -resize "200" out-square.jpg
