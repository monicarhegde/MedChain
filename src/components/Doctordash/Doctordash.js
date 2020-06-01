import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Doctordash.css'
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
const ipfsClient = require('ipfs-http-client')
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
  const doctorCount = await marketplace.methods.docCount().call()
this.setState({doctorCount})
let docdataacc = JSON.parse(sessionStorage.getItem('userData'));

  for (var i = 1; i <= doctorCount; i++) {
const doctor = await marketplace.methods.doctors(i).call()
if(doctor.id==docdataacc.id)
{ 
  console.log(doctor)
  
    this.setState({
      doctors: [...this.state.doctors, doctor],
      dname: doctor.name,
      did: doctor.id,
    })
      
       
    
  }
}
window.pid=new Array();
const appCount=await marketplace.methods.AppCount().call()
this.setState({appCount})
for(var i=0;i<=appCount;i++) {
  const app=await marketplace.methods.apps(i).call()
  console.log(parseInt(app.docid))
  if(app.docid==docdataacc.id)
  { window.pid[i]=app.patid;
    console.log(app)
  this.setState({
    appointments: [...this.state.appointments, app],
  })
}
}




const patCount= await marketplace.methods.patCount().call()
this.setState({patCount})
//const patdata = JSON.parse(sessionStorage.getItem('userData'));

for (var i = 1000; i <= patCount; i++) {
  const patient = await marketplace.methods.patients(i).call()
  const pat=parseInt(patient.id)
  //console.log(parseInt(patient[0]))
  //console.log(pat)
  //console.log(patdata.id)
  for(var j=1;j<appCount;j++)
  {
    if(pat==window.pid[j])
  {
    console.log(patient)
      this.setState({
        patients: [...this.state.patients, patient],
      })
    }
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
patid: 0,
filename: '',
filehash: '',
contacts:[],
doc_id: 0,
added_file_hash: null,
redirectToReferrere: false,
doctors:[],
appointments:[],
patients:[],
dname: '',
did: 0,
redirect: false,
presci:[],
redirectprescribe: false,
};
this.data = {};
this.ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
this.captureFile = this.captureFile.bind(this);
this.saveToIpfs = this.saveToIpfs.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);
this.logout = this.logout.bind(this);
this.onChange = this.onChange.bind(this);
this.upload = this.upload.bind(this);
this.FileAccess=this.FileAccess.bind(this);
this.grantAccess=this.grantAccess.bind(this);
this.onCha=this.onCha.bind(this);
this.uploadpre=this.uploadpre.bind(this);
this.uploadPrescription=this.uploadPrescription.bind(this);

}

componentDidMount() {
  let data = JSON.parse(sessionStorage.getItem('userData'));


   window.setTimeout(this.grantAccess,2000);
}
grantAccess() {
  const url = 'http://localhost:85/react-php/api/fileupdate.php'
  axios.get(url).then(response => response.data)
  .then((data) => {
    this.setState({ contacts: data })
    console.log(this.state.contacts)
    this.state.contacts.map((cont)=>{

      if(cont.doc_id==this.state.did)

      { window.flag=1;     
      }
      
      
     })
     if(window.flag==1)
     {
      alert("Your file request has been approved.\n Please check your Dashboard")
      window.flag=0;
     }
   })
   
  }

captureFile(event) {
  event.stopPropagation()
  event.preventDefault()
  if (document.getElementById('keepFilename').checked) {
    this.saveToIpfsWithFilename(event.target.files)
  } else {
    this.saveToIpfs(event.target.files)
  }
}
async saveToIpfs (files) {
  const source = this.ipfs.add(
    [...files],
    {
      progress: (prog) => console.log(`received: ${prog}`)
    }
  )
  try {
    for await (const file of source) {
      console.log(file)
      this.setState({ added_file_hash: file.path })
    }
  } catch (err) {
    console.error(err)
  }
}
async saveToIpfsWithFilename (files) {
  const file = [...files][0]
  const fileDetails = {
    path: file.name,
    content: file
  }
  const options = {
    wrapWithDirectory: true,
    progress: (prog) => console.log(`received: ${prog}`)
  }

  const source = this.ipfs.add(fileDetails, options)
  try {
    for await (const file of source) {
      console.log(file)
      this.setState({ added_file_hash: file.cid.toString() })
    }
  } catch (err) {
    console.error(err)
  }
}
handleSubmit (event) {
  event.preventDefault()
}

uploadFiles(patid,doc_id,dname,filename,filehash)
{
  this.state.marketplace.methods.UploadReports(patid,doc_id,dname,filename,filehash).send({from : this.state.account})
	.once('receipt', (receipt) => {
	  //this.setState({ loading: false })
	})
}
uploadPrescription(patid,doc_id,dname,filename,presci,filehash)
{
  this.state.marketplace.methods.uploadPrescription(patid,doc_id,dname,filename,presci,filehash).send({from : this.state.account})
	.once('receipt', (receipt) => {
	  //this.setState({ loading: false })
	})
}
upload() {
  this.uploadFiles(this.state.patid,this.state.doc_id,this.state.dname,this.state.filename,this.state.filehash);
console.log(this.state)
let data={
  patid: this.state.patid,
  doc_id: this.state.doc_id,
  filename: this.state.filename,
  filehash: this.state.filehash,
  dname: this.state.dname,
}
if(this.state.patid && this.state.filename && this.state.filehash){
PostData('upload',data).then((result) => {
if(result.success)
{
alert(result.success);
}
else
alert(result.error);
this.setState({redirectToReferrere: true});
}
);
}
else
alert("Please enter all the fields");
document.getElementById("myform").reset();
}


