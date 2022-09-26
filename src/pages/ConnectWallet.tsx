import {
    PublicKey,
    Transaction,
  } from "@solana/web3.js";
import {useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";

export function ConnectWallet() {
    
    // Navigate to the another page
    let navigate = useNavigate();

    // create types
    type DisplayEncoding = "utf8" | "hex";
      
    type PhantomEvent = "disconnect" | "connect" | "accountChanged";
    type PhantomRequestMethod =
        | "connect"
        | "disconnect"
        | "signTransaction"
        | "signAllTransactions"
        | "signMessage";
      
    interface ConnectOpts {
        onlyIfTrusted: boolean;
      }
      
    // create a provider interface
    interface PhantomProvider {
        publicKey: PublicKey | null;
        isConnected: boolean | null;
        signTransaction: (transaction: Transaction) => Promise<Transaction>;
        signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
        signMessage: (
          message: Uint8Array | string,
          display?: DisplayEncoding
        ) => Promise<any>;
        connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
        disconnect: () => Promise<void>;
        on: (event: PhantomEvent, handler: (args: any) => void) => void;
        request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
      }
      
      /**
       * @description gets Phantom provider, if it exists
       */
       const getProvider = (): PhantomProvider | undefined => {
        if ("solana" in window) {
          // @ts-ignore
          const provider = window.solana as any;
          if (provider.isPhantom) return provider as PhantomProvider;
        }
      };
        // create state variable for the provider
        const [provider, setProvider] = useState<PhantomProvider | undefined>(
            undefined
        );

        // create state variable for the wallet key
        const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
        undefined
        );

        // This function stores the password
        useEffect(() => {
          window.localStorage.setItem("TO_KEY", JSON.stringify(walletKey))
        }, [walletKey])

        // this is the function that runs whenever the component updates (e.g. render, refresh)
        useEffect(() => {
            const provider = getProvider();

        // if the phantom provider exists, set this as the provider
        if (provider) setProvider(provider);
            else setProvider(undefined);
        }, []);
    /**
   * @description prompts user to connect wallet if it exists.
	 * This function is called when the connect wallet button is clicked
   */
    const connectWallet = async () => {
        // @ts-ignore
        const { solana } = window;

            // checks if phantom wallet exists
        if (solana) {
            try {
                // connects wallet and returns response which includes the wallet public key
                const response = await solana.connect();
                console.log('wallet account ', response.publicKey.toString());
                
                // update walletKey to be the public key
                setWalletKey(response.publicKey.toString());
            } catch (err) {}
        }

    };
    const disConnectWallet = async () => {
        // @ts-ignore
        const { solana } = window;
        // Checks if phantom wallet exists
        if (solana) {
          try {
            // Disconnect wallet
            solana.disconnect();
            // Forget user's public key once they disconnect
            solana.on("disconnect", () => {
              setWalletKey(undefined);
            });
          } catch (err) {}
        }
      };

    const NavigateRoute = () => {
        // Go to transfer Page
        navigate("/transfer");
        
    };
    return(
        <div style={{
            margin:0,
            position:"relative",
            top:"50%",
            left:"45%",
            }}>
            <h2>
                Solana Account has been created!
            </h2>
            {provider && walletKey ?
                <div>
                    <p>You are connected to Wallet: {provider?.publicKey?.toString()}</p>
                    <button style={{
                        fontSize: "16px",
                        padding: "15px",
                        fontWeight: "bold",
                        borderRadius: "5px",
                        textAlign:"center",
                    }} onClick={disConnectWallet}>
                        Disconnect from Phantom Wallet
                    </button>
                    <button style={{
                        fontSize: "16px",
                        padding: "15px",
                        fontWeight: "bold",
                        borderRadius: "5px",
                        textAlign:"center",
                    }} onClick={NavigateRoute}>
                        To transfer
                    </button>
            </div>
            :
            <h3>Let's connect your Phantom wallet!</h3>
            }
            {provider && !walletKey && (
                <button
                  style={{
                    fontSize: "16px",
                    padding: "15px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    textAlign:"center",
                  }}
                  onClick={connectWallet}
                >
                  Connect to Phantom Wallet
                </button>
                )}
            {!provider && (
              <p>
                No provider found. Install{" "}
                <a href="https://phantom.app/">Phantom Browser extension</a>
              </p>
            )}
        </div>
    )
}