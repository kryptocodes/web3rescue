import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";

import Web3 from "web3";
import axios from "axios";
import { API } from "./_app";

import dynamic from "next/dynamic";


const Panic = () => {
  const [wallet, setWallet] = useState("");
  const [panic, setPanic] = useState(false);
  const [claimMode, setClaimMode] = useState(false);
  const [apiData, setApiData] = useState(false);
  const [stage, setStage] = useState(0);

  const [loading, setLoading] = useState(false);

  const SocialLoginDynamic = dynamic(
    () => import("../components/scw").then((res) => res.default),
    {
      ssr: false,
    }
  );
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWallet(localStorage.getItem("wallet"));
      console.log(wallet);
    }
  }, []);

  const PanicMode = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      console.log(panic);
      if (
        !panic?.privateKey ||
        !panic?.password ||
        !panic?.confirmPassword 
      ) {
        alert("Please fill all the fields");
        setLoading(false);
        return "";
      }
     
      if (panic?.password?.length < 8) {
        alert("Password should be atleast 8 characters");
        setLoading(false);
        return "";
      }
      const data = await axios.post(`${API}/panicmode`, {
        privatekey: panic?.privateKey,
        password: panic?.password,
        confirmpassword: panic?.confirmPassword,
        consent: true,
      });
      console.log(data);
      if (!data?.data?.success) {
        alert("No assets found in this wallet");
        setLoading(false);
        return "";
      }
      setApiData({
        erc20: data?.data?.erc20,
        nft: data?.data?.nft
      });
     if(erc20 || nft){
        setLoading(false);
        alert("assets found and tx simulated successfully");
     }
      // setApiData(true)
      // setStage(1)
    } catch (error) {
      console.log(error);
      setLoading(false);
    alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  const ClaimModeAPI = async(e) => {
    try {
        e.preventDefault();
        setLoading(true);
        console.log(panic);
        if (
          !panic?.privateKey ||
          !panic?.password ||
          !panic?.safeAddress 
        ) {
          alert("Please fill all the fields");
          setLoading(false);
          return "";
        }
       
        if (panic?.password?.length < 8) {
          alert("Password should be atleast 8 characters");
          setLoading(false);
          return "";
        }
        const data = await axios.post(`${API}/claim`, {
          privatekey: panic?.privateKey,
          password: panic?.password,
          safeaddress: panic?.safeAddress,
        });
        console.log(data);
        setLoading(false);
        alert("successfully rescued");
       
     
        // setApiData(true)
        // setStage(1)
      } catch (error) {
        console.log(error);
        setLoading(false);
        alert("Something went wrong");
      }
  };



  const SideLink = (Icon, Text, active = false) => (
    <>
      <li className="relative">
        <a
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
        {SideLink(require("../assets/panic.png"), "Panic Mode", true)}
        {SideLink(require("../assets/collectibles.png"), "Collectibles")}
        {SideLink(require("../assets/add.png"), "ERC-20 Tokens")}
      </ul>
    </div>
  );

  return (
    <>
      <div className="flex  h-screen overflow-hidden bg-gray-100  mx-auto">
        <SideBar />
        <div className="flex align-center justify-center items-center mx-auto bg-gray-100 ">
          <div className="bg-white shadow flex flex-col px-4 mt-12 px-12 py-12 rounded-lg shadow-lg">
         
            <div className="flex flex-row items-center  w-full -mt-28">
              <button
                onClick={() => setClaimMode(false)}
                className={` px-3 p-2 mb-4 w-1/2 ${
                  !claimMode ? "bg-[#6360D8] text-white" : "bg-white text-black"
                }`}
              >
                Panic Mode
              </button>
              <button
                onClick={() => setClaimMode(true)}
                className={` px-3 p-2 mb-4 w-1/2 ${
                  claimMode ? "bg-[#6360D8] text-white" : "bg-white text-black"
                }`}
              >
                Claim Mode
              </button>
            </div>
            <p className="text-black pt-8">
              {claimMode ? "Claim Mode" : "Panic Mode"}
            </p>
            <Suspense fallback={<div>Loading...</div>}>
        <SocialLoginDynamic />
      </Suspense>
            <br />
            <>
              {!loading && !claimMode && (
                <>
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
                    value={panic?.password}
                    onChange={(e) =>
                      setPanic({ ...panic, password: e.target.value })
                    }
                    type="text"
                    className="bg-gray-100 border-2 border-gray-300 text-gray-700 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    placeholder="Create Password"
                  />
                  <br />
                  <input
                    value={panic?.confirmPassword}
                    onChange={(e) =>
                      setPanic({ ...panic, confirmPassword: e.target.value })
                    }
                    type="text"
                    className="bg-gray-100 border-2 border-gray-300 text-gray-700 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    placeholder="Confirm Password"
                  />
                  <br />
                  <p className="text-gray-900 flex gap-2 mb-4">
                    <input type="checkbox" className="mr-2 text-white" />I
                    acknowledged the
                    <span className="text-red-500"> Terms and Conditions</span>
                  </p>
                  <button
                    onClick={(e) => PanicMode(e)}
                    className="bg-[#F43F5E]  text-white font-bold py-2 px-4 rounded"
                  >
                    Panic Mode
                  </button>
                </>
              )}

              {!loading && claimMode && (
                <>
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
                    value={panic?.password}
                    onChange={(e) =>
                      setPanic({ ...panic, password: e.target.value })
                    }
                    type="text"
                    className="bg-gray-100 border-2 border-gray-300 text-gray-700 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    placeholder="Create Password"
                  />
                  <br />
                  <input
                    value={panic?.safeAddress}
                    onChange={(e) =>
                      setPanic({ ...panic, safeAddress: e.target.value })
                    }
                    type="text"
                    className="bg-gray-100 border-2 border-gray-300 text-gray-700 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    placeholder="Safe Address"
                  />
                  <br />
                  <p className="text-gray-900 flex gap-2 mb-4">
                    <input
                      value={panic?.consent}
                      onChange={(e) =>
                        setPanic({ ...panic, consent: e.target.checked })
                      }
                      type="checkbox"
                      className="mr-2 text-white"
                    />
                    I acknowledged the
                    <span className="text-red-500"> Terms and Conditions</span>
                  </p>
                  <button
                    onClick={(e) => ClaimModeAPI(e)}
                    className="bg-[#F43F5E]  text-white font-bold py-2 px-4 rounded"
                  >
                    Claim Mode
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

export default Panic;
