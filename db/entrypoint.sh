#!/bin/bash

# docker-entrypoint.sh
postgres &


until psql -h localhost -U postgres -c '\l' > /dev/null 2>&1; do
  sleep 1
done

if ! psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw "$POSTGRES_DB"; then

    psql -h localhost -U postgres -c "CREATE DATABASE $POSTGRES_DB;"

    psql -h localhost -U postgres -c "CREATE USER $POSTGRES_USERNAME WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';"
    psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USERNAME;"
    psql -h localhost -U postgres -c "ALTER USER $POSTGRES_USERNAME CREATEDB;"
    echo "Database created."
else
    echo "Database '$POSTGRES_DB' already exists."
fi

# pg_ctl stop -D /var/lib/postgresql/data -m fast

# while pg_isready -q -h localhost -U postgres; do
#     sleep 1
# done

exec "$@"
