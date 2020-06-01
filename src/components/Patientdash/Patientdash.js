import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Patientdash.css'
import {PostData} from '../../services/PostData';
import UserFeed from "../UserFeed/UserFeed";
import { confirmAlert } from 'react-confirm-alert';
import '../../styles/react-confirm-alert.css';
import axios from 'axios';
import Linkify from 'react-linkify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Login from '../../components/Login/Login';
import Web3 from 'web3';
import Marketplace from '../../abis/Marketplace.json';

class Doctordash extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    var acc = web3.eth.accounts[0];
    console.log(acc)
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    //const networkData1 = DocReg.networks[networkId]
    if(networkData) {
  const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
  this.setState({ marketplace })
const patCount= await marketplace.methods.patCount().call()
this.setState({patCount})
const patdata = JSON.parse(sessionStorage.getItem('userData'));

for (var i = 1000; i <= patCount; i++) {
  const patient = await marketplace.methods.patients(i).call()
  const pat=parseInt(patient.id)
  //console.log(parseInt(patient[0]))
  console.log(pat)
  console.log(patdata.id)
  if(pat==patdata.id)
  {
    console.log(patient)
      this.setState({
        patients: [...this.state.patients, patient],
        pid: patient.id,
      })
    }
  }

//for listing doctors and appointments
  const doctorCount = await marketplace.methods.docCount().call()
this.setState({doctorCount})
let pdata = JSON.parse(sessionStorage.getItem('userData'));

  for (var i = 1; i <= doctorCount; i++) {
const doctor = await marketplace.methods.doctors(i).call()
{ 
    this.setState({
      doctors: [...this.state.doctors, doctor],
       
    })
  }
}

const repCount=await marketplace.methods.repCount().call()
this.setState({repCount})
for(var i=0;i<=repCount;i++)
{    
    const rep= await marketplace.methods.reports(i).call()
    if(pdata.id==rep.patid)
    {console.log(rep)
    this.setState({
      reports: [...this.state.reports,rep]
    })
  }
}


}
else{
  window.alert('Marketplace contract not deployed to detected network.')
}
}
constructor(props) {
super(props);

this.state = {
contacts:[],
patients:[],
patCount:0 ,
doctors:[],
reports:[],
pid: 0,
redirectToReferrerz: false,
};

this.logout = this.logout.bind(this);
this.grantAccess=this.grantAccess.bind(this);
}

componentDidMount() {
  let data = JSON.parse(sessionStorage.getItem('userData'));


   window.setTimeout(this.grantAccess,2000);
}
grantAccess() {
  const url = 'http://localhost:85/react-php/api/files.php'
  axios.get(url).then(response => response.data)
  .then((data) => {
    this.setState({ contacts: data })
    console.log(data)
    console.log(this.state.contacts)
    this.state.contacts.map((cont)=>{
      console.log(cont)
      if(cont.pat_id==this.state.pid)
      {
        window.tag=1;
      }
      
      
     })
     if(window.tag==1)
     {
      alert("You have Pending File Requests.\n Please check your Dashboard")
      window.tag=0;
     }
     
   })
   

/*
  let data = JSON.parse(sessionStorage.getItem('userData'));
  console.log(data.id)
  let grant ={
    pid: data.id,
  }
  if(data.id){
    PostData('grantAccess',grant).then((result) => {
      let responseJson = result;
if(responseJson.userData){
let jsondata = JSON.stringify(responseJson.userData);
console.log(jsondata)
sessionStorage.setItem('fileData',jsondata);
let filedata = JSON.parse(sessionStorage.getItem('fileData'));
//console.log(filedata)
}

   
    }
    );
    }*/


}
bookAppointment(id1,id2) {
        
  //this.setState({ loading: true })
  this.state.marketplace.methods.bookAppointments(id1,id2).send({ from: this.state.account })
  .once('receipt', (receipt) => {
    //this.setState({ loading: false })
  })
  console.log("Appointment booked")
  
}

logout(){
  this.setState({redirectToReferrerz: true})
  if(this.state.redirectToReferrerz)
  {
  return (<Redirect to={'/login'}/>)
  }
  }

