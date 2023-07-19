import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }
    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }
    const buttonStyles = {
      margin: "10px",
      padding: "12px 20px",
      borderRadius: "8px",
      border: "none",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      backgroundColor: "#008CBA", // Blue color
    };
    if (!account) {
      return (
        <button onClick={connectAccount} style={buttonStyles}>Click to connect your Metamask wallet</button>
      );
    }
    if (balance === undefined) {
      getBalance();
    }

    const depositButtonStyles = {
      ...buttonStyles,
      backgroundColor: "#4CAF50", 
    };

    const withdrawButtonStyles = {
      ...buttonStyles,
      backgroundColor: "#f44336",
    };
  
    return (
      <div>
        <p style={{ fontSize: "20px" }}>Account connected: {account}</p>
        <p style={{ fontSize: "20px" }}>The Balance: {balance}</p>
        <button onClick={deposit} style={depositButtonStyles}>
          +1 ETH (deposit)
        </button>
        <button onClick={withdraw} style={withdrawButtonStyles}>
          -1 ETH (withdraw)
        </button>
      </div>
    );
  };
  useEffect(() => {
    getWallet();
  }, []);

return (
  <main className="container">
    <header>
      <h1>Welcome to the ETH ATM!</h1>
    </header>
    <div className="content">{initUser()}</div>
    <style jsx>{`
      .container {
        text-align: center;
        background-color: lightgreen;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .content {
        margin-top: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        max-width: 400px;
        margin: 0 auto;
      }

      .content p {
        margin-bottom: 10px;
      }

      .content button {
        margin: 5px;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    `}</style>
  </main>
);
}
