import "./App.css";
import backgroundVideo from "./assets/background.mp4";
import nftVideo from "./assets/nftvideo.mp4";
import mfer from "./assets/mfer.png";
import { useMoralis } from "react-moralis";
import { HashLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./contracts/contract.json";
import { Moralis } from "moralis";

const contractAddress = "0x2A015FA98fBA8B7f580fA00B9166b81e9d94EECF";

function App() {
  const [supply, setSupply] = useState(0);
  const {
    authenticate,
    isAuthenticated,
    logout,
    isAuthenticating,
    authError,
    enableWeb3,
  } = useMoralis();

  useEffect(async () => {
    if (isAuthenticated) {
      //connect the contract
      const web3Provider = await enableWeb3();
      const contract = new ethers.Contract(contractAddress, abi, web3Provider);
      console.log(contract);
      let supply = await contract.totalSupply(0);
      supply = supply.toNumber();
      setSupply(supply);
      console.log(supply);
    }
  }, [isAuthenticated]);

  const mint = async () => {
    //mint the nft with Moralis
    let mintOptions = {
      contractAddress,
      functionName: "mint",
      abi,
      params: {
        amount: 1,
      },
    };
    const transaction = await Moralis.executeFunction(mintOptions);
    console.log(transaction);
  };

  return (
    <div className="wrapper">
      <video
        className="video"
        autoPlay
        loop
        playsInline
        muted
        src={backgroundVideo}
        width="600"
        height="300"
      />
      <div className="container">
        <div className="left">
          {/* <video
            className="nft-video"
            autoPlay
            loop
            playsInline
            muted
            src={nftVideo}
            width="600"
            height="300"
          /> */}
          <img
            className="nft-video"
            src={mfer}
            alt="mfer"
            width="600"
            height="300"
          />
        </div>
        <div className="right">
          <div className="content">
            <h1>Mfer #3424</h1>
            <p>{supply} minted /100</p>
            <div className="buttons">
              {!isAuthenticated ? (
                <button
                  className="mint"
                  onClick={authenticate}
                  style={{ width: "275px" }}
                >
                  {isAuthenticating ? (
                    <div style={{ display: "flex" }}>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        Authenticating...
                      </p>
                      <HashLoader height={1} width={1} size={20} />
                    </div>
                  ) : (
                    "Connect"
                  )}
                </button>
              ) : (
                <>
                  <button className="mint" onClick={() => mint()}>
                    Mint
                  </button>
                  <button className="reset">Start Over</button>
                  <br />
                  <button
                    className="mint"
                    onClick={logout}
                    style={{ width: "275px" }}
                  >
                    Logout
                  </button>
                </>
              )}
              <p className="error">{authError ? authError.message : ""}</p>
            </div>
          </div>
        </div>
        <div className="footer">Minting Now</div>
      </div>
    </div>
  );
}

export default App;
