#!/bin/sh

until PGPASSWORD=$POSTGRES_PASSWORD PGUSER=$POSTGRES_USER PGHOST=$POSTGRES_HOST PGDATABASE=$POSTGRES_DB psql -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up"
exec "$@"
