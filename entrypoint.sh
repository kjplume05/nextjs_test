#!/bin/sh

echo "Waiting for database..."
until npx prisma migrate deploy 2>/dev/null; do
    echo "DB not ready yet!!!"
    sleep 2
done

echo "Finally the DB was ready!!!"

npm install

if [ "$NODE_ENV" = "development" ]; then
    exec npm run dev
else 
    exec npm start
fi