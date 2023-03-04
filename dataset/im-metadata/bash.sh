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
