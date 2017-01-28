FROM daocloud.io/node:latest
RUN mkdir /app/
COPY ./ /app/
WORKDIR /app/
EXPOSE 1337 1337
CMD ["./buildtask/entrypoint.sh"]