//import all essential components like Account, System Account, ... for building & interacting with solana programs
use anchor_lang::prelude::*;
//independent program Id. It is generated when anchor init.
declare_id!("9EBgUYhj7ScDuscrDML3QTv9ofNarxtmDemSbL4aZ7yM");

//discriminator is 8-byte identifier added in the begining of the account's data.
//It is unique by account's type.
//Anchor programs always use 8-bytes for the discriminator.
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;


//Our Solana program
#[program]
//Solana program name
pub mod project1 {
    //import statements that brings all public items from the parent module in to the current scope.
    use super::*;
    //The Anchor context refers to the structure and data that are available to a smart contract during its execution, enabling developers to manage state and interact with accounts efficiently.
    //program attribute: public function name-set_project1, 
    //parameters: context-Anchor Context type, mumber-unsigned 64 type, color: String type, hobbiles: String Vec type
    //Result<()>: If the function success, it returns no value.
    pub fn set_project1(context: Context<SetProject1>, number: u64, color: String, hobbies: Vec<String>) -> Result<()> {
        //Extract user public key
        let user_public_key = context.accounts.user.key();
        //Message to Solana program logs!
        //Message of program_id.
        msg!("Greetings from {}", context.program_id);
        //Message of user public key, favorite number and color.
        msg!(
            "User {user_public_key}'s favorite number is {number}, favorite color is : {color}",
        );
        //Message of hobbies Vec
        msg!(
            "User's hobbies are: {:?}",
            hobbies
        );
        //Set inner data of project1 account to the provided user preferences.
        context.accounts.project1.set_inner(Project1 {
            number,
            color,
            hobbies
        });

        //If all operations are successful, the function returns an Ok result with no value.
        Ok(())
    }
}


//What we will put inside the Favorites PDA - Global datas
//account macro is used to define structure of data stored in custom accounts created by your program.
#[account]
//derive(InitSpace) macro is used to automatically calculate the inital space required for an account.
#[derive(InitSpace)]
//Data stored in a Solana account
pub struct Project1 {
    pub number: u64,
    //we can use #[max_len()] in Anchor for set max length of String or Vec.
    //max_len(50) macro means that the max length of String is 50.
    #[max_len(50)]
    pub color: String,

    //max_len(5, 50) macro means that the max length of Vec<String> is (5:Vec len, 50:String len).
    #[max_len(5, 50)]
    pub hobbies: Vec<String>
}
//derive(Accounts) macro derives the necessary traits for the account struct, allowing Anchor to validate and manage teh accounts.
#[derive(Accounts)]
//Define the account struct for the SetProject1 instruction. 
//The 'info lifetime parameter is used to specify that the accounts are tied to the lifetime of the instruction's context.
pub struct SetProject1<'info> {

    //This specifies a mutable account for the user who is executing the instruction.
    //In Anchor, this macro is used to specify that an account is mutable.
    #[account(mut)]
    //This specifies that the user account is a signer of the transaction.
    pub user: Signer<'info>,

    //This specifies an accoount for storing data of type Project1
    #[account(
        //If the account does not exist, it will be initialized.
        init_if_needed,
        //user account is responsible for paying for account initalization.
        payer = user,
        // space for the account
        space = ANCHOR_DISCRIMINATOR_SIZE + Project1::INIT_SPACE,
        //deriving the program-derived address(PDA) of project1 account
        //b"project1" is byte String seed used for identification of the type of account or the purpose of the PDA.
        //user.key().as_ref() is another seed that includes the public key of the user account.
        seeds=[b"project1", user.key().as_ref()],
    bump)]
    //Project1 account that stores data of Project1 type
    pub project1: Account<'info, Project1>,
    
    //This specifies the system program accont, which is required for initializing new accounts.
    pub system_program: Program<'info, System>,
}
