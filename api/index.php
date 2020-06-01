<?php 

$type = $_GET['tp'];
if($type=='signup') signup(); 
elseif($type=='signdoc') signdoc();
elseif($type=='login') login();
elseif($type=='loginadmin') loginadmin(); 
elseif($type=='changestat') changestat(); 
elseif($type=='upload') upload();
elseif($type=='feedUpdate') feedUpdate(); 
elseif($type=='feedDelete') feedDelete(); 
elseif($type=='FileAccess') FileAccess();
elseif($type=='grantAccess') grantAccess();
elseif($type=='ApproveAccess') ApproveAccess();
elseif($type=='ApproveAccessPre') ApproveAccessPre();
elseif($type=='statusBack') statusBack();
elseif($type=='statusBackp') statusBackp();
elseif($type=='uploadpre') uploadpre();
elseif($type=='PreAccess') PreAccess();
function login() 
{ 
       require 'config.php'; 
       $json = json_decode(file_get_contents('php://input'), true); 
       $username = $json['username']; $password = $json['password']; 
       $userData =''; 
	   $query = "select * from logins where username='$username' and password='$password'"; 
       $result= $db->query($query);
       $rowCount=$result->num_rows;
             
        if($rowCount>0)
        {
            $userData = $result->fetch_object();
            $user_id=$userData->id;
            $userData = json_encode($userData);
            echo '{"userData":'.$userData.'}';

            
        }
        else 
        {
            echo '{"error":"Sorry you are not approved"}';
        }

    
}

function loginadmin() 
{ 
       require 'config.php'; 
       $json = json_decode(file_get_contents('php://input'), true); 
       $username = $json['username']; $password = $json['passworde']; 
       $userData =''; 
	   $query = "select * from admin where username='$username' and password='$password'"; 
       $result= $db->query($query);
       $rowCount=$result->num_rows;
             
        if($rowCount>0)
        {
            $userData = $result->fetch_object();
            $user_id=$userData->username;
            $userData = json_encode($userData);
            echo '{"userData":'.$userData.'}';

            
        }
        else 
        {
            echo '{"error":"Wrong username and password"}';
        }

    
}



function signup() {
    
        require 'config.php';

              
        $json = json_decode(file_get_contents('php://input'), true);
        $username = $json['username'];
        $password = $json['password'];
        $id = $json['id'];
		

        /*$username_check = preg_match("/^[A-Za-z0-9_]{4,10}$/i", $username);
        $email_check = preg_match('/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$/i', $email);
        $password_check = preg_match('/^[A-Za-z0-9!@#$%^&*()_]{4,20}$/i', $password);*/
       
        /*if($username_check==0) 
            echo '{"error":"Invalid username"}';
        elseif($email_check==0) 
            echo '{"error":"Invalid email"}';
        elseif($password_check ==0) 
            echo '{"error":"Invalid password"}';*/

        if (strlen(trim($username))>0 && strlen(trim($password))>0 && $id>0)
        {
           
	$sql = "insert into logins(id,username,password) values('$id','$username','$password')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Patient not added"}';
	}
	else
	{
		echo '{"success":"Patient added"}';
	}
	}
}

            /*$userData = '';
            
            $result = $db->query("select * from users where username='$username' or email='$email'");
            $rowCount=$result->num_rows;
            //echo '{"text": "'.$rowCount.'"}';
           
            if($rowCount==0)
            {
                                
                $db->query("INSERT INTO users(username,password,email,name)
                            VALUES('$username','$password','$email','$name')");
                $userData ='';
                $query = "select * from users where username='$username' and password='$password'";
                $result= $db->query($query);
                $userData = $result->fetch_object();
                $user_id=$userData->user_id;
                $userData = json_encode($userData);
                echo '{"userData":'.$userData.'}';
            } 
            else {
               echo '{"error":"username or email exists"}';
            }
        }
        else{
            echo '{"text":"Enter valid data2"}';
        }
   
}*/

function signdoc() {
    
        require 'config.php';

              
        $json = json_decode(file_get_contents('php://input'), true);
        $username = $json['username'];
        $password = $json['password'];
        $spec=$json['spec'];
        $name = $json['name'];
		$bloodgrp = $json['bloodgrp'];
		$address = $json['address'];
		$filehash = $json['filehash'];
		

        $username_check = preg_match("/^[A-Za-z0-9_]{4,10}$/i", $username);
        //$email_check = preg_match('/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$/i', $email);
        $password_check = preg_match('/^[A-Za-z0-9!@#$%^&*()_]{4,20}$/i', $password);
       
        if($username_check==0) 
            echo '{"error":"Invalid username"}';
       // elseif($email_check==0) 
           // echo '{"error":"Invalid email"}';
        elseif($password_check ==0) 
            echo '{"error":"Invalid password"}';

        elseif (strlen(trim($username))>0 && strlen(trim($password))>0 && $username_check>0 && $password_check>0)
        {
           

            $userData = '';
            
            $result = $db->query("select * from doctor where username='$username'");
            $rowCount=$result->num_rows;
            //echo '{"text": "'.$rowCount.'"}';
           
            if($rowCount==0)
            {
                                
                $db->query("INSERT INTO doctor(name,username,spec,password,address,bloodgrp,filehash)
                            VALUES('$name','$username','$spec','$password','$address','$bloodgrp','$filehash')");

                $userData ='';
                $query = "select * from doctor where username='$username' and password='$password'";
                $result= $db->query($query);
                $userData = $result->fetch_object();
                $userData = json_encode($userData);
                echo '{"userData":'.$userData.'}';
            } 
            else {
               echo '{"error":"username or email exists"}';
            }

        }
        else{
            echo '{"text":"Enter valid data"}';
        }
   
}

function changestat()
{
	require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['doct_id'];
	$username = $json['username'];
	$password = $json['pasword'];
	$feedData = '';
	if($doc_id>0 && (strlen($username))>0 && (strlen($password))>0)
	{
	$sql = "insert into logins(id,username,password) values('$doc_id','$username','$password')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Doctor not approved"}';
	}
	else
	{
		echo '{"success":"Doctor approved"}';
	}
	}
}

