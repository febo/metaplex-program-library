import test from 'tape';
import { amman, InitTransactions, killStuckProcess } from './setup';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { AccountMeta, PublicKey } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { METAPLEX_PROGRAM_ID } from './utils';
import { CandyMachine } from '../../../candy-core/js/src/generated';

const API = new InitTransactions();

killStuckProcess();

test.only('nft payment (burn)', async (t) => {
  const { fstTxHandler, payerPair, connection } = await API.payer();

  const data = {
    default: {
      botTax: null,
      liveDate: {
        date: 1662479807,
      },
      lamports: null,
      splToken: null,
      thirdPartySigner: null,
      whitelist: null,
      gatekeeper: null,
      endSettings: null,
      allowList: null,
      mintLimit: null,
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

  // mint (as an authority)

  const [, mintForAuthority] = await amman.genLabeledKeypair('Mint Account (authority)');
  const { tx: authorityMintTx } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    payerPair,
    mintForAuthority,
    fstTxHandler,
    connection,
  );
  await authorityMintTx.assertSuccess(t);

  // enables the nft_payment guard

  const candyMachineObject = await CandyMachine.fromAccountAddress(connection, candyMachine);

  const updatedData = {
    default: {
      botTax: null,
      liveDate: {
        date: 1662479807,
      },
      lamports: null,
      splToken: null,
      thirdPartySigner: null,
      whitelist: null,
      gatekeeper: null,
      endSettings: null,
      allowList: null,
      mintLimit: null,
      nftPayment: {
        burn: true,
        requiredCollection: candyMachineObject.collectionMint,
        wallet: candyGuard,
      },
    },
    groups: null,
  };

  const { tx: updateTx } = await API.update(t, candyGuard, updatedData, payerPair, fstTxHandler);
  await updateTx.assertSuccess(t);

  // mint (as a minter)

  const {
    fstTxHandler: minterHandler,
    minterPair: minter,
    connection: minterConnection,
  } = await API.minter();
  const [, mintForMinter] = await amman.genLabeledKeypair('Mint Account (minter)');
  const { tx: minterMintTx } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    minter,
    mintForMinter,
    minterHandler,
    minterConnection,
  );
  await minterMintTx.assertError(t, /Missing expected remaining account/i);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(payerPair));
  const nft = await metaplex.nfts().findByMint({ mintAddress: mintForAuthority.publicKey }).run();
  const collection = await metaplex
    .nfts()
    .findByMint({ mintAddress: candyMachineObject.collectionMint })
    .run();
  const paymentGuardAccounts: AccountMeta[] = [];

  // token account
  const [tokenAccount] = await PublicKey.findProgramAddress(
    [
      payerPair.publicKey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintForAuthority.publicKey.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  paymentGuardAccounts.push({
    pubkey: tokenAccount,
    isSigner: false,
    isWritable: true,
  });
  // tokent metadata
  paymentGuardAccounts.push({
    pubkey: nft.metadataAddress,
    isSigner: false,
    isWritable: true,
  });
  // token edition
  const [tokenEdition] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mintForAuthority.publicKey.toBuffer(),
      Buffer.from('edition'),
    ],
    METAPLEX_PROGRAM_ID,
  );
  paymentGuardAccounts.push({
    pubkey: tokenEdition,
    isSigner: false,
    isWritable: true,
  });
  // mint account
  paymentGuardAccounts.push({
    pubkey: nft.address,
    isSigner: false,
    isWritable: true,
  });
  // mint collection
  paymentGuardAccounts.push({
    pubkey: collection.metadataAddress,
    isSigner: false,
    isWritable: true,
  });

  const [, mintForAuthority2] = await amman.genLabeledKeypair('Mint Account 2 (authority)');
  const { tx: authorityMintTx2 } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    payerPair,
    mintForAuthority2,
    fstTxHandler,
    connection,
    paymentGuardAccounts,
  );
  await authorityMintTx2.assertSuccess(t);
});

test('nft payment as minter (burn)', async (t) => {
  const { fstTxHandler, payerPair, connection } = await API.payer();

  const data = {
    default: {
      botTax: null,
      liveDate: {
        date: 1662479807,
      },
      lamports: null,
      splToken: null,
      thirdPartySigner: null,
      whitelist: null,
      gatekeeper: null,
      endSettings: null,
      allowList: null,
      mintLimit: null,
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
    minterPair: minter,
    connection: minterConnection,
  } = await API.minter();
  const [, mintForMinter] = await amman.genLabeledKeypair('Mint Account (minter)');
  const { tx: minterMintTx } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    minter,
    mintForMinter,
    minterHandler,
    minterConnection,
  );
  await minterMintTx.assertSuccess(t);

  // enables the nft_payment guard

  const candyMachineObject = await CandyMachine.fromAccountAddress(connection, candyMachine);

  const updatedData = {
    default: {
      botTax: null,
      liveDate: {
        date: 1662479807,
      },
      lamports: null,
      splToken: null,
      thirdPartySigner: null,
      whitelist: null,
      gatekeeper: null,
      endSettings: null,
      allowList: null,
      mintLimit: null,
      nftPayment: {
        burn: true,
        requiredCollection: candyMachineObject.collectionMint,
      },
    },
    groups: null,
  };

  const { tx: updateTx } = await API.update(t, candyGuard, updatedData, payerPair, fstTxHandler);
  await updateTx.assertSuccess(t);

  // mint (as a minter)

  const metaplex = Metaplex.make(connection).use(keypairIdentity(payerPair));
  const nft = await metaplex.nfts().findByMint({ mintAddress: mintForMinter.publicKey }).run();
  const collection = await metaplex
    .nfts()
    .findByMint({ mintAddress: candyMachineObject.collectionMint })
    .run();
  const paymentGuardAccounts: AccountMeta[] = [];

  // token account
  const [tokenAccount] = await PublicKey.findProgramAddress(
    [minter.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintForMinter.publicKey.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  paymentGuardAccounts.push({
    pubkey: tokenAccount,
    isSigner: false,
    isWritable: true,
  });
  // tokent metadata
  paymentGuardAccounts.push({
    pubkey: nft.metadataAddress,
    isSigner: false,
    isWritable: true,
  });
  // token edition
  const [tokenEdition] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mintForMinter.publicKey.toBuffer(),
      Buffer.from('edition'),
    ],
    METAPLEX_PROGRAM_ID,
  );
  paymentGuardAccounts.push({
    pubkey: tokenEdition,
    isSigner: false,
    isWritable: true,
  });
  // mint account
  paymentGuardAccounts.push({
    pubkey: nft.address,
    isSigner: false,
    isWritable: true,
  });
  // mint collection
  paymentGuardAccounts.push({
    pubkey: collection.metadataAddress,
    isSigner: false,
    isWritable: true,
  });

  const [, mintForMinter2] = await amman.genLabeledKeypair('Mint Account 2 (minter)');
  const { tx: minterMintTx2 } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    minter,
    mintForMinter2,
    fstTxHandler,
    connection,
    paymentGuardAccounts,
  );
  await minterMintTx2.assertSuccess(t);
});

test('nft payment (transfer)', async (t) => {
  const { fstTxHandler, payerPair, connection } = await API.payer();

  const data = {
    default: {
      botTax: null,
      liveDate: {
        date: 1662479807,
      },
      lamports: null,
      splToken: null,
      thirdPartySigner: null,
      whitelist: null,
      gatekeeper: null,
      endSettings: null,
      allowList: null,
      mintLimit: null,
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
    minterPair: minter,
    connection: minterConnection,
  } = await API.minter();
  const [, mintForMinter] = await amman.genLabeledKeypair('Mint Account (minter)');
  const { tx: minterMintTx } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    minter,
    mintForMinter,
    minterHandler,
    minterConnection,
  );
  await minterMintTx.assertSuccess(t);

  // enables the nft_payment guard

  const candyMachineObject = await CandyMachine.fromAccountAddress(connection, candyMachine);

  const updatedData = {
    default: {
      botTax: null,
      liveDate: {
        date: 1662479807,
      },
      lamports: null,
      splToken: null,
      thirdPartySigner: null,
      whitelist: null,
      gatekeeper: null,
      endSettings: null,
      allowList: null,
      mintLimit: null,
      nftPayment: {
        burn: false,
        requiredCollection: candyMachineObject.collectionMint,
      },
    },
    groups: null,
  };

  const { tx: updateTx } = await API.update(t, candyGuard, updatedData, payerPair, fstTxHandler);
  await updateTx.assertSuccess(t);

  // mint (as a minter)

  const [, mintForMinter2] = await amman.genLabeledKeypair('Mint Account 2 (minter)');
  const { tx: minterMintTx2 } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    minter,
    mintForMinter2,
    minterHandler,
    minterConnection,
  );
  await minterMintTx2.assertError(t, /Missing expected remaining account/i);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(payerPair));
  const nft = await metaplex.nfts().findByMint({ mintAddress: mintForMinter.publicKey }).run();
  const paymentGuardAccounts: AccountMeta[] = [];

  // token account
  const [tokenAccount] = await PublicKey.findProgramAddress(
    [minter.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintForMinter.publicKey.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  paymentGuardAccounts.push({
    pubkey: tokenAccount,
    isSigner: false,
    isWritable: true,
  });
  // tokent metadata
  paymentGuardAccounts.push({
    pubkey: nft.metadataAddress,
    isSigner: false,
    isWritable: true,
  });
  // transfer authority
  paymentGuardAccounts.push({
    pubkey: minter.publicKey,
    isSigner: false,
    isWritable: false,
  });
  // destination
  paymentGuardAccounts.push({
    pubkey: tokenAccount,
    isSigner: false,
    isWritable: true,
  });

  const [, mintForMinter3] = await amman.genLabeledKeypair('Mint Account 3 (minter)');
  const { tx: minterMintTx3 } = await API.mint(
    t,
    candyGuard,
    candyMachine,
    minter,
    mintForMinter3,
    minterHandler,
    minterConnection,
    paymentGuardAccounts,
  );
  await minterMintTx3.assertSuccess(t);
});
