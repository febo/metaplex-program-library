/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

/**
 * @category Instructions
 * @category Mint
 * @category generated
 */
export type MintInstructionArgs = {
  mintArgs: Uint8Array;
  label: beet.COption<string>;
};
/**
 * @category Instructions
 * @category Mint
 * @category generated
 */
export const mintStruct = new beet.FixableBeetArgsStruct<
  MintInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['mintArgs', beet.bytes],
    ['label', beet.coption(beet.utf8String)],
  ],
  'MintInstructionArgs',
);
/**
 * Accounts required by the _mint_ instruction
 *
 * @property [] candyGuard
 * @property [] candyMachineProgram
 * @property [_writable_] candyMachine
 * @property [_writable_] candyMachineAuthorityPda
 * @property [_writable_, **signer**] payer
 * @property [_writable_] nftMetadata
 * @property [_writable_] nftMint
 * @property [**signer**] nftMintAuthority
 * @property [_writable_] nftMasterEdition
 * @property [] collectionAuthorityRecord
 * @property [] collectionMint
 * @property [_writable_] collectionMetadata
 * @property [] collectionMasterEdition
 * @property [] collectionUpdateAuthority
 * @property [] tokenMetadataProgram
 * @property [] recentSlothashes
 * @property [] instructionSysvarAccount
 * @category Instructions
 * @category Mint
 * @category generated
 */
export type MintInstructionAccounts = {
  candyGuard: web3.PublicKey;
  candyMachineProgram: web3.PublicKey;
  candyMachine: web3.PublicKey;
  candyMachineAuthorityPda: web3.PublicKey;
  payer: web3.PublicKey;
  nftMetadata: web3.PublicKey;
  nftMint: web3.PublicKey;
  nftMintAuthority: web3.PublicKey;
  nftMasterEdition: web3.PublicKey;
  collectionAuthorityRecord: web3.PublicKey;
  collectionMint: web3.PublicKey;
  collectionMetadata: web3.PublicKey;
  collectionMasterEdition: web3.PublicKey;
  collectionUpdateAuthority: web3.PublicKey;
  tokenMetadataProgram: web3.PublicKey;
  tokenProgram?: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  recentSlothashes: web3.PublicKey;
  instructionSysvarAccount: web3.PublicKey;
};

export const mintInstructionDiscriminator = [51, 57, 225, 47, 182, 146, 137, 166];

/**
 * Creates a _Mint_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Mint
 * @category generated
 */
export function createMintInstruction(
  accounts: MintInstructionAccounts,
  args: MintInstructionArgs,
  programId = new web3.PublicKey('grd1hVewsa8dR1T1JfSFGzQUqgWmc1xXZ3uRRFJJ8XJ'),
) {
  const [data] = mintStruct.serialize({
    instructionDiscriminator: mintInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.candyGuard,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.candyMachineProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.candyMachine,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.candyMachineAuthorityPda,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.nftMetadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.nftMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.nftMintAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.nftMasterEdition,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionAuthorityRecord,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMetadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMasterEdition,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionUpdateAuthority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
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
    {
      pubkey: accounts.recentSlothashes,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.instructionSysvarAccount,
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