function upload()
{
	require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['doc_id'];
	$pat_id = $json['patid'];
	$filename = trim($json['filename']);
    $filehash = trim($json['filehash']);
    $dname=trim($json['dname']);
	if($doc_id>0 && $pat_id>0 && (strlen($filename))>0 && (strlen($filehash))>0)
	{
	$sql = "insert into files(doc_id,pat_id,name,filehash,status,dname) values('$doc_id','$pat_id','$filename','$filehash',0,'$dname')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Report not uploaded"}';
	}
	else
	{
		echo '{"success":"Report uploaded"}';
	}
	}
}
function uploadpre()
{
	require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['doc_id'];
	$pat_id = $json['patid'];
    $filename = trim($json['filename']);
    $datep=trim($json['datep']);
    $filehash = trim($json['filehash']);
    $dname=trim($json['dname']);
	if($pat_id>0)
	{
	$sql = "insert into prescription(doc_id,pat_id,name,filehash,datep,status,dname) values('$doc_id','$pat_id','$filename','$filehash','$datep',0,'$dname')";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Prescription not uploaded"}';
	}
	else
	{
		echo '{"success":"Prescription uploaded"}';
	}
	}
}
function FileAccess()
{

    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update files set status=1 where doc_id='$doc_id' and pat_id= '$pat_id'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Request not submitted"}';
	}
	else
	{
		echo '{"success":"Your file request has been sent to the patient"}';
	}
    }

}

function PreAccess()
{

    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update prescription set status=1 where doc_id='$doc_id' and pat_id= '$pat_id'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Request not submitted"}';
	}
	else
	{
		echo '{"success":"Your file request has been sent to the patient"}';
	}
    }

}

function grantAccess()
{ $userData = '';
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
    $pat_id = $json['pid'];
    if($pat_id>0)
    {
        $query = "select * from files"; 

            $result= $db->query($query);
                $userData = $result->fetch_object();
                $userData = json_encode($userData);
                echo '{"userData":'.$userData.'}';
       

    }

}


function ApproveAccess()
{
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update files set status=2 where pat_id= '$pat_id' and ind='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Doctor"}';
	}
    }
}

function ApproveAccessPre()
{
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
	$doc_id = $json['did'];
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($doc_id>0 && $pat_id>0)
    {
        $sql = "update prescription set status=2 where pat_id= '$pat_id' and indexp='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Hospital"}';
	}
    }
}

function statusBack()
{       
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($ind>0 && $pat_id>0)
    {
        $sql = "update files set status=0 where pat_id= '$pat_id' and ind='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Doctor"}';
	}
    }

}

function statusBackp()
{       
    require 'config.php';
	$json = json_decode(file_get_contents('php://input'), true);
    $pat_id = $json['pid'];
    $ind =$json['ind'];
    
    if($ind>=0 && $pat_id>0)
    {
        $sql = "update prescription set status=0 where pat_id= '$pat_id' and indexp='$ind'";
	$retval = mysqli_query($db,$sql);
	if(!$retval)
	{
		echo '{"error":"Access not granted"}';
	}
	else
	{
		echo '{"success":"Your Report Access has been given to the Doctor"}';
	}
    }

}


/*function details() {
    require 'config.php';
    try {
        $sql = "select * from doctor";
		$result = mysqli_query($db,$sql);
		echo '[';
		for ($i=0 ; $i<mysqli_num_rows($result) ; $i++) {
			echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
		}
		echo ']';
        
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    
}
    
   
}
function feedUpdate(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'), true);
    $user_id=$json['user_id'];
    $feed=$json['feed'];
    
    $feedData = '';
    if($user_id !=0)
    {
        $query = "INSERT INTO feed ( feed, user_id) VALUES ('$feed','$user_id')";
        $db->query($query);              
    }
    $query = "SELECT * FROM feed WHERE user_id=$user_id ORDER BY feed_id DESC LIMIT 10";
    $result = $db->query($query); 
    $feedData = mysqli_fetch_all($result,MYSQLI_ASSOC);
    $feedData=json_encode($feedData);
    
    echo '{"feedData":'.$feedData.'}';
}
function feedDelete(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'), true);
    $user_id=$json['user_id'];
    $feed_id=$json['feed_id'];
         
    $query = "Delete FROM feed WHERE user_id=$user_id AND feed_id=$feed_id";
    $result = $db->query($query);
    if($result)       
    {        
        echo '{"success":"Feed deleted"}';
    } else{
     
        echo '{"error":"Delete error"}';
    }
       
       
    
}*/

?>