import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Search from './components/Search'
import Domain from './components/Domain'

// ABIs
import ETHDaddy from './abis/ETHDaddy.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [eTHDaddy, setETHDaddy] = useState(null)
  const [domains, setDomains] = useState([])

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const eTHDaddy = new ethers.Contract(config[network.chainId].ETHDaddy.address, ETHDaddy, provider)
    setETHDaddy(eTHDaddy)

    const maxSupply = await eTHDaddy.maxSupply()
    const domains = []

    for (var i = 1; i <= maxSupply; i++) {
      const domain = await eTHDaddy.getDomain(i)
      domains.push(domain)
    }

    setDomains(domains)
    console.log(domains)
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <Search />

      <div className='cards__section'>
        <h2 className='cards__title'>Why you need a domain name.</h2>
        <p className='cards__description'>
          Own your custom username, use it across services, and
          be able to store an avatar and other profile data.
        </p>

        <hr />

        <div className='cards'>
          {domains.map((domain, index) => (
            // <Domain domain={domain} eTHDaddy={eTHDaddy} provider={provider} id={index + 1} key={index} />
            <p>yuguygyug</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;