# Socialcap MinaNFT zkCloudWorker

It mints a Mina NFT using an approved Socialcap Claim.

## Install

**Requirements**: 
- Needs `yarn` installed globally.

Clone this repo into your working dir (we will assume `~/myworkdir` from here on):
~~~
cd ~/myworkdir
git clone git@github.com:Socialcap-app/socialcap-minanft-worker.git ./
~~~

Install dependencies
~~~
cd ~/myworkdir/socialcap-minanft-worker
yarn install
~~~

Install (globally) **zkCloudWorker CLI** tool:
~~~
npm install -g zkcloudworker
~~~

Check **zkCloudWorker CLI** and version:
~~~
zkcloudworker -V
~~~
or 
~~~
zkcw -V
~~~

## Deploy

To deploy the worker to the **zkCloudWorker cloud**:
~~~
cd ~/myworkdir/socialcap-minanft-worker
zkcw -v deploy
~~~

You can see an example deploy output in the [logs/deploy.log](./logs/deploy.log) file.

## Run  

### Create environment 

BEFORE running the worker you need to create and `.env` file:
~~~
cd ~/myworkdir/socialcap-minanft-worker
cp .env-example .env
~~~

You may need to change the `JWT` token to use your own token, but the provided JWT will work for demo purposes.

### Test run

Please look at `src/execute.ts` as example code on how to call the worker.

To do a fast test on the deployed worker, you can do:
~~~
cd ~/myworkdir/
yarn test arg0 arg1 arg2
~~~

You can see an example run output in the [logs/run.log](./logs/run.log) file.

## Change and redeploy

After making changes to the worker code, you will need to redeploy.

**CAUTION**: BEFORE running `zkcw -v deploy` again be sure to increase the
 `version` number in your `package.json` file, otherwise the deploy may fail.