render() {
  let docdata = JSON.parse(sessionStorage.getItem('userData'));
if (this.state.redirectToReferrerz) {
return (<Redirect to={'/login'}/>)
}
return (
<div className="row" id="Body">
<div className="medium-12 columns">
<h1 class="welcome"> Welcome {
  this.state.patients.map((patient)=> {
    return(patient.name)
  })
}</h1>
<a href="#" onClick={this.logout} className="logout">Logout</a>

<Tabs>
    <TabList>
      <Tab>View details</Tab>
	  <Tab>Get Appointment</Tab>
	  <Tab>View Reports</Tab>
	  <Tab>Grant Access</Tab>
    </TabList>
    
     
    <TabPanel>
      <h2>Account Details</h2>
      { 
        this.state.patients.map((patient)=> {
          return(
            <div>
              <table>
                <tr>
                  <th class="head">PATIENT ID :</th>
                  <td class="data">{docdata.id}</td>
                </tr>
                <tr>
                  <th class="head">NAME :</th>
                  <td class="data">{patient.name}</td>
                </tr>
                <tr>
                  <th class="head">ACCOUNT ADDRESS :</th>
                  <td class="data">{patient.patacc}</td>
                </tr>
                <tr>
                  <th class="head">EMAIL :</th>
                  <td class="data">{patient.email}</td>
                </tr>
                <tr>
                  <th class="head">BLOOD GROUP :</th>
                  <td class="data">{patient.blood}</td>
                </tr>
                <tr>
                  <th class="head">ADDRESS :</th>
                  <td class="data">{patient.addr}</td>
                </tr>
              </table>
           
           
           </div>
            
          )
        })
      }
      <button class="privatekey" onClick= {(event)=>{
          var val=prompt("Please enter your password")
          if(val==docdata.password)
          { this.state.patients.map((patient,key)=> { 
            var str="PLEASE COPY YOUR PRIVATE KEY AND IMPORT IN METAMASK        "
            window.confirm(str+patient.pri)
          })
            
          }
          else{
            alert("Please enter correct password")
          }
      }
    }> Get Private Key

      </button>
    </TabPanel>
	<TabPanel>
      <h2>Get Appointment</h2>
      <table>
              <tr>
                <th class="docid">DOCTOR ID</th>
                <th class="appname">NAME</th>
                <th class="appclass">SPECIALIZATION</th>
                <th class="appclass">BLOOD GROUP</th>
                <th class="appclass">ADDRESS</th>
              </tr>
       </table>
      {
        this.state.doctors.map((doctor)=> {
          return (
            <table class="tablestyle">
              <tr>
                <td class="idata">{parseInt(doctor.id._hex)}</td>
                <td class="appoint">{doctor.name}</td>
                <td class="appoint">{doctor.spec}</td>
                <td class="iddata">{doctor.blood}</td>
                <td class="iddata">{doctor.addr}</td>
                <td>
                <button class="appointment"
                    onClick=
                      {
                       (event)=>{
                          const val1=docdata.id;
                          const val2=doctor.id;
                          this.bookAppointment(val1,val2);
          }
        }>Book Appointment
           </button>
                </td>
              </tr>
            </table>
          )
        })
      }


    </TabPanel>
	<TabPanel>
      <h2>View Reports</h2>
      <table>
        <tr>
          <th class="tabreport">DOCTOR ID</th>
          <th class="tabreport">DOCTOR NAME</th>
          <th class="tabreport">REPORT NAME</th>
          <th class="repclass">REPORT</th>
        </tr>
      </table>
      {
        this.state.reports.map((rep)=> {
          return(
            <div>
              <table>
              <tr>
                <td class="idata">{parseInt(rep.docid)}</td>
                <td class="tabdata">{rep.docname}</td>
                <td class="tabdata">{rep.repname}</td>
                <td class="tabdata"><a target='_blank'
                   href={'https://ipfs.io/ipfs/' + rep.hash}>{ rep.hash }</a></td>
              </tr>
              </table>
            </div>
          )
        })
      }
    </TabPanel>
	<TabPanel>
      <h2>Grant Access</h2>
      <table>
        <tr>
          <th class="access2">DOCTOR ID</th>
          <th class="access">DOCTOR NAME</th>
          <th class="access">REPORT NAME</th>
          <th class="access">FILE HASH</th>
        </tr>
      </table>
{
  this.state.contacts.map((contacts)=> {
      if(this.state.pid==contacts.pat_id && contacts.ind)
      {
        return(
          <div>
            <p>Report Requests</p>
            <table>
              <tr>
                <td class="accessd1">{contacts.doc_id}</td>
                <td class="accessd">{contacts.dname}</td>
                <td class="accessd">{contacts.name}</td>
                <td class="accessd"><a target='_blank'
                   href={'https://ipfs.io/ipfs/' + contacts.filehash}>{ contacts.filehash }</a></td>
                <button class="appointment" onClick={(event)=>
                {
                  let data1 = {
                    did: contacts.doc_id,
                    pid: contacts.pat_id,
                    ind: contacts.ind,
                  }

                  console.log(data1)
                  
                  if(contacts.doc_id && contacts.pat_id){
                   PostData('ApproveAccess',data1).then((result) => {
                   if(result.success)
                   {
                   alert(result.success);
                   }
                   else
                   alert(result.error);
                   }
                   );
                   }
                }}>Grant Access

                </button>
                
              </tr>
            </table>
          </div>
        )
      }
      else if(this.state.pid==contacts.pat_id && contacts.indexp)
      {
        return(
          <div>
            <p>Prescription Requests</p>
            <table>
              <tr>
                <td class="accessd1">{contacts.doc_id}</td>
                <td class="accessd">{contacts.dname}</td>
                <td class="accessd">{contacts.name}</td>
                <td class="accessd"><a target='_blank'
                   href={'https://ipfs.io/ipfs/' + contacts.filehash}>{ contacts.filehash }</a></td>
                <button class="appointment" onClick={(event)=>
                {
                  let data1 = {
                    did: contacts.doc_id,
                    pid: contacts.pat_id,
                    ind: contacts.indexp,
                  }

                  console.log(data1)
                  
                  if(contacts.doc_id && contacts.pat_id){
                   PostData('ApproveAccessPre',data1).then((result) => {
                   if(result.success)
                   {
                   alert(result.success);
                   }
                   else
                   alert(result.error);
                   }
                   );
                   }
                }}>Grant Access

                </button>
                
              </tr>
            </table>
          </div>
        )
      }
  })}
    </TabPanel>
  </Tabs>
</div>
</div>
);
}
}

export default Doctordash;