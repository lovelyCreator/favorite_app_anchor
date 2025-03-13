use anchor_lang::prelude::*;
declare_id!("9EBgUYhj7ScDuscrDML3QTv9ofNarxtmDemSbL4aZ7yM");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod project1 {
    use super::*;

    pub fn set_project1(context: Context<SetProject1>, number: u64, color: String, hobbies: Vec<String>) -> Result<()> {
        let user_public_key = context.accounts.user.key();
        msg!("Greetings from {}", context.program_id);
        msg!(
            "User {user_public_key}'s favorite number is {number}, favorite color is : {color}",
        );
        msg!(
            "User's hobbies are: {:?}",
            hobbies
        );
        context.accounts.project1.set_inner(Project1 {
            number,
            color,
            hobbies
        });
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Project1 {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>
}

#[derive(Accounts)]
pub struct SetProject1<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Project1::INIT_SPACE,
        seeds=[b"project1", user.key().as_ref()],
    bump)]
    pub project1: Account<'info, Project1>,
    
    pub system_program: Program<'info, System>,
}
