#! /bin/bash

git pull;
npm install;
rm -rf /var/build/build;
npm run build;
rm -rf /var/www/html/*
cp -R /var/build/build/* /var/www/html/
cp /var/build/.htaccess /var/www/html/
