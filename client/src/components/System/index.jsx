import React, { useState, useEffect } from "react";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import getWeb3 from "../../getWeb3";
import {Header, Icon, Segment, Form} from 'semantic-ui-react'
import sha256 from 'crypto-js/sha256';

export default function System () {
  const [click, setClick] = useState(false);
  const [hash, setHash] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [ic, setIc] = useState("");
  const [dob, setDob] = useState("");
  const [date, setDate] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [account, setAccount] = useState([]);
  const [contract, setContract] = useState();
  const [verified, setVerified] = useState(false);
  const [vaccinationStatus, setVaccinationStatus] = useState(false);
  useEffect(()=>{
    async function fetchData() {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
    
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        instance.options.address = "0xB02502DdB8CabA027D7a667981c88cFf7B660B5E"
        setContract(instance)
        setAccount(accounts)
        setLoaded(true)
      
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      
    }
  
  }
  fetchData();
  },[account]);
  

  useEffect(()=>{
    async function fetchCertificate() {
        if (!click && hash !== "") {
            try {
                await contract.methods.fetchCert(hash).call()
                    .then(result => {
                        setName(result.name)
                        setSex(result.sex)
                        setIc(result.ic)
                        setDob(result.dob)
                        setVaccinationStatus(result.vaccinationStatus)
                        setDate(result.date)
                        
            });
            }
            catch (e){
                console.error(e);
            }
        }
    }
    fetchCertificate();
  },[hash])

  const fileChange = (e) => {
    let reader = new FileReader();
    reader.onload = function(evt) {
      setHash(sha256(evt.target.result).toString());
    };
    reader.readAsText(e.target.files[0])
}

const handleClick = event => {
  hiddenFileInput.current.click();
};

  const handleSubmit = async() => {
    await contract.methods.createCert(hash, sex, name, ic, dob, date, true).send({from: account[0]});
    setHash("");
    setName("");
    setSex("");
    setIc("");
    setDob("");
    setDate("");
    setVerified(true);
  }

  const hiddenFileInput = React.useRef(null);
  
  return(
    <>
    {loaded ? (
    <div className="container">
      
  <div style={{display:'flex', justifyContent:"space-between", alignItems:"center", marginBottom:"15px"}}>
  <h1>CERTIFICATE</h1> <button onClick={()=>{setClick(!click); setVerified(false);}} >{click ? "ISSUER":"USER"}</button>
  </div>

  <Form>
      <Segment placeholder>
    <Header icon>
      <Icon name='pdf file outline' />
      {!hash ? "No documents are listed" :"Files Uploaded"}
    </Header>
    <div className="flex_center">
        <button onClick={handleClick}>Add Document</button>
    </div>
    <input
        type="file"
        ref={hiddenFileInput}
        hidden
        onChange={(e)=>fileChange(e)}
    />
  </Segment>
      {verified ? (<button style={{marginBottom:"20px"}}>VERIFIED</button>):""}
      <Form.Field >
      <label>Name:</label>
      <input value={name} onChange={(e)=>setName(e.target.value)}/>
    </Form.Field>
    <Form.Field >
      <label>Sex:</label>
      <input value={sex} onChange={(e)=>setSex(e.target.value)}/>
    </Form.Field>
    <Form.Field >
      <label>NRIC:</label>
      <input value={ic} onChange={(e)=>setIc(e.target.value)}/>
    </Form.Field>
    <Form.Field >
      <label>Date of Birth:</label>
      <input value={dob} onChange={(e)=>setDob(e.target.value)}/>
    </Form.Field>
    <Form.Field >
      <label>Date Vaccinated:</label>
      <input value={date} onChange={(e)=>setDate(e.target.value)}/>
    </Form.Field>
 
    {click ? <button type='submit' onClick={()=>handleSubmit()}>Submit</button>:""}
    
  </Form>
  </div>
    ): (<h1>Connect your wallet</h1>)}
    </>
  )
  
}

