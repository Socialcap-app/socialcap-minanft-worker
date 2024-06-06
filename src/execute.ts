import "dotenv/config";
import { zkCloudWorkerClient } from "zkcloudworker";
import fs from "fs";

async function main(args: string[]) {
  console.log(`Socialcap MinaNFT Worker (c) MAZ/LM 2024 www.socialcap.app`);
  if (!args[0] || !args[1] || !args[2]) {
    console.log(`Use: \n  yarn start arg0 arg1 arg2`);
    process.exit(1);
  }
  console.log(`Arg0: ${args[0]} Arg1: ${args[1]} Arg2: ${args[2]}`);

  const JWT = process.env.JWT as string;

  const api = new zkCloudWorkerClient({
    jwt: JWT,
    chain: 'devnet'
  });

  const claim = {
    uid: '012345678'
  }

  const response = await api.execute({
    mode: "async",
    repo: "socialcap-minanft-worker",
    developer: "MAZ", // keep it simple, no strange chars here ! 
    task: "mint-minanft",
    metadata: `Mina NFT for Claim ${claim.uid}`,
    args: JSON.stringify({}),
    transactions: [JSON.stringify({
      memo: `Claim ${claim.uid}`.substring(0, 32), // memo field in Txn
      payer: args[0],
      fee: args[1],
      amount: args[2]
    })],
  });

  console.log("API response:", response);
  const jobId = response?.jobId;
  if (jobId === undefined) {
    throw new Error("Job ID is undefined");
  }

  console.log("Waiting for job ...");
  const jobResult = await api.waitForJobResult({ jobId });
  //console.log("Job result:", JSON.stringify(jobResult));
  //console.log("Job result.result:", JSON.stringify(jobResult.result));

  let { result } = jobResult.result;
  let fname = "./tmp/serialized-txn.json";
  console.log("Writing txn to: ", fname);
  console.log("Serialized Txn:", JSON.stringify(result, null, 2));

  fs.writeFileSync(fname, JSON.stringify(JSON.parse(result), null, 2));
}

main(process.argv.slice(2))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
