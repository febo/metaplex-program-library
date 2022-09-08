/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

/**
 * @category Instructions
 * @category SetCollection
 * @category generated
 */
export const setCollectionStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */;
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'SetCollectionInstructionArgs',
);
/**
 * Accounts required by the _setCollection_ instruction
 *
 * @property [_writable_] candyMachine
 * @property [**signer**] authority
 * @property [] updateAuthority
 * @property [**signer**] payer
 * @property [] collectionMetadata
 * @property [] collectionMint
 * @property [] collectionMasterEdition
 * @property [_writable_] collectionAuthorityRecord
 * @property [] tokenMetadataProgram
 * @category Instructions
 * @category SetCollection
 * @category generated
 */
export type SetCollectionInstructionAccounts = {
  candyMachine: web3.PublicKey;
  authority: web3.PublicKey;
  updateAuthority: web3.PublicKey;
  payer: web3.PublicKey;
  collectionMetadata: web3.PublicKey;
  collectionMint: web3.PublicKey;
  collectionMasterEdition: web3.PublicKey;
  collectionAuthorityRecord: web3.PublicKey;
  tokenMetadataProgram: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
};

export const setCollectionInstructionDiscriminator = [192, 254, 206, 76, 168, 182, 59, 223];

/**
 * Creates a _SetCollection_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetCollection
 * @category generated
 */
export function createSetCollectionInstruction(
  accounts: SetCollectionInstructionAccounts,
  programId = new web3.PublicKey('cndy3CZK71ZHMp9ddpq5NVvQDx33o6cCYDf4JBAWCk7'),
) {
  const [data] = setCollectionStruct.serialize({
    instructionDiscriminator: setCollectionInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.candyMachine,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.updateAuthority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.payer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.collectionMetadata,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMasterEdition,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionAuthorityRecord,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}