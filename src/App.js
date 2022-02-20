import "./App.css";
import backgroundVideo from "./assets/background.mp4";
import nftVideo from "./assets/nftvideo.mp4";
import mfer from "./assets/mfer.png";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

function App() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();

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
            <p>0/100 Minted</p>
            <div className="buttons">
              {!isAuthenticated ? (
                <button
                  className="mint"
                  onClick={authenticate}
                  style={{ width: "200px" }}
                >
                  Connect Wallet
                </button>
              ) : (
                <>
                  <button className="mint">Mint</button>
                  <button className="reset">Start Over</button>
                  <br />
                  <button
                    className="mint"
                    onClick={logout}
                    style={{ width: "200px", marginLeft: "40px" }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="footer">Minting Now</div>
      </div>
    </div>
  );
}

export default App;
