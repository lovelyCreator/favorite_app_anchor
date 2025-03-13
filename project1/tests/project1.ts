import * as anchor from "@coral-xyz/anchor";
import type { Program } from "@coral-xyz/anchor";
import type { Project1 } from "../target/types/project_1";
import { getCustomErrorMessage } from '@solana-developers/helpers';
import { assert } from 'chai';
import { systemProgramErrors } from "./system-errors";
const web3 = anchor.web3;

describe("project1", () => {
  // Configure the client to use the dev cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  //set user as payer of wallet.
  const user = (provider.wallet as anchor.Wallet).payer;
  //create random guy account
  const someRandomGuy = web3.Keypair.generate();
  const program = anchor.workspace.Project1 as Program<Project1>;

  //Parameters of user favorite. It will be written to the blockchain.
  //BN means bignumber so create 23 number with BigNumber type.
  const favoriteNumber = new anchor.BN(66);
  const favoriteColor = "green";
  const favoriteHobbies = ["football", "pingpong", "esports"];

  //If we use localNet, we don't need airdrop because local cluster gives us 85billion dollars worth of SOL
  before(async () => {
    const balance = await provider.connection.getBalance(user.publicKey);
    const balanceInSOL = balance / web3.LAMPORTS_PER_SOL;
    //change it to string with ...000,000,000.00... types
    const formattedBalance = new Intl.NumberFormat().format(balanceInSOL);
    console.log(`Balance: ${formattedBalance}SOL`);
  })

  it("Write our favorites to the blockchain", async () => {
    //Here methods allow you to access all smart contract functions in program(project1)
    await program.methods
      .setProject1(favoriteNumber, favoriteColor, favoriteHobbies)
      //the signer of this transaction is User.
      .signers([user])
      //This is for sending transactions to Solana Network(Remote Procedure Call)
      .rpc()
    //find the PDA for the user's favorites
    const favoritesPdaAndBump = web3.PublicKey.findProgramAddressSync([Buffer.from('project1'), user.publicKey.toBuffer()], program.programId);
    const favoritesPda = favoritesPdaAndBump[0];
    const dataFromPda = await program.account.project1.fetch(favoritesPda);
    
    //Compare online data and default data
    assert.equal(dataFromPda.color, favoriteColor);
    assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
    console.log("dataFromPda.hobbies: ", dataFromPda.hobbies, "\n favoritePda: ", favoritesPda)
    assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);
  });

  it('Updates the favorites', async () => {
    const newFavoriteHobbies = ['volleyball', 'basketball', 'badminton'];
    try {
      await program.methods.setProject1(favoriteNumber, favoriteColor, newFavoriteHobbies).signers([user]).rpc();
    } catch (e) {
      console.error((e as Error).message);
      const customErrorMessage = getCustomErrorMessage(systemProgramErrors, e);
      console.log("customErrorMessage: ", customErrorMessage);
      throw new Error(customErrorMessage);
    }
  });

  it('Rejects transactions from unauthorized signers', async() => {
    try {
      await program.methods.setProject1(favoriteNumber, favoriteColor, favoriteHobbies).signers([someRandomGuy]).rpc()
    } catch (e) {
      const errorMessage = (e as Error).message;
      assert.isTrue(errorMessage.includes('unknown signer'));
    }
  });

});
