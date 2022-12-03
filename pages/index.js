import React from 'react'
import Image from 'next/image'

import Web3 from 'web3'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'


const Index = () => {
    const router = useRouter()

    const connectWallet = async() => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        const name = await provider.lookupAddress(accounts[0]);
        if(name){
          console.log(name);
        }
       
        localStorage.setItem('wallet', accounts[0]);
        router.push("/panic")
    }

    const NavBar = () => (
      <>
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
  <div className="container flex flex-wrap items-center justify-between mx-auto">
    <a href="#" className="flex items-center">
        <Image src={require("../assets/logo.png")} className="h-8 object-fit mr-3 " alt="web3rescue Logo" />
        
    </a>
   
    <div className="w-full  md:w-auto" id="navbar-default">
      <ul className="flex flex-col mx-auto justify-center items-center align-center p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
        <li>
          <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">How it Works</a>
        </li>
        <li>
          <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">FAQs</a>
        </li>
        <li>
          <a
          onClick={() => connectWallet()}
          href="#" className="block p-4 text-white rounded bg-[#6360D8] hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  ">Connect Wallet</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
      </>
    )
 

    const Landing = () => (
      <>
      <section class="text-gray-600 body-font bg-white">
  <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col  md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 class="title-font text-5xl mb-4 font-medium text-gray-900">Rescue your Ethereum Tokens and NFT&#39;s from Compromised accounts</h1>
     
      <div class="flex w-full md:justify-start justify-center items-end">
        <div class="relative mr-4 md:w-full lg:w-full xl:w-1/2 w-2/4">
        
          <input type="text" id="hero-field" name="hero-field"
          placeholder="Enter your compromised Wallet Address "
          className="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
        </div>
        <button class="inline-flex text-white bg-[#F43F5E] border-0 py-2 px-6 focus:outline-none rounded text-lg">Panic Mode</button>
      </div>
      
    </div>
    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <Image src={require("../assets/landing.png")} alt="landing" className='mx-auto object-cover object-center ' width={500} height={500} />
  </div>
  </div>
</section>
      </>
    )

    return (
      <>
        <NavBar/>
        <Landing/>
      </>
    );
}

export default Index