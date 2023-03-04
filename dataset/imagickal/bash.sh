#!/bin/bash
identify -format "name=
size=%[size]
format=%m
colorspace=%[colorspace]
height=%[height]
width=%[width]
orientation=%[orientation]
%[exif:*]" small.jpg
identify -format "name=
size=%[size]
format=%m
colorspace=%[colorspace]
height=%[height]
width=%[width]
orientation=%[orientation]
%[exif:*]" small.jpg
identify -format "{\"width\":%w,\"height\":%h}" small.jpg
identify -format "{\"format\":\"%m\",\"width\":%w,\"height\":%h}" small.jpg
identify -format "{\"format\":\"%m\",\"width\":%w,\"height\":%h}" small.jpg
identify -format "{\"format\":\"%m\",\"width\":%w,\"height\":%h}" small.jpg
identify -format "{\"format\":\"%m\",\"width\":%w,\"height\":%h}" -
src.jpg
convert "src.jpg" -filter Catrom -resize 100x -crop 10x10+10+10 -quality 90 -strip "dst.jpg"
convert "src.jpg" -filter Catrom -resize 100x -crop 10x10+10+10 -quality 90 -strip "dst.jpg"
convert "small.jpg" -strip "test.jpg"
convert "small.jpg" -strip png:"test.jpg"
