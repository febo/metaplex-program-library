/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
export type MintLimit = {
  id: number;
  limit: number;
};

/**
 * @category userTypes
 * @category generated
 */
export const mintLimitBeet = new beet.BeetArgsStruct<MintLimit>(
  [
    ['id', beet.u8],
    ['limit', beet.u32],
  ],
  'MintLimit',
);
