# Steps for db changes

1. Create the migration sql file: `npx prisma migrate dev --name your_change --create-only`

2. Review the file in the migrations folder

3. Update the client with: `npx prisma generate`

4. Restart the container to apply the changes to the database

# Helpers

* `npx prisma studio` for database ui

