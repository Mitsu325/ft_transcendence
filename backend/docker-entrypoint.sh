#!/bin/sh
>&2 echo "Starting server..."
# npm run typeorm migration:generate -n InitialMigration
npm run migration:run
npm run start:prod
