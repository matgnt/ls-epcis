FROM google/nodejs

WORKDIR /app
COPY package.json /app/
RUN npm install -g typescript && npm install --production

# les  static parts
COPY *.ts /app/
RUN (find . -name "*.ts" -not -path "./node_modules/*" | xargs tsc --module commonjs) || true

CMD []
ENTRYPOINT ["/nodejs/bin/npm", "start"]