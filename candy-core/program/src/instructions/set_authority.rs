use anchor_lang::prelude::*;

use crate::CandyMachine;

pub fn set_authority(
    ctx: Context<SetAuthority>,
    new_authority: Pubkey,
    new_mint_authority: Pubkey,
) -> Result<()> {
    let candy_machine = &mut ctx.accounts.candy_machine;

    candy_machine.authority = new_authority;
    candy_machine.mint_authority = new_mint_authority;

    Ok(())
}

#[derive(Accounts)]
pub struct SetAuthority<'info> {
    #[account(mut, has_one = authority)]
    candy_machine: Account<'info, CandyMachine>,
    authority: Signer<'info>,
}
