[![Easetell Mikrotik Billing System](https://dev.easetellnetworks.com/)](https://dev.easetellnetworks.com/)

### [✨ Visit Website

(https://dev.easetellnetworks.com/)

Intergrated with Mpesa payment portal

###[ Requirements ]
Mpesa Paybill Number
Mikrotik
💥 💥 💥 you are good to go

# Get current system date script

:log info "Starting PPPoE Expiry Check..."

:local sysDate [/system clock get date]
:local currentYear [:pick "$sysDate" 0 4]
:local currentMonth [:pick "$sysDate" 5 7]
:local currentDay [:pick "$sysDate" 8 10]

:log info "Current Date: $currentYear-$currentMonth-$currentDay"

:foreach i in=[/ppp secret find] do={
:local username [/ppp secret get $i name]
:local userComment [/ppp secret get $i comment]

    :log info "Checking user: $username, Comment: $userComment"

    # Validate the comment format
    :if ($userComment ~ "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.*Z\$") do={

        # Extract expiry date
        :local expiryYear [:pick "$userComment" 0 4]
        :local expiryMonth [:pick "$userComment" 5 7]
        :local expiryDay [:pick "$userComment" 8 10]

        :log info "Parsed Expiry: $expiryYear-$expiryMonth-$expiryDay"

        # Compare expiration date with system date
        :local expired false
        :if ($currentYear > $expiryYear) do={ :set expired true }
        :if (($currentYear = $expiryYear) && ($currentMonth > $expiryMonth)) do={ :set expired true }
        :if (($currentYear = $expiryYear) && ($currentMonth = $expiryMonth) && ($currentDay >= $expiryDay)) do={ :set expired true }

        # If expired, FORCE disable the user
        :if ($expired = true) do={
            :log warning "User $username has expired! Disabling now..."
            /ppp secret set [find where name="$username"] disabled=yes
            /ppp active remove [find where name="$username"]
            :log warning "PPP user $username disabled and session removed!"
        } else={
            :log info "User $username is still active."

            # Enable user if previously disabled
            :if ( [/ppp secret get [find where name="$username"] disabled] = "true" ) do={
                :log warning "Enabling $username..."
                /ppp secret set [find where name="$username"] disabled=no
                :log warning "PPP user $username enabled!"
            }
        }
    } else={
        :log warning "User $username - Invalid comment format!"
    }

}

:log info "PPP user check completed."
