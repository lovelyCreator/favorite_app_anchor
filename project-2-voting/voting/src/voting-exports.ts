import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import type {Voting} from '../target/types/voting';
import { IDL as VotingIDL } from '../target/types/voting';

//Re-export the generated IDL and type
export { Voting, VotingIDL };

export const BASIC_PROGRAM_ID = new PublicKey(VotingIDL.address);

export function getBasicProgram(provider: AnchorProvider) {
    return new Program(VotingIDL as Voting, provider)
}