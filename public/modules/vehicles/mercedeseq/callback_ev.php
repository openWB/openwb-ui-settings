<?php
//Callback procedure for mercedes SoC API EV
if( $_GET["code"] ) {
	$state= escapeshellarg($_GET['state']);
	$code= escapeshellarg($_GET['code']);
	$command = $_SERVER["document_root"] . "/openWB/packages/modules/vehicles/mercedeseq/auth.py";
	system(join(" ", [$command, $state, $code]));
}
else {
	echo "<html><body>";
	echo "<p>" . $_GET["error"] . "</p>";
	echo "<p>" . $_GET["error_description"] . "</p>";
	echo "</body></html>";
}
?>
