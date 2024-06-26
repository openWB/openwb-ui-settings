<?php
$charge_log_path = $_SERVER["DOCUMENT_ROOT"] . "/openWB/data/charge_log/";

if (!preg_match("/[0-9]{4}/", $_GET["year"]) || !preg_match("/^((0?[1-9])|(1[0-2]))$/", $_GET["month"])) {
    http_response_code(400);
    die("invalid data");
}

$file_name = sprintf('%04d%02d', $_GET["year"], $_GET["month"]);
$charge_log_file = $charge_log_path . $file_name . ".json";
$charge_log_data = json_decode(file_get_contents($charge_log_file), true);

function translateHeading($value) {
	$translationList = [
		"chargepoint chargepoint id" => "Ladepunkt-ID",
		"chargepoint chargepoint name" => "Ladepunkt",
		"chargepoint chargepoint serial_number" => "Ladepunkt Seriennummer",
		"chargepoint chargepoint imported_at_start" => "Zählerstand Ladestart",
		"chargepoint chargepoint imported_at_end" => "Zählerstand Ladeende",
		"vehicle vehicle id" => "Fahrzeug-ID",
		"vehicle vehicle name" => "Fahrzeug",
		"vehicle vehicle chargemode" => "Lademodus",
		"vehicle vehicle prio" => "Priorität",
		"vehicle vehicle rfid" => "ID-Tag",
		"vehicle vehicle soc_at_start" => "SoC bei Start",
		"vehicle vehicle soc_at_end" => "SoC bei Ende",
		"vehicle vehicle range_at_start" => "Reichweite bei Start",
		"vehicle vehicle range_at_end" => "Reichweite bei Ende",
		"time time begin" => "Beginn",
		"time time end" => "Ende",
		"time time time_charged" => "Dauer",
		"data data range_charged" => "Reichweite",
		"data data imported_since_mode_switch" => "Energie",
		"data data imported_since_plugged" => "Energie seit Anstecken",
		"data data power" => "Leistung",
		"data data costs" => "Kosten",
		"data data power_source grid"=> "Netz-Anteil",
		"data data power_source pv"	=> "PV-Anteil",
		"data data power_source bat"=> "Speicher-Anteil",
		"data data power_source cp"	=> "Ladepunkt-Anteil",
	];

	return $translationList[$value] ?? $value;
}

function translateChargeMode($value) {
	$chargeModeTranslations = [
		"instant_charging" => "Sofortladen",
		"pv_charging" => "PV",
		"scheduled_charging" => "Zielladen",
		"time_charging" => "Zeitladen",
		"standby" => "Standby",
		"stop" => "Stop",
		"false" => "Nein",
		"true" => "Ja",
	];

	return $chargeModeTranslations[$value] ?? $value;
}

if (is_array($charge_log_data)) {
    header("Content-Type: text/csv");
    header("Content-Disposition: attachment; filename=ChargeLog-" . $file_name . ".csv");

    foreach ($charge_log_data as $log_entry) {
		foreach ($log_entry as $section_key => $section_value) {
			if (is_array($section_value)) {
				foreach ($section_value as $key => $value) {
					if (is_array($value)) {
						foreach ($value as $sub_key => $sub_value) {
							$all_keys[$section_key . " " . $key . " " . $sub_key] = true;
						}
					} else {
						$all_keys[$section_key . " " . $key] = true;
					}
				}
			} else {
				$all_keys[$section_key] = true;
			}
		}
	}

	$header_done = false;
	foreach ($charge_log_data as $log_entry) {
		$csv_row = [];
		foreach ($all_keys as $key => $_) {
			$parts = explode(" ", $key);
			$section_key = $parts[0];
			$sub_key = $parts[1];
			$sub_sub_key = isset($parts[2]) ? $parts[2] : null;
			if ($sub_sub_key !== null && isset($log_entry[$section_key][$sub_key][$sub_sub_key])) {
				$value = $log_entry[$section_key][$sub_key][$sub_sub_key];
			} elseif (isset($log_entry[$section_key][$sub_key])) {
				$value = $log_entry[$section_key][$sub_key];
			} else {
				$value = "";
			}
			if (is_bool($value)) {
				$value = $value ? "true" : "false";
			}
			$translated_key = translateHeading($section_key . " " . $key);
			$csv_row[$translated_key] = translateChargeMode($value);
		}
		if (!$header_done) {
			print(implode(";", array_keys($csv_row)) . "\n");
			$header_done = true;
		}
		print(implode(";", $csv_row) . "\n");
	}
}
?>