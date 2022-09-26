import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Import Solana web3 functinalities
import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";

export function CreateAccount() {
    // Navigate to the next page after the click
    let navigate = useNavigate();

    // To save keypairs 
    const[newWalletKey, setNewWalletKey] = useState<Array<number>>();
    
    // This function stores the password
    useEffect(() => {
        window.localStorage.setItem("FROM_KEY", JSON.stringify(newWalletKey))
    }, [newWalletKey])

    const CreateWallet = async() => {
        // Connect to Solana dev net
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // Generate new keypairs
        var newWallet = Keypair.generate();

        // Store as a Unit8Array
        setNewWalletKey(Array.from(newWallet.secretKey));

        // Aidrop 2 SOL to the new Wallet
        console.log("Airdopping 2 SOL to the newly created wallet.");
        const fromAirDropSignature = await connection.requestAirdrop(
            newWallet.publicKey,
            2 * LAMPORTS_PER_SOL
        );
        // Latest blockhash (unique identifer of the block) of the cluster
        let latestBlockHash = await connection.getLatestBlockhash();
    
        // Confirm transaction using the last valid block height (refers to its time)
        await connection.confirmTransaction({
               blockhash: latestBlockHash.blockhash,
               lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
               signature: fromAirDropSignature
           });
    
        console.log("Airdrop completed for the created account");
    
        // Get the current balance
        var walletBalance = await connection.getBalance(newWallet.publicKey);
        // Console.log(newWallet.publicKey);
        console.log(walletBalance/LAMPORTS_PER_SOL);
        // Go to connect Page
        navigate("/connect");
    };

    return(
        <div style={{
            margin:0,
            position:"relative",
            top:"50%",
            left:"45%",
            }}>
            <button style={{
                fontSize: "16px",
                padding: "15px",
                fontWeight: "bold",
                borderRadius: "5px",
                textAlign:"center",
            }} onClick={CreateWallet}>
            Create a new Solana account
            </button>
        </div>
    )
}