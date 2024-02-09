FROM postgres:alpine

COPY entrypoint.sh entrypoint.sh

RUN chmod +x entrypoint.sh

USER postgres

EXPOSE 5432

ENTRYPOINT [ "/entrypoint.sh" ]
