import { useState } from "react";
import {
  PublicKey, 
  Connection, 
  clusterApiUrl
} from "@solana/web3.js";
import "./styles.css";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';  // THIS CAUSES "CRYPTO" MODULE ERROR UNLESS RESOLVED
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { parseURL, createTransfer } from "@solana/pay";
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]

const program_address = "3ERnPj1gQnKzagvWCjqZGskJszcLhunXuLfYqjuSvxBW";
const programID = new PublicKey(program_address);
console.log("programID:", programID)
const opts = {
  preflightCommitment: "processed"
}
const network = clusterApiUrl('devnet');

/* REPLACE THIS SENDER ADDRESS WITH YOUR WALLET ADDRESS FROM WHERE YOU WANT TO INITIATE A TRANSFER */
// const sender_address = "3qupQgH5RaigtFNV7acr7Y9xvcc91F71VCf1szPH1Xej";  // Wallet 3 of my Phantom

window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  const wallet = useWallet();
  console.log("Wallet Status:", wallet.connected)
  const [isSubmitted, setIsSubmitted] = useState(false);

  // const handleChange = e => {
  //   setTransactionMode(e.target.value)
  // };

  
async function solPay() {
  const network = clusterApiUrl('devnet');
  const connection = new Connection(network, opts.preflightCommitment);
  
  const url =
    'solana:3qupQgH5RaigtFNV7acr7Y9xvcc91F71VCf1szPH1Xej?amount=1&reference=DqesRRc5fmXcG21HcgeWBsxryJmdYcerE8YzYHHJgoz1&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId5678';
  const { recipient, amount, splToken, reference, label, message, memo } = parseURL(url);
  console.log("recipient:", recipient)
  console.log("amount:", amount)
  console.log("splToken:", splToken)
  console.log("reference:", reference)
  console.log("label:", label)
  console.log("message:", message)
  console.log("memo:", memo)
  
  /**
 * Create the transaction with the parameters decoded from the URL
 */
const payer = window.solana.publicKey;
console.log("payer:", payer)
const tx = await createTransfer(connection, payer, { recipient, amount, reference, memo });
console.log("tx:", tx)
const signed = await window.solana.signTransaction(tx);
const signature = await connection.sendRawTransaction(signed.serialize());
console.log("signature:", signature)
const finality = "confirmed";
await connection.confirmTransaction(signature, finality);

/**
 * Send the transaction to the network
 */
//  sendAndConfirmTransaction(connection, tx, [CUSTOMER_WALLET]);

}

const handleSubmit = async (event) => {
  //Prevent page reload
  event.preventDefault();  
  solPay()
  };

// JSX code for login form
const renderForm = (
  <div className="form">

    <form onSubmit={handleSubmit}>
      <div className="button-container">
        <input type="submit"  value='Send'/>
      </div>
    </form>
  </div>
);

// ADDED THIS CODE SNIPPET
if (!wallet.connected) {
  /* If the user's wallet is not connected, display connect wallet button. */
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
      <WalletMultiButton />
    </div>
  )
} else {
  return (
    <div className="App">
      <div className="login-form">
        <div className="title">Solana Pay</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  );
}
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
// <ConnectionProvider endpoint="http://127.0.0.1:8899">
<ConnectionProvider endpoint={network}>
  <WalletProvider wallets={wallets} autoConnect>
    <WalletModalProvider>
      <App />
    </WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
)

export default AppWithProvider;


