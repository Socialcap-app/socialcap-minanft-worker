import { UInt64, PublicKey, Mina, fetchAccount } from "o1js";
import { zkCloudWorker, Cloud, initBlockchain } from "zkcloudworker";

const MINA = 1e9;
const TXN_FEE = 100_000_000;

interface Payload {
  memo: string,
  payer: string;
  amount: number;
  fee: number;
};


function getPayload(transactions: string[]): Payload {
  if (!transactions || !transactions.length) 
    throw Error("No payload received.")      
  try { 
    let payload = JSON.parse(transactions[0]); 
    return payload;
  }
  catch(error) { 
    throw Error ("Could not parse received transaction.") 
  }
}

export class MinaNFTWorker extends zkCloudWorker {
  
  constructor(cloud: Cloud) {
    super(cloud);
  }

  public async execute(transactions: string[]): Promise<string | undefined> {
    console.log(`Task: ${this.cloud.task}`)
    console.log(`Args: ${this.cloud.args}`)
    console.log(`Payload: ${transactions[0]}`);
  
    let { memo, payer, amount, fee } = getPayload(transactions);
    console.log(`Receiving payload amount: ${amount} from: ${payer}, fee:${fee}, memo: ${memo}`);

    let unsignedTxn = { "hash": "DEMO-TXN-HASH" };
    console.log(`Unsigned transaction created and proved`);

    // return the serialized unsigned transaction
    return JSON.stringify(unsignedTxn);
  }
}
