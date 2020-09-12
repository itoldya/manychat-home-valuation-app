# ManyChat Home Valuation App

[![Build Status](https://travis-ci.org/itoldya/manychat-home-valuation-app.svg?branch=master)](https://travis-ci.org/itoldya/manychat-home-valuation-app)
[![Coverage Status](https://coveralls.io/repos/github/itoldya/manychat-home-valuation-app/badge.svg?branch=master)](https://coveralls.io/github/itoldya/manychat-home-valuation-app?branch=master)

## Links
- [Documentation](https://www.notion.so/ManyChat-Home-Valuation-App-3d10b997d0ee407291ccf7c3eda1ce08)
- [Demo in Messenger](https://m.me/117860430051082?ref=w12801924)

## How to run
The application is implemented using [Serverless Express](https://www.serverless.com/blog/serverless-express-apis-aws-lambda-http-api). 

Clone repo and install NPM dependencies
```bash
git clone git@github.com:itoldya/manychat-home-valuation-app.git
cd manychat-home-valuation-app
```

Create `.env` file with your AWS credentials
```bash
AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Run application in dev mode. If you are running serverless for the first time, just do `serverless login` and follow the instructions.
```bash
serverless dev
```