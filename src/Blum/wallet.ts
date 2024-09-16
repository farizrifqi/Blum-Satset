import { createHash } from "crypto";
import nacl, { SignKeyPair } from "tweetnacl";
import naclUtils from "tweetnacl-util";
import { Int64LE } from "int64-buffer";
import { mnemonicNew } from "ton-crypto";
import { mnemonicToSeed } from "tonweb-mnemonic";
import TonWeb from "tonweb";
import fs from "node:fs";
export const saveWallet = (data: any) => {
  try {
    fs.writeFileSync(
      "wallet.txt",
      `${data.username}|Mnemonic:${data.mnemonicPhrase}|TonAddress:${data.addressTON}|Address:${data.address}\n`
    );
    return true;
  } catch (err) {
    return false;
  }
};
export const createTonWallet = async () => {
  const tonweb = new TonWeb();
  const mnemonic = await mnemonicNew(24);
  const seed = await mnemonicToSeed(mnemonic);
  const mnemonicPhrase = mnemonic.join(" ");
  const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
  const wallet = tonweb.wallet.create({
    publicKey: keyPair.publicKey,
    workchain: 0,
    walletVersion: "v3R1",
  });
  const walletAddress = await wallet.getAddress();
  const addressTON = walletAddress.toString(true, true);
  const address = walletAddress.toString(false, false, true, true);
  return { address, addressTON, keyPair, mnemonicPhrase };
};

export interface ProofData {
  account: {
    address: string;
    chain: string;
    publicKey: string;
  };
  tonProof: {
    name: string;
    proof: {
      domain: {
        lengthBytes: number;
        value: string;
      };
      payload: string;
      signature: string;
      timestamp: number;
    };
  };
}
export const readyProof = async (
  keyPair: SignKeyPair,
  address: any
): Promise<ProofData> => {
  const domain = "telegram.blum.codes";
  const payload = Math.floor(Date.now() / 1e3);
  const timestamp = Math.floor(Date.now() / 1e3);
  const timestampBuffer = new Int64LE(timestamp).toBuffer();

  const domainBuffer = Buffer.from(domain);
  const domainLengthBuffer = Buffer.allocUnsafe(4);
  domainLengthBuffer.writeInt32LE(domainBuffer.byteLength);

  const [workchain, addrHash] = address.split(":");

  const addressWorkchainBuffer = Buffer.allocUnsafe(4);
  addressWorkchainBuffer.writeInt32BE(Number(workchain));

  const addressBuffer = Buffer.concat([
    addressWorkchainBuffer,
    Buffer.from(addrHash, "hex"),
  ]);

  const messageBuffer = Buffer.concat([
    Buffer.from("ton-proof-item-v2/"),
    addressBuffer,
    domainLengthBuffer,
    domainBuffer,
    timestampBuffer,
    Buffer.from(payload.toString()),
  ]);

  const message = createHash("sha256").update(messageBuffer).digest();

  const bufferToSign = Buffer.concat([
    Buffer.from("ffff", "hex"),
    Buffer.from("ton-connect"),
    message,
  ]);
  const signed = nacl.sign.detached(
    createHash("sha256").update(bufferToSign).digest(),
    keyPair.secretKey
  );
  const signature = naclUtils.encodeBase64(signed);

  const proof = {
    domain: { lengthBytes: 19, value: "telegram.blum.codes" },
    payload: payload.toString(),
    signature: signature,
    timestamp: timestamp,
  };

  const proofBase58 = Buffer.from(keyPair.publicKey).toString("hex");
  const postData = {
    account: {
      address: address,
      chain: "-239",
      publicKey: proofBase58,
    },
    tonProof: {
      name: "ton_proof",
      proof: proof,
    },
  };
  return postData;
};
