// Import Solana web3 functinalities
import {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
  } from "@solana/web3.js";

// Handling Buffer error when making transaction
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

export function TransferSol() {

    const transfer1Sol = async() => {
        // Connect to devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // Get the stored key information
        const FROM_KEY = JSON.parse(window.localStorage.getItem("FROM_KEY")!);
        const TO_KEY = JSON.parse(window.localStorage.getItem("TO_KEY")!);

        // Get Keypair from Secret Key
        var from = Keypair.fromSecretKey(new Uint8Array(FROM_KEY));
        // Send 1 SOL
        var transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(from.publicKey),
                toPubkey: new PublicKey(TO_KEY),
                lamports:LAMPORTS_PER_SOL,
            })
        )
        // sign transaction
        var signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from],
        )

        console.log("signature", signature);
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
            }} onClick={transfer1Sol}>
            Transfer to new wallet
            </button>
        </div>
    )
}