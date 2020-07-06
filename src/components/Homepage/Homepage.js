import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Homepage.css';
import test from './test.png';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import about from './about.png'
import hod from './hod.png';
import mohan from './mohan.png';
import monica from './monica.png';
import pawan from './pawan.png';
import Faq from "react-faq-component";
const data = {
    title: "Frequently Asked Questions!",
    rows: [
        {
            title: "1. Lorem ipsum dolor sit amet,",
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed tempor sem. Aenean vel turpis feugiat, 
              ultricies metus at, consequat velit. Curabitur est nibh, varius in tellus nec, mattis pulvinar metus. 
              In maximus cursus lorem, nec laoreet velit eleifend vel. Ut aliquet mauris tortor, sed egestas libero interdum vitae. 
              Fusce sed commodo purus, at tempus turpis.`,
        },
        {
            title: "2. Nunc maximus, magna at ultricies elementum",
            content:
                "Nunc maximus, magna at ultricies elementum, risus turpis vulputate quam, vitae convallis ex tortor sed dolor.",
        },
        {
            title: "3. Curabitur laoreet, mauris vel blandit fringilla",
            content: `Curabitur laoreet, mauris vel blandit fringilla, leo elit rhoncus nunc, ac sagittis leo elit vel lorem. 
            Fusce tempor lacus ut libero posuere viverra. Nunc velit dolor, tincidunt at varius vel, laoreet vel quam. 
            Sed dolor urna, lobortis in arcu auctor, tincidunt mattis ante. Vivamus venenatis ultricies nibh in volutpat. 
            Cras eu metus quis leo vestibulum feugiat nec sagittis lacus.Mauris vulputate arcu sed massa euismod dignissim. `,
        },
        {
            title: "4. What is the package version",
            content: "v1.0.0",
        },
    ],
};
 
const styles = {
     bgColor: 'white',
    titleTextColor: "black",
    rowTitleColor: "blue",
    // rowContentColor: 'grey',
     arrowColor: "red",
};
 
const config = {
     animate: true,
    arrowIcon: "V",
};
 
class Homepage extends Component {

    constructor(props) {
    super(props);
    
    this.state = {
    data:[],
    userFeed: '',
    redirectToReferlog: false,
    name:'',
    };
    
    }
    
    
    render() {
    if (this.state.redirectToReferlog) {
    return (<Redirect to={'/login'}/>)
    }
   
    return (
        
    <div className="row" id="Body">
    <div className="medium-12 columns">
    
    <Tabs>
        <TabList>
            <Tab><FontAwesomeIcon icon={faHome} /> Home</Tab>
            <Tab><FontAwesomeIcon icon={faQuestionCircle} /> FAQs</Tab>
            <Tab><FontAwesomeIcon icon={faAddressBook} /> Contact Us</Tab>
        </TabList>
        <TabPanel>
        <img class="about"src= {about} alt="pic" />
        <button class= "loginbutton" onClick={ (event)=> {
        this.setState({redirectToReferlog : true});
             }
         }><FontAwesomeIcon icon={faSignInAlt} /> LOGIN</button>
        </TabPanel>
        <TabPanel>
        <div>
        <Faq data={data} styles={styles} config={config} />
            </div>
        </TabPanel>
        <TabPanel>
        <h3 class="textstyle">About Us</h3>
        <h5>We are a group of enthusiastic budding engineers from Nitte Meenakshi Institute of Technology, Bangalore.
            Being motivated to contribute to the humankind, we developed this website in healthcare domain. We strive to
            help and support you.
        </h5>
        <center>
        <div>
            <br/>
            <br/>
        <img class="testimage1"src= {hod} alt="pic" />
        <br/>
         <h5>Dr. Thippeswamy M. N.<br/> HOD, Department of CSE, NMIT</h5>
         <br/>
         <br/>
        </div>
        </center>
        <div class="contactus">
            <div>
                <center>
                <img class="testimage"src= {mohan} alt="pic" />
                    <br/> 
                    <br/> 
                    <h4 class="contact">Mohan Sai Kiran</h4>
                    <h6>kiranms20@gmail.com</h6>
                </center>
            </div>
            <div>
                <center>
                <img class="testimage"src= {pawan} alt="pic" />
                    <br/> 
                    <br/> 
                    <h4 class="contact1">Pawan R. Tanksali</h4>
                    <h6>pawantanksali@gmail.com</h6>
                </center>    
            </div>
            <div>
                <center>
                <img class="testimage"src= {monica} alt="pic" />
                     <br/> 
                    <br/> 
                    <h4 class="contact">Monica Hegde</h4>
                    <h6>monicarhegde@gmail.com</h6>
                </center>	
            </div>
            <div>
                <center>
                <img class="testimage"src= {test} alt="pic" />
                    <br/> 
                    <br/> 
                    <h4 class="contact1">Pooja Rani Naik</h4>
                    <h6>ranip2780@gmail.com</h6>
                </center>		
            </div>

        </div>
					
					
                    
                    
                    
                    
                    
                    
				
        </TabPanel>
    </Tabs>

    </div>
    
    
    </div>
    );
    }
    }
    
    export default Homepage;