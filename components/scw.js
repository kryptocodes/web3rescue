import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";

const SCW = () => {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [smartAccount, setSmartAccount] = useState(null);
  const [scwAddress, setScwAddress] = useState("");
  const [scwLoading, setScwLoading] = useState(false);
  const [socialLoginSDK, setSocialLoginSDK] = useState(
    null
  );

  const connectWeb3 = useCallback(async () => {
    if (typeof window === "undefined") return;
    console.log("socialLoginSDK", socialLoginSDK);
    if (socialLoginSDK?.provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        socialLoginSDK.provider
      );
      setProvider(web3Provider);
      const accounts = await web3Provider.listAccounts();
      setAccount(accounts[0]);
      return;
    }
    if (socialLoginSDK) {
      socialLoginSDK.showWallet();
      return socialLoginSDK;
    }
    const sdk = new SocialLogin();
    await sdk.init(ethers.utils.hexValue(80001));
    setSocialLoginSDK(sdk);
    sdk.showConnectModal();
    sdk.showWallet();
    return socialLoginSDK;
  }, [socialLoginSDK]);

  // if wallet already connected close widget
  useEffect(() => {
    console.log("hidelwallet");
    if (socialLoginSDK && socialLoginSDK.provider) {
      socialLoginSDK.hideWallet();
    }
  }, [account, socialLoginSDK]);

  // after metamask login -> get provider event
  useEffect(() => {
    const interval = setInterval(async () => {
      if (account) {
        clearInterval(interval);
      }
      if (socialLoginSDK?.provider && !account) {
        connectWeb3();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [account, connectWeb3, socialLoginSDK]);

  const disconnectWeb3 = async () => {
    if (!socialLoginSDK || !socialLoginSDK.web3auth) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await socialLoginSDK.logout();
    socialLoginSDK.hideWallet();
    setProvider(undefined);
    setAccount(undefined);
    setScwAddress("");
  };

  useEffect(() => {
    if(localStorage.getItem("biconomyAddress")) {
        setAccount(localStorage.getItem("biconomyAddress"))
    }
    async function setupSmartAccount() {
      setScwAddress("");
      setScwLoading(true);
      const smartAccount = new SmartAccount(provider, {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [ChainId.GOERLI],
      });
      await smartAccount.init();
      const context = smartAccount.getSmartAccountContext();
      setScwAddress(context.baseWallet.getAddress());
      setSmartAccount(smartAccount);
      localStorage.setItem("contract",scwAddress)
      setScwLoading(false);
    }
    if (!!provider && !!account) {
      setupSmartAccount();
      console.log("Provider...", provider);
      localStorage.setItem("biconomyAddress", account);
     
    }
  }, [account, provider]);

  return (
    <div>
      <main className="text-black">
       
        <button
            className={`text-white font-bold py-2 px-4 rounded ${account ? 'bg-green-500' : 'bg-[#6360D8] '}`}
        onClick={() => !account ? connectWeb3() : navigator.clipboard.writeText(account)}
        >
          {!account ? "Generate Safe Address using biconomy" : "Safe Address Generated using biconomy"}
        </button>

       
        
      </main>
    </div>
  );
};

export default SCW;