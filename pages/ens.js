import React, { useEffect, useState } from "react";
import Image from "next/image";

import Web3 from "web3";
import axios from "axios";
import { API } from "./_app";

import { useRouter } from 'next/router'

import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { ToastContainer, toast } from 'react-toastify';

const ENS = () => {
  const [wallet, setWallet] = useState("");
  const [panic, setPanic] = useState(false);
  const [claimMode, setClaimMode] = useState(false);
  const [apiData, setApiData] = useState(false);
  const [stage, setStage] = useState(0);
  const [token,setToken] = useState(false)
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWallet(localStorage.getItem("wallet"));
      console.log(wallet);
       localStorage.getItem("wallet") && fetchERC20Tokens(localStorage.getItem('wallet'));
    }
   
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(token));
    console.log(token?.id)
    }, [token]);


    function convertNFTToData(walletaddress,token_id,safeaddress) {
        const datatosend = '0x23b872dd000000000000000000000000' + walletaddress.substring(2) + '000000000000000000000000' + safeaddress.substring(2);
        const initialtokendata = '0000000000000000000000000000000000000000000000000000000000000000';
        const tokenIDtostring = parseInt(token_id).toString(16);
        const midstringdata = initialtokendata.slice(0, -tokenIDtostring.length);
        const finalstringdata = midstringdata + tokenIDtostring;
        const finaldata = datatosend + finalstringdata;
        return finaldata
        }

    

    const fetchERC20Tokens = async (walletaddress) => {
        
      
        
        const enstokens = await axios.get(`https://deep-index.moralis.io/api/v2/${walletaddress}/nft`, { params: { chain: 'eth', format: 'decimal', token_addresses: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' }, headers: { accept: 'application/json', 'X-API-Key': 'i9pF2GEg0P3w0pYZ4xzNDkZq4sXnxHidd7fXtO3ETfNNIm1t8Aq4LAUcAv54wk4z' } })
        let filteredNftTokens = enstokens?.data?.result;
        console.log(filteredNftTokens)
        setApiData(filteredNftTokens)
        setToken(filteredNftTokens[0])
        console.log(token)
    }

const ERC20Tx = async(e) => {
    console.log(panic?.safeAddress)
    try{
        setLoading(true)
        const dataTx = await convertNFTToData(wallet,token?.token_id,panic?.safeAddress);
        const tx = {
            chainId: 1,
            type: 2,
            value: ethers.utils.parseUnits("0", 'ether'),
            maxFeePerGas: ethers.utils.parseUnits('50', 'gwei'),
            maxPriorityFeePerGas: ethers.utils.parseUnits('50', 'gwei'),
            gasLimit: 150000,
            to: token?.token_address,
            data: dataTx,
          }
        const data = await signTransaction(tx,panic?.privateKey)
        console.log(data[0])
        const apiCall = await axios.post(`${API}/nft`,{
            signedTransaction: data[0],
            compromisedAddress: wallet,
        })
        console.log(apiCall)
        setLoading(false);
        toast.success("Rescued Successfully");
        setPanic(false);
    }
    catch(error){
        toast.error("something went wrong")
        setLoading(false)
    }
}

  

  const SideLink = (Icon, Text, active = false,link) => (
    <>
      <li className="relative">
        <a
        onClick={(() => router.push(link))}
          className={`flex items-center text-sm py-4 px-6 h-12 overflow-hidden  text-ellipsis whitespace-nowrap rounded  transition duration-300 ease-in-out ${
            active ? "bg-red-500 text-white" : "text-black"
          }`}
          href="#!"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
        >
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              active ? "" : "bg-gray-100"
            }`}
          >
            <Image
              src={Icon}
              alt="icon"
              className="mx-auto object-cover object-center "
              width={20}
              height={20}
            />
          </span>
          <span className="flex-grow mx-4 font-medium">{Text}</span>
        </a>
      </li>
    </>
  );

  const SideBar = () => (
    <div className="w-60 h-full shadow-md bg-white px-1 w-1/6">
      <span className="p-2">
        <Image
          src={require("../assets/logo.png")}
          className="h-8 object-fit mr-3 "
          alt="web3rescue Logo"
        />
      </span>
      <ul className="relative">
        <li className="relative mb-4">
          <a
            href="#"
            className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden  text-ellipsis whitespace-nowrap rounded  transition duration-300 ease-in-out"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
              <Image
                src={require("../assets/wallet.png")}
                alt="icon"
                className="mx-auto object-cover object-center "
                width={20}
                height={20}
              />
            </span>
            <span className="flex-grow mx-4 font-medium text-black">
              {wallet?.slice(0, 5) + "..." + wallet?.slice(38)}
            </span>
          </a>
        </li>
        {SideLink(require("../assets/panic.png"), "Panic Mode",false,"/panic")}
        {SideLink(require("../assets/collectibles.png"), "Collectibles",false,"/nft")}
        {SideLink(require("../assets/add.png"), "ERC-20 Tokens",false,"/erc20")}
        {SideLink(require("../assets/ens.png"), "ENS",true,"/ens")}
        {SideLink(require("../assets/panic.png"), "SCW", false,"/scw")}
      </ul>
    </div>
  );

  async function signTransaction(rawTransaction, privateKey, cb) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/eth"
      );
      console.log({ privateKey });
      const compromisedwallet = new ethers.Wallet(privateKey, provider);
      const authSigner = new ethers.Wallet(
        "0x2000000000000000000000000000000000000000000000000000000000000000"
      );
      const flashbotProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        "https://relay.flashbots.net"
      );
      const signedTxBundle = await flashbotProvider.signBundle([
        {
          signer: compromisedwallet,
          transaction: rawTransaction,
        },
      ]);
      return signedTxBundle;
    } catch (err) {
      console.log("Sign error:", err.message);
    }
  }

  return (
    <>
    <ToastContainer position="top-center" />
      <div className="flex  h-screen overflow-hidden bg-gray-100  mx-auto">
        <SideBar />
        <div className="flex align-center justify-center items-center mx-auto bg-gray-100 ">
          <div className="bg-white shadow flex flex-col px-4 mt-12 px-12 py-12 rounded-lg shadow-lg">
           
            <p className="text-black pt-8">
             ENS
            </p>
            <br />
            <>
              {!loading && !claimMode && (
                <>
                <select className="w-full h-12 px-4 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    onChange={(e) => setToken(JSON.parse(e.target.value))}
                    defaultValue={apiData && apiData[0]}
                >
                    {
                        apiData && apiData.map((item,index)=>{
                            return(
                                
                                <option
                                value={JSON.stringify(item)}
                                
                                key={index}>

                                    
                                    {item?.name} 
                                  
                                </option>
                            )
                        }
                        )
                    }
                     
                </select>
                  <input
                    value={panic?.privateKey}
                    onChange={(e) =>
                      setPanic({ ...panic, privateKey: e.target.value })
                    }
                    type="text"
                    className="bg-gray-100 border-2 border-gray-300 text-gray-700 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    placeholder="Enter your private keys"
                  />

                  <br />
              
                  <input
                    value={panic?.safeAddress}
                    onChange={(e) =>
                      setPanic({ ...panic, safeAddress: e.target.value })
                    }
                    type="text"
                    className="bg-gray-100 border-2 border-gray-300 text-gray-700 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    placeholder="Enter your Safe Address"
                  />

                  <button
                    onClick={(e) => ERC20Tx(e)}
                    className="bg-[#F43F5E]  text-white font-bold py-2 px-4 rounded"
                  >
                    Rescue ENS
                  </button>
                </>
              )}

             
              {loading && (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-black mb-12">
                    Please wait while we are processing your request
                  </p>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black mt-12 mb-12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1zm3.293 1.707a1 1 0 001.414 0L12 11.414l1.293 1.293a1 1 0 001.414-1.414l-2-2a1 1 0 00-1.414 0l-2 2a1 1 0 000 1.414z"
                    ></path>
                  </svg>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default ENS;
