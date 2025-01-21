<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {   
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE login = ?");
        $stmt->bind_param("s", $login);
	$stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows > 0)
        {
            returnWithError("Login name already taken");
        }
        else{
            $stmt = $conn->prepare("INSERT into Users (firstName, lastName, login, password) VALUES(?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
            $stmt->close();
            returnWithError("");  
        }
        $conn->close();
    }
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
