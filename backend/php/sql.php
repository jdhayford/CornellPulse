<?php

	$hostname="pulsardb.cdfrfpjssrqw.us-west-2.rds.amazonaws.com:3306";
	$database="cornellpulsedb";
	$username="awsuser";
	$password="cornellpulse";

	$link = mysql_connect($hostname, $username, $password);
	if (!$link) {
		die('Connection failed: ' . mysql_error().":");
	}

	$db_selected = mysql_select_db($database, $link);
	if (!$db_selected) {
	    die ('Can\'t select database: ' . mysql_error());
	}


	// Create SQL insertion string for dining array
	$sqlString = "DELETE FROM surgeDiners WHERE centerName = \"Statler Mac's\"";
	$data = mysql_query($sqlString);
	$sqlString = "DELETE FROM Diners WHERE centerName = \"Statler Mac's\"";
	$data = mysql_query($sqlString);
	if(! $data )
	{
		echo mysql_error();
	  die('Could not get data: ' . mysql_error());
	}
?>