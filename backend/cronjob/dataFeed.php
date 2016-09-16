<?php
// This script pulls data from the Cornell API's on
//  real- time congestion for fitness centers and
//	dining units, and submits it into the database.


function gymReference() {
		// Create main reference array, for each fitness center there is
		// a corresponding max arbitrary reference as well as a count field
		// where the resulting count will be stored
		$centers = array (
			"Newman" => 0,
			"Noyes" => 0,
			"Teagle Up" => 0,
			"Teagle Down" => 0,
			"Appel" => 0
			);

		return $centers;
	}

// Create main reference array, for each possible dining unit
function diningReference() {
	$units = array (
		"Alice Cook House" => 0,
		"Bear Necessities" => 0,
		"Big Red Barn" => 0,
		"Bus Stop Bagels" => 0,
		"Cafe Jennie" => 0,
		"Carl Becker House" => 0,
		"Carols Cafe" => 0,
		"Duffield" => 0,
		'Goldie\'s' => 0,
		"Green Dragon" => 0,
		"Ivy Room" => 0,
		"Jansens at Bethe House" => 0,
		'Jansen\'s Market' => 0,
		"Keeton House" => 0,
		"Kosher" => 0,
		"Marthas" => 0,
		'Statler Macs' => 0,
		"North Star Marketplace" => 0,
		"Okenshields" => 0,
		"Olin Libe Cafe" => 0,
		"Risley" => 0,
		"Rose House" => 0,
		"RPME" => 0,
		"Rustys" => 0,
		"Sage" => 0,
		"Sweet Sensation" => 0,
		"Synapsis Cafe" => 0,
		"Trillium" => 0,
		"Statler Terrace" => 0

		);
	return $units;
}

// This function takes a link of the REST API instance,
// pulls its response and returns an associative array
// of format "Location Name" -> Location Count
function extractData($link) {
	$token = file_get_contents('token.txt');

	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => $link,
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Bearer ".$token,
	    "cache-control: no-cache",
	    "content-type: application/json",
	    "postman-token: d99b22f7-8c8d-f765-62e6-9049d19ca55f"
	  ),
	));	
	// Execute curl to extract information from REST API
	$return = curl_exec($curl);
	echo($return);
	curl_close($curl);

	// Parse individual data instances from the curl response string
	$data = preg_match_all('/\{.*?\}/',stripslashes($return),$centers);
	$allCenters = array();
	// Loop through each instance of data
	foreach ($centers[0] as $center) {
		// Seperate the location name and count information
		$center = explode(",",$center);
		// Extract the count from the string
		preg_match_all('/\d+/',$center[0],$match);
		$count = $match[0][0];
		// Extract location name from the string
		preg_match_all('/[a-zA-Z ]+/',$center[1],$match);
		$location = $match[0][1];
		if ($location == "Goldie") {$location = "Goldie's";}
		if ($location == "Jansen") {$location = "Jansen's Market";}
		// Add to associative array with location name as key
		// and center count as the values
		$allCenters[$location]= $count*1;
	}
	return $allCenters;
}

// Takes count result and transfers it to premade array,
// for naming consistency
function organizeFitness($rawGyms){
	$gyms = gymReference();
	// Transfer the count information to premade gym array
	foreach ($gyms as $gym => $initial){
		foreach ($rawGyms as $center => $count){
			if (strpos($center,$gym) !== false) {
				$gyms[$gym] = $count;
			}
		}
	}
	return $gyms;
}

// Takes count result and transfers it to premade array,
// for naming consistency
function organizeDining($rawDining) {
	$dining = diningReference();
	// Transfer the count information to premade dining array
	foreach ($dining as $diner => $initial){
		foreach ($rawDining as $unit => $count){
			if (strpos($unit,$diner) !== false) {
				$dining[$diner] = $count;
			}

		}
	}
	return $dining;
}

// This function makes mySql call to database and returns
	function sql_insertData($diningData,$fitnessData,$diningSurge) {
	    //ENTER YOUR DATABASE CONNECTION INFO BELOW:
		$hostname="pulsardb.cdfrfpjssrqw.us-west-2.rds.amazonaws.com:3306";
		$database="cornellpulsedb";
		$username="awsuser";
		$password="cornellpulse";


		//DO NOT EDIT BELOW THIS LINE
		// Get current time and date
		date_default_timezone_set('America/New_York');
		$datetime = date("Y-m-d G:i:s");

		$link = mysql_connect($hostname, $username, $password);
		if (!$link) {
			die('Connection failed: ' . mysql_error().":");
		}

		$db_selected = mysql_select_db($database, $link);
		if (!$db_selected) {
		    die ('Can\'t select database: ' . mysql_error());
		}


		// Create SQL insertion string for dining array
		$sqlString = "INSERT INTO Diners (datetime,centerName,count) VALUES ";
		$valueString = "";
		// Iterate through array formatting values to the string
		foreach ($diningData as $unit => $count) {
			$unit = str_replace("'","''",$unit);
			$valueString .= "('".$datetime."','".$unit."',".$count.")\n,";
		}
		$sqlString .= trim($valueString,",").";";
		// Execute SQL insertion
		print($sqlString);
		$data = mysql_query($sqlString);
		if(! $data )
		{
			echo mysql_error();
		  die('Could not get data: ' . mysql_error());
		}


		// Create SQL insertion string for dining surge array
		$sqlString = "INSERT INTO surgeDiners (datetime,centerName,count) VALUES ";
		$valueString = "";
		// Iterate through array formatting values to the string
		foreach ($diningSurge as $unit => $count) {
			$unit = str_replace("'","''",$unit);
			$valueString .= "('".$datetime."','".$unit."',".$count.")\n,";
		}
		$sqlString .= trim($valueString,",").";";
		// Execute SQL insertion
		print($sqlString);
		$data = mysql_query($sqlString);
		if(! $data )
		{
			echo mysql_error();
		  die('Could not get data: ' . mysql_error());
		}


		// Create SQL insertion string for fitness array
		$sqlString = "INSERT INTO Gyms (datetime,centerName,count) VALUES ";
		$valueString = "";
		// Iterate through array formatting values to the string
		foreach ($fitnessData as $center => $count) {
			$center = str_replace("'","''",$center);
			$valueString .= "('".$datetime."','".$center."',".$count.")\n,";
		}
		$sqlString .= trim($valueString,",").";";
		// Execute SQL insertion
		$data = mysql_query($sqlString);
		if(! $data )
		{
			echo mysql_error();
		  die('Could not get data: ' . mysql_error());
		}
		mysql_close($link);
	}



try {
	$diningUnits = organizeDining(extractData("https://api.ssit.scl.cornell.edu/activity/dining/25"));
	$diningSurge = organizeDining(extractData("https://api.ssit.scl.cornell.edu/activity/dining"));
	$gymCenters = organizeFitness(extractData("https://api.ssit.scl.cornell.edu/activity/fitness/50"));

	sql_insertData($diningUnits,$gymCenters,$diningSurge);
} catch (Exception $e) {
	print($e);
}

?>