ApproveAppointment(patadd,docadd)
      {
        this.state.marketplace.methods.ApproveAppointment(patadd,docadd).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          //this.setState({ loading: false })
        })
        console.log("Appointment Approved")
        alert("Appointment Confirmed")
      
      }

FileAccess(patid,docid) {
 let data1 = {
   did: docid,
   pid: patid,

 }
 console.log(data1)
 
 if(this.state.patid && this.state.doc_id){
  PostData('FileAccess',data1).then((result) => {
  if(result.success)
  {
  alert(result.success);
  }
  else
  alert(result.error);
  }
  );
  }
  //else
  //alert("Patient or Doctor ID not available");
}

onChange(e){
  this.setState({[e.target.name]:e.target.value});
  }
  logout(){
    if(this.state.redirectToReferrere)
    {
    return (<Redirect to={'/login'}/>)
    }
    }
onCha(e) {
  this.setState({[e.target.name]:e.target.value});
}
uploadpre() {
  this.uploadPrescription(this.state.patid,this.state.doc_id,this.state.dname,this.state.filename,this.state.presci,this.state.filehash);
console.log(this.state)
let data={
  patid: this.state.patid,
  doc_id: this.state.doc_id,
  filename: this.state.filename,
  filehash: this.state.filehash,
  datep: this.state.presci,
  dname: this.state.dname,
}
if(this.state.patid){
PostData('uploadpre',data).then((result) => {
if(result.success)
{
alert(result.success);
}
else
alert(result.error);
this.setState({redirectprecribe: true});
}
);
}
else
alert("Please enter all the fields");
document.getElementById("myform").reset();
}
render() {

  //let docdata = JSON.parse(sessionStorage.getItem('userData'));
  this.data = JSON.parse(sessionStorage.getItem('userData'));
  this.state.doc_id = this.data.id;
if (this.state.redirectToReferrer) {
return (<Redirect to={'/login'}/>)
}
if (this.state.redirect) {
  return (<Redirect to={'/viewreports'}/>)
  }
return (
<div className="row" id="Body">
<div className="medium-12 columns">
<h1 class="welcome"> Welcome Dr.{this.state.doctors.map((doctor)=>
{
return (doctor.name)
})} </h1>
<a href="/login" onClick={this.logout} className="logout">Logout</a>            
<Tabs>
    <TabList>
      <Tab>View details</Tab>
	  <Tab>Patients</Tab>
	  <Tab>Patient approval</Tab>
	  <Tab>Upload reports</Tab>
    <Tab>Upload Prescription</Tab>
    </TabList>
 
    <TabPanel>
      <h2>Account Details</h2>
      
      <h4>{ this.state.doctors.map((doctor)=> { 
                  return(
                    <div>
                      <table>
                        <tr>
                          <th class="head">DOCTOR ID: </th>
                          <td class="data">{this.data.id}</td>
                        </tr>
                        <tr>
                          <th class="head">DOCTOR NAME: </th>
                          <td class="data">{doctor.name}</td>
                        </tr>
                        <tr>
                          <th class="head">ACCOUNT ADDRESS: </th>
                          <td class="data">{doctor.docacc}</td>
                        </tr>
                        <tr>
                          <th class="head">SPECIALIZATION: </th>
                          <td class="data">{doctor.spec}</td>
                        </tr>
                        <tr>
                          <th class="head">BLOOD GROUP: </th>
                          <td class="data">{doctor.blood}</td>
                        </tr>
                        <tr>
                          <th class="head">ADDRESS: </th>
                          <td class="data">{doctor.addr}</td>
                        </tr>
                        <tr>
                          <th class="head">DOCUMENT: </th>
                          <td class="data"><a target='_blank'
                   href={'https://ipfs.io/ipfs/' + doctor.filehash}>{ doctor.filehash }</a></td>
                        </tr>
                      </table>
                  
                  </div>

)
})
}</h4>
     
      <button class="privatekey" onClick= {(event)=>{
          var val=prompt("Please enter your password")
          if(val==this.data.password)
          { this.state.doctors.map((doctor,key)=> { 
            var str="PLEASE COPY YOUR PRIVATE KEY AND IMPORT IN METAMASK        "
            window.confirm(str+doctor.pri)
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
      <h2>Patients</h2>
      <table>
        <tr>
          <th class="tabh">Patient ID</th>
          <th class="tabh">Patient Name</th>
          <th class="tabh">Blood Group</th>
          <th class="tabh">Address</th>
          <th class="tabh">Patient Report</th>
        </tr>
      </table>
      {
        this.state.appointments.map((app)=> {
          return(
            <div>
              <table>
                <tr>
                  <td  class="tabhx">{parseInt(app.patid)}</td>
                  <td  class="tab">{app.patname}</td>
                  <td  class="tabx">{app.blood}</td>
                  <td  class="tabx">{app.addr}</td>
                  <td>
                  <button class="appointment" 
                       onClick= { (event)=> {
                        let data1 = {
                          did: parseInt(app.docid),
                          pid: parseInt(app.patid),
                       
                        }
                        console.log(data1)
                        
                        if(app.docid && app.patid){
                         PostData('FileAccess',data1).then((result) => {
                         if(result.success)
                         {
                         alert(result.success);
                         }
                         else
                         alert(result.error);
                         }
                         );
                         }
                       }}>Request Access</button>
         
                  </td>
                  <td>
                    {
                      this.state.contacts.map((contacts)=>{
                        if(contacts.status==2 && contacts.pat_id==app.patid)
                        {
                      
                        return(
                          <div class="contain">
                            
                          
                          <button class="appointment"
                          onClick={(event)=>

                          { 
                            
                            let obj= {
                              patid: contacts.pat_id,
                              docname: contacts.dname,
                              file: contacts.name,
                              filehash: contacts.filehash,
                              ind: contacts.ind,
                            }
                            sessionStorage.setItem('filedata',JSON.stringify(obj));
                            
                            this.setState({redirect: true})
                          
                          }}
                          
                          
                          >View Reports</button>
                          <p class="stylep">{contacts.name}</p>
                          </div>
                        )
                        }
                      })
                    }
                  </td>
                </tr>
              </table>
            </div>
          )
        })
        }

      
    </TabPanel>
	<TabPanel>
      <h2>Approval</h2>
      <table>
        <tr>
          <th class="tabh">Patient ID</th>
          <th class="tabh">Patient Name</th>
          <th class="tabh">Blood Group</th>
          <th class="tabh">Address</th>
        </tr>
      </table>
    
        {
          this.state.appointments.map((app)=> {

            
            return(
              <div>
                <table>
                  <tr>
                    <td  class="tab1">{parseInt(app.patid)}</td>
                    <td  class="tab">{app.patname}</td>
                    <td  class="tab2">{app.blood}</td>
                    <td  class="tab2">{app.addr}</td>
                    <td>
                    <button class="appointment"
                         onClick=
                           {
                          (event)=>{
                          const val1=app.patadd;
                          const val2=app.docadd;
                          this.ApproveAppointment(val1,val2);
                          console.log(app)
          }
        }>Approve Appointment
           </button>
                    </td>
                  </tr>
                </table>
              </div>
            )
          })

        }
          
    </TabPanel>
	<TabPanel>
      <h2>Upload Report</h2>
      <div className="row " id="sBody">
	  <div className="medium-5 columns left">
	  <form id="myform">
	  <input type="number" name="patid" placeholder="Patient ID" onChange={this.onChange}/>
	  <input type="text" name="filename" placeholder="File name" onChange={this.onChange}/>
	  <form id='captureMedia' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile} /><br/>
          <label htmlFor='keepFilename'><input type='checkbox' id='keepFilename' name='keepFilename' /> keep filename</label>
	  </form>
	  <div>
		<label>Hash(Note: Please copy the hash that will be generated after choosing file into the input box below)</label><a target='_blank'
			href={'https://ipfs.io/ipfs/' + this.state.added_file_hash}>
				{this.state.added_file_hash}</a>
	  </div>
	  <input type="text" name="filehash" placeholder="File Hash" onChange={this.onChange}/>
	  <input type="button" className="button" value="Upload" onClick={this.upload}/>
	  </form>
	  </div>
	  </div>

    </TabPanel>
    <TabPanel>
    <h2>Upload Prescription</h2>
      <div className="row " id="sBody">
	  <div className="medium-5 columns left">
	  <form id="myform">
	  <input type="number" name="patid" placeholder="Patient ID" onChange={this.onCha}/>
	  <input type="text" name="filename" placeholder="Presciption name" onChange={this.onCha}/>
    <input type="date" name="presci" onChange={this.onCha}/>
	  <form id='captureMedia' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile} /><br/>
          <label htmlFor='keepFilename'><input type='checkbox' id='keepFilename' name='keepFilename' /> keep filename</label>
	  </form>
	  <div>
		<label>Hash(Note: Please copy the hash that will be generated after choosing file into the input box below)</label><a target='_blank'
			href={'https://ipfs.io/ipfs/' + this.state.added_file_hash}>
				{this.state.added_file_hash}</a>
	  </div>
	  <input type="text" name="filehash" placeholder="File Hash" onChange={this.onCha}/>
	  <input type="button" className="button" value="Upload" onClick={this.uploadpre}/>
	  </form>
	  </div>
	  </div>
    </TabPanel>
  </Tabs>
</div>
</div>
);

}

}

export default Doctordash;