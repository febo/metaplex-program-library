import test from 'tape';
import { InitTransactions, killStuckProcess } from './setup/';
import * as program from '../src/generated';

const init = new InitTransactions();

killStuckProcess();

test('add_config_lines', async (t) => {
  const { fstTxHandler, payerPair, connection } = await init.payer();
  const items = 100;

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

  const { tx: transaction, candyMachine: address } = await init.initialize(
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
  // confirms that all lines have been written
  for (const tx of txs) {
    await fstTxHandler
      .sendAndConfirmTransaction(tx, [payerPair], 'tx: AddConfigLines')
      .assertSuccess(t, [/New config line added/i]);
  }
});

test('add_config_lines (hidden settings)', async (t) => {
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
    configLineSettings: null,
    hiddenSettings: {
      name: 'Hidden NFT',
      uri: 'https://arweave.net/uJSdJIsz_tYTcjUEWdeVSj0aR90K-hjDauATWZSi-tQ',
      hash: Buffer.from('74bac30d82a0baa41dd2bee4b41bbc36').toJSON().data,
    },
  };

  const { tx: transaction, candyMachine: address } = await init.initialize(
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
      .assertError(t, /do not have config lines/i);
  }
});
