FROM google/nodejs

WORKDIR /app
ADD package.json /app/
RUN npm install -g typescript && npm install && \
	((find . -name "*.ts" | xargs tsc --module commonjs) || true)

# add it at the end because this is the file that changes most often
# the earlier parts are more or less static
ADD *.js /app/

CMD []
ENTRYPOINT ["/nodejs/bin/npm", "start"]