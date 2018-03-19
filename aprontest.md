Usage: aprontest [OPTION]...
Send commands and list information about connected devices

Operations:
  -a		Add a new home automation device. Add an existing device to a group
  -n		Manually add a home automation device to the database only.  USE WITH CAUTION.
		Only supports zigbee at this time.
  -d		Delete a home automation device. Remove an existing device from a group 
  -f		Force delete a home automation device from the database only.  USE WITH CAUTION.
		Only supports zigbee at this time.
  -u		Update the state of a home automation device with a new value
  -e		Force a refresh of a home automation device
  -E		Force a reconfigure of a home automation device
  -p		Add a PIN code to a Z-Wave lock.
  -q		Specify user ID.
  -g		Set a generic callback for a radio for one minute of radio
		testing
  -l		List general information about automation devices, or specific
		information about one device or group
  --user-code-refresh	Queries device for user codes for all available
		user slots

  --set-name	Set user-readable name for a device
  --set-user-name	Set user-readable user name for a user ID
  --toggle-test	Toggle given attribute between 0 and 255, 100 times

Other Options:
  -r <radio>	Specify a radio for an Add Device or Generic Callback operation.
		One of lutron, zwave, zigbee, kidde
  -m <id>	Specify a master device ID for a Delete, Update, Refresh, or
		List operation
  -t <id>	Specify an attribute ID for an Update operation
  -v <value>	Specify a new value to set for an Update operation
  -x <value>	Specify a group for an add, delete, or update
  -c <userId>	Specify a user record for a delete, or update
  -user <value>	Specify a group for an add, delete, or update

Kidde Specific Operations:
  -k <ID>	Set Kidde system ID

Z-Wave Specific Operations:
  --zwave_controller_reset	Reset the zwave controller. USE WITH CAUTION.
				Existing z-wave network will be lost.
  --zwave_remove_failed		Remove a failed zwave device. 
  --zwave_replace_failed	Replace a failed zwave device.
  --zwave_learn_mode		Enter Learn Mode on the Zwave Controller.
  --zwave_controller_shift	Hand off control to another (new) Zwave controller.
  --zwave_exclusion_mode	Enter Exclusion Mode on the Zwave Controller.

Lutron Specific Operations:
  --lutron_pico_add <dimmerMasterId>	Add dimmerMasterId to the control list for the pico controller with masterId set via -m
  --lutron_pico_del <dimmerMasterId>	Delete dimmerMasterId from the control list for the pico controller with masterId set via -m

Zigbee Group Operations:
	-s <name>		Zigbee Add group name.
	-w <id>		Zigbee Delete group.
	-x <id> -m <id>		Zigbee Node add/remove to group. use with -a or -d 

User Record Operations:
	--update_user <userId> <userName> <userCode>
	--delete_user <userId>
	--list_users <userId> <userName> <userCode>

