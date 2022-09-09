import test from 'tape';
import { InitTransactions, killStuckProcess } from './setup/';
import * as program from '../src/generated';

const init = new InitTransactions();

killStuckProcess();

test('mint (authority)', async (t) => {
  const { fstTxHandler, payerPair, connection } = await init.payer();
  const items = 10;

  const data: program.CandyMachineData = {
    itemsAvailable: items,
    symbol: 'CORE',
    sellerFeeBasisPoints: 500,
    maxSupply: 0,
    isMutable: true,
    creators: [
      {
        address: payerPair.publicKey,
        verified: false,
        percentageShare: 100,
      },
    ],
    configLineSettings: {
      prefixName: 'TEST ',
      nameLength: 10,
      prefixUri: 'https://arweave.net/',
      uriLength: 50,
      isSequential: false,
    },
    hiddenSettings: null,
  };

  const { tx: transaction, candyMachine: address } = await init.create(
    t,
    payerPair,
    data,
    fstTxHandler,
    connection,
  );
  // executes the transaction
  await transaction.assertSuccess(t);

  const lines: program.ConfigLine[] = [];

  for (let i = 0; i < items; i++) {
    lines[i] = {
      name: `NFT #${i + 1}`,
      uri: 'uJSdJIsz_tYTcjUEWdeVSj0aR90K-hjDauATWZSi-tQ',
    };
  }

  const { txs } = await init.addConfigLines(t, address, payerPair, lines);
  // this should fail since hiddenSettings do not have config lines
  for (const tx of txs) {
    await fstTxHandler
      .sendAndConfirmTransaction(tx, [payerPair], 'tx: AddConfigLines')
      .assertSuccess(t);
  }

  const { tx: mintTransaction } = await init.mint(t, address, payerPair, fstTxHandler, connection);
  await mintTransaction.assertSuccess(t);
});

test('mint (minter)', async (t) => {
  const { fstTxHandler, payerPair, connection } = await init.payer();
  const items = 10;

  const data: program.CandyMachineData = {
    itemsAvailable: items,
    symbol: 'CORE',
    sellerFeeBasisPoints: 500,
    maxSupply: 0,
    isMutable: true,
    creators: [
      {
        address: payerPair.publicKey,
        verified: false,
        percentageShare: 100,
      },
    ],
    configLineSettings: {
      prefixName: 'TEST ',
      nameLength: 10,
      prefixUri: 'https://arweave.net/',
      uriLength: 50,
      isSequential: false,
    },
    hiddenSettings: null,
  };

  const { tx: transaction, candyMachine: address } = await init.create(
    t,
    payerPair,
    data,
    fstTxHandler,
    connection,
  );
  // executes the transaction
  await transaction.assertSuccess(t);

  const lines: program.ConfigLine[] = [];

  for (let i = 0; i < items; i++) {
    lines[i] = {
      name: `NFT #${i + 1}`,
      uri: 'uJSdJIsz_tYTcjUEWdeVSj0aR90K-hjDauATWZSi-tQ',
    };
  }

  const { txs } = await init.addConfigLines(t, address, payerPair, lines);
  // this should fail since hiddenSettings do not have config lines
  for (const tx of txs) {
    await fstTxHandler
      .sendAndConfirmTransaction(tx, [payerPair], 'tx: AddConfigLines')
      .assertSuccess(t);
  }

  // keypair of the minter
  const {
    fstTxHandler: minterHandler,
    minterPair,
    connection: minterConnection,
  } = await init.minter();

  try {
    const { tx: mintTransaction } = await init.mint(
      t,
      address,
      minterPair,
      minterHandler,
      minterConnection,
    );
    await mintTransaction.assertSuccess(t);
    t.fail('only authority is allowed to mint');
  } catch {
    // we are expecting an error
    t.pass('minter is not the candy machine authority');
  }
});
