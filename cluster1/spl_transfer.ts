import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("EeYa5be1qzQ7vVefrPah2MK7UozA4ue6kXzrQP4nvPGW");

// Recipient address
const to = new PublicKey("EWsVxzTq2kZc7Lehdpk13YkEU7PpU7ufHGny2Dd9fRB3");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair, 
            mint, 
            keypair.publicKey,
        );
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair, 
            mint, 
            to,
        );
        // Transfer the new token to the "toTokenAccount" we just created
        const txid = await transfer(
            connection,
            keypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair.publicKey,
            1_000_000n, // 0.001 SOL
        );
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();