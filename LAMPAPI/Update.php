<?php
    
    $inData = getRequestInfo();
    
    $contactId = $inData["contactId"];
    $newFirstName = $inData["newFirstName"];
    $newLastName = $inData["newLastName"];
    $newPhoneNumber = $inData["newPhoneNumber"];
    $newEmail = $inData["newEmail"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName=?, Phone= ?, Email= ? WHERE ID= ?");
		$stmt->bind_param("ssssi", $newFirstName, $newLastName, $newPhoneNumber, $newEmail, $contactId);
		$stmt->execute();

		$stmt->close();
		$conn->close();
		returnWithInfo( $newFirstName, $newLastName,$newEmail, $newPhoneNumber, $contactId );
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $newFirstName, $newLastName,$newEmail, $newPhoneNumber, $contactId )
	{
		$retValue = '{"id":' . $contactId . ',"newFirstName":"' . $newFirstName . '","newLastName":"' . $newLastName  . '","newEmail":"' . $newEmail . '","newPhoneNumber":"' . $newPhoneNumber . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>