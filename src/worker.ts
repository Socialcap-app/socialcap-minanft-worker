import { MINANFT_NAME_SERVICE_V2, MintParams, NameContractV2 } from "minanft";
import { UInt64, PublicKey, Mina, fetchAccount, AccountUpdate } from "o1js";
import { zkCloudWorker, Cloud, initBlockchain } from "zkcloudworker";

const MINA = 1e9;
const TXN_FEE = 100_000_000;


interface Payload {
  memo: string,
  payer: string;
  mintParams: MintParams;
  fee: number;
  claimUid: string;
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

    // let { chainId } = JSON.parse(this.cloud.args || '{"chainId": "devnet"}');
    // await initBlockchain(chainId);
    // console.log(`Using chain: ${chainId}`);
    
    let { memo, payer, fee, mintParams, claimUid } = getPayload(transactions);
    console.log(`Minting NFT for claim: ${claimUid} from: ${payer} for fee:${fee}`);

    let payerPublicKey = PublicKey.fromBase58(payer);
    let payerExists = await fetchAccount({ publicKey: payerPublicKey });
    if (!payerExists) throw Error("Fee payer account does not exist");
    console.log(`Payer account exists`);

  
    console.log(`Payer account exists`);
    
    const zkAppAddress = PublicKey.fromBase58(MINANFT_NAME_SERVICE_V2);
		const zkApp = new NameContractV2(zkAppAddress);
      
    
    const txn = await Mina.transaction({ 
        sender: payerPublicKey, 
        fee: TXN_FEE, 
        memo: (memo || "").substring(0,32) 
      }, 
      async () => {
        console.log("calling mint with ", mintParams)
        AccountUpdate.fundNewAccount(payerPublicKey);
        await zkApp.mint(mintParams)
      }
    );
    console.log(`Transaction created`, txn.toPretty());

    let unsignedTxn = await txn.prove();
    console.log(`Unsigned transaction created and proved`);

    // return the serialized unsigned transaction
    return unsignedTxn.toJSON();
  }
}
