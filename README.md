[![Easetell Mikrotik Billing System](https://dev.easetellnetworks.com/)](https://dev.easetellnetworks.com/)

### [✨ Visit Website

(https://dev.easetellnetworks.com/)

Intergrated with Mpesa payment portal

###[ Requirements ]
Mpesa Paybill Number
Mikrotik
💥 💥 💥 you are good to go

:local currentDate [/system clock get date];
:local currentTime [/system clock get time];
:local currentTimestamp [:tonum [:timestamp ($currentDate . " " . $currentTime)]];

:foreach user in=[/ppp secret find where service="pppoe"] do={
:local expiryDate [/ppp secret get $user comment];
:local expiryTimestamp [:tonum [:timestamp $expiryDate]];

    :local userName [/ppp secret get $user name];

    :if ($expiryTimestamp < $currentTimestamp) do={
        # Disable the user if expiryDate has passed
        /ppp secret set $user disabled=yes;
        :log warning ("Disabled expired user: $userName");

        # Disconnect active session (if any)
        :local activeSession [/ppp active find where name=$userName];
        :if ([:len $activeSession] > 0) do={
            /ppp active remove $activeSession;
            :log warning ("Disconnected active session for: $userName");
        }
    } else={
        # Enable the user if expiryDate is in the future
        /ppp secret set $user disabled=no;
        :log info ("Enabled user: $userName");
    }

}
