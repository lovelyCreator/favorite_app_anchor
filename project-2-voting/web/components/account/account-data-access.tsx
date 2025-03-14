'use client'

import { useConnection, useWallet } from '@soalana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
    Connection,
    SystemProgram,
    TransactionMessage,
    TransactionSignature,
    VersionedTransaction
} from '@solana/web3.js';
import { useMutation, useQuery, useQureyClient } from '@tanstack/react-query';
import toast  from 'react-hot-toast';
import { useTransactionToast } from '../ui/ui-layout';