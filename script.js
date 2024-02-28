let provider;
let signer;
var connected = "false";
const tokenAddress = "0xE501D65df59b9cfeAB6053F56FD5C0e197966Aa2";
const tokenABI = [
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
	{
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
]

const contractAddress = "0x7953B37C710b226615E24994a2F8D0826Bd70c24"
const contractABI = [
	{
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
]

async function connectWallet () {
	if (typeof window.ethereum !== "undefined") {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
			signer = await provider.getSigner();
      const {chainId} = await provider.getNetwork();
      console.log(chainId)
      if (chainId != 168587773) {
        alert("You need to switch network to Blast Test Network");
      } else {
  			const walletAddress = await signer.getAddress();

        connected = "true";
  			unityGame.SendMessage('ConnectWalletButton', 'ReceiveAddress', walletAddress.toLowerCase());
        
      }
		} catch (error) {
		  	console.error('Failed to connect to MetaMask:', error);
		  	alert("Failed to connect to MetaMask")
		}
  } 
}

function checkConnected() {
  unityGame.SendMessage('Managers', 'successConnected', connected);
}

async function payArcade () {
	const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
	const contract = new ethers.Contract(contractAddress, contractABI, signer);
	const walletAddress = await signer.getAddress();
	try {
		const approvedAmnt = await tokenContract.allowance(walletAddress, contractAddress);
		if (Number(approvedAmnt) < 1000) {
			const approve_tx = await tokenContract.approve(contractAddress, 1000);
		}
		const deposit_tx = await contract.deposit();
		const receipt = await deposit_tx.wait();
		unityGame.SendMessage('Managers', 'SuccessPaid', receipt.transactionHash);
	} catch (e) {
		alert("someting went wrong");
	}
}

async function getArcadeBalance () {
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  try {
    const balance = await tokenContract.balanceOf("0x7953B37C710b226615E24994a2F8D0826Bd70c24");
    unityGame.SendMessage('Managers', 'SuccessAracadeBalance', (Number(balance) / 1000).toString());
  } catch (e) {
    console.log(e)
    alert("someting went wrong"); 
  }
}