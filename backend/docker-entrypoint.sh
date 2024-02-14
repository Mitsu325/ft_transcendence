#!/bin/sh
>&2 echo "Starting server..."
npm run typeorm migration:generate -n InitialMigration
npm run typeorm migration:run
npm run start:prod
