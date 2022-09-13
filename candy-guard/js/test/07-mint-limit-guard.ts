import test from 'tape';
import { amman, InitTransactions, killStuckProcess } from './setup';
import { PublicKey } from '@solana/web3.js';
import { MerkleTree } from 'merkletreejs';
import { keccak_256 } from '@noble/hashes/sha3';
import { u32 } from '@metaplex-foundation/beet';
import { PROGRAM_ID } from '../src/generated';

const API = new InitTransactions();

killStuckProcess();

test('allowlist', async (t) => {
  // deploys a candy guard with a mint limit

  const { fstTxHandler, payerPair, connection } = await API.payer();

  const data = {
    default: {
      botTax: null,
      liveDate: null,
      lamports: null,
      splToken: null,
      thirdPartySigner: null,
      whitelist: null,
      gatekeeper: null,
      endSettings: null,
      allowList: null,
      mintLimit: {
        id: 0,
        limit: 2,
      },
      nftPayment: null,
    },
    groups: null,
  };

  const { candyGuard, candyMachine } = await API.deploy(
    t,
    data,
    payerPair,
    fstTxHandler,
    connection,
  );

  // mint (as a minter)

  const {
    fstTxHandler: minterHandler,
    minterPair: minterKeypair,
    connection: minterConnection,
  } = await API.minter();

  const [mintCounterPda] = await PublicKey.findProgramAddress(
    [new Uint8Array([0]), minterKeypair.publicKey.toBuffer(), candyGuard.toBuffer()],
    PROGRAM_ID,
  );

  const [, mintForMinter] = await amman.genLabeledKeypair('Mint Account (minter)');
  const { tx: minterMintTx } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    minterKeypair,
    mintForMinter,
    minterHandler,
    minterConnection,
  );

  await minterMintTx.assertSuccess(t);
});
