FROM google/nodejs

WORKDIR /app
COPY package.json /app/
RUN npm install -g typescript && rm -rf node_modules/ && npm install && \
	((find ./node_modules/epcis-js/ -name "*.ts" | xargs tsc --module commonjs) || true)

# less static parts
COPY *.ts /app/
RUN (find . -name "*.ts" -not -path "./node_modules/*" | xargs tsc --module commonjs) || true

CMD []
ENTRYPOINT ["/nodejs/bin/npm", "start"]