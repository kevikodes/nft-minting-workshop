import "./App.css";
import backgroundVideo from "./assets/background.mp4";
import mfer from "./assets/mfer.png";
import { useMoralis } from "react-moralis";
import { HashLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./contracts/contract.json";

const contractAddress = "0xf51F1627398d60acC073CAC7e4D017F6c2CB2155";

function App() {
  const [supply, setSupply] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hash, setHash] = useState("");
  const {
    authenticate,
    isAuthenticated,
    logout,
    isAuthenticating,
    authError,
    enableWeb3,
    Moralis,
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
  }, [isAuthenticated, enableWeb3]);

  const mint = async () => {
    //mint the nft with Moralis
    let mintOptions = {
      contractAddress,
      functionName: "mint",
      abi,
      msgValue: ethers.utils.parseEther("0.001"),
      params: {
        amount: 1,
      },
    };
    const transaction = await Moralis.executeFunction(mintOptions);
    setHash(transaction.hash);
    setInProgress(true);
    await transaction
      .wait(4)
      .then((receipt) => {
        setInProgress(false);
        setIsCompleted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkEtherscan = () => {
    let url = "https://rinkeby.etherscan.io/tx/" + hash;
    window.open(url, "_blank");
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
          <img
            className="nft-video"
            src={mfer}
            alt="mfer"
            width="600"
            height="300"
          />
        </div>
        <div className="right">
          {inProgress ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginBottom: 50,
                }}
              >
                <h1 style={{ marginRight: 50 }}>Minting...</h1>
                <HashLoader color="#fff" />
              </div>
              <button
                className="reset"
                style={{ margin: 0 }}
                onClick={checkEtherscan}
              >
                Check Etherscan
              </button>
            </div>
          ) : (
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
                    <button
                      className="reset"
                      onClick={() => (
                        setIsCompleted(false), setInProgress(false), logout()
                      )}
                    >
                      Start Over
                    </button>
                  </>
                )}
                <div className="success">
                  {isCompleted && (
                    <div>
                      Minted successfully! Check Etherscan for your NFT.
                      <button className="completeBtn" onClick={checkEtherscan}>
                        Check Etherscan!
                      </button>
                    </div>
                  )}
                </div>
                <p className="error">{authError ? authError.message : ""}</p>
              </div>
            </div>
          )}
        </div>
        <div className="footer">Minting Now</div>
      </div>
    </div>
  );
}

export default App;
