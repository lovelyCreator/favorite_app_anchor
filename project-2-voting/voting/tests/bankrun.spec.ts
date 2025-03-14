import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";

const IDL = require("../target/idl/voting.json");
import { Voting } from '../target/types/voting';

const PUPPET_PROGRAM_ID = new PublicKey("6U9is3Bc3mtvtuWwhLXGkfMjgjHizavM4pTKwg2mvboE");

describe('Create a system account', () => {
    test("bankrun", async () => {
        const context = await startAnchor("", [{name: "voting", programId: PUPPET_PROGRAM_ID}], []);
        const provider = new BankrunProvider(context);
        const puppetProgram = new Program<Voting>(
            IDL,
            provider,
        );

        const [pollAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
            puppetProgram.programId
        );

        await puppetProgram.methods.initializePoll(
            new anchor.BN(1),
            new anchor.BN(0),
            new anchor.BN(1759508293),
            "test poll",
            "descripition",
        ).rpc();

        const pollAccount = await puppetProgram.account.pollAccount.fetch(pollAddress);
        console.log("Poll Account: ", pollAccount)
    })
})