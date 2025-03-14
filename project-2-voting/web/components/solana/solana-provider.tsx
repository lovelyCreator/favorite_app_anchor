'use client'

import dynamic from "next/dynamic";
import { AnchorProvider } from '@coral-xyz/anchor';
import { walletError } from '@solana/wallet-adapter-base';
import {
    AnchorWallet,
    useConnection,
}