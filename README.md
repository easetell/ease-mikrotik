[![Easetell Mikrotik Billing System](https://dev.easetellnetworks.com/)](https://dev.easetellnetworks.com/)

### [✨ Visit Website

(https://dev.easetellnetworks.com/)

Intergrated with Mpesa payment portal

### [ Requirements ]

Mpesa Paybill Number
Mikrotik
ssh root@46.202.168.183

💥 💥 💥 you are good to go

## Enviroment Variables

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.jzpvv9r.mongodb.net/

NEXT_PUBLIC_SMS_API_URL=https://<smsurl>/SMSApi/send
NEXT_PUBLIC_USER_ID=<username>
NEXT_PUBLIC_PASSWORD=<password>
NEXT_PUBLIC_SENDER_NAME=<EASETELLNET-Sender-Id>
NEXT_PUBLIC_API_KEY=<api-key>

ROUTER_IP=<router-ip>
USER_NAME=<username>
ROUTER_PASSWORD=<password>
API_PORT=<api-port-number>

MPESA_CONSUMER_KEY=YHuylBIWk7eazE8JrxkJvc2jHhaOFaKIrGDM3hJeYZTR5TO4
MPESA_CONSUMER_SECRET=qcFqw0AtAC1ZqzXbtRTE5d6DAOPHieaSqJ3vKbWZfG2oJj0yjQh1mC1RRhofSAkP
MPESA_SHORT_CODE=107031
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
CALL_BACK_URL=<wbsite-url-https:>/api/mpesa-call-back

## Mikrotik PPPoE Script Starts..............############################

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

## RUN THIS THEN SCHEDULE IT /system script run pppoeExpiryScript

## Mikrotik script remove hotspot user script

:log info "Starting Hotspot User Expiry Check..."

:local sysDate [/system clock get date]
:local sysTime [/system clock get time]
:local currentYear [:pick "$sysDate" 0 4]
:local currentMonth [:pick "$sysDate" 5 7]
:local currentDay [:pick "$sysDate" 8 10]
:local currentHour [:pick "$sysTime" 0 2]
:local currentMinute [:pick "$sysTime" 3 5]
:local currentSecond [:pick "$sysTime" 6 8]

:log info "Current Date: $sysDate $sysTime"

:foreach i in=[/ip hotspot user find] do={
:local username [/ip hotspot user get $i name]
:local userComment [/ip hotspot user get $i comment]

    :log info "Checking user: $username with expiry: $userComment"

    # Validate comment format (must be MM/DD/YYYY, HH:MM:SS AM/PM)
    :if (([:len $userComment] < 22) || ([ :pick $userComment 2 3 ] != "/") || ([ :pick $userComment 5 6 ] != "/") || ([ :pick $userComment 10 11 ] != ",")) do={
        :log warning "Skipping user $username - Invalid or missing expiry timestamp!"
    } else={
        # Extract Expiry Timestamp from Comment
        :local expiryMonth [:tonum [:pick "$userComment" 0 2]]
        :local expiryDay [:tonum [:pick "$userComment" 3 5]]
        :local expiryYear [:tonum [:pick "$userComment" 6 10]]
        :local expiryHour [:tonum [:pick "$userComment" 12 14]]
        :local expiryMinute [:tonum [:pick "$userComment" 15 17]]
        :local expirySecond [:tonum [:pick "$userComment" 18 20]]
        :local ampm [:pick "$userComment" 21 23]

        # Convert 12-hour format to 24-hour format
        :if ($ampm = "PM" && $expiryHour != 12) do={
            :set expiryHour ($expiryHour + 12)
        }
        :if ($ampm = "AM" && $expiryHour = 12) do={
            :set expiryHour 0
        }

        :log info "User: $username Expiry At: $expiryYear-$expiryMonth-$expiryDay $expiryHour:$expiryMinute:$expirySecond"

        # Convert current time and expiry time to total seconds for comparison
        :local nowTotalSeconds (($currentHour * 3600) + ($currentMinute * 60) + $currentSecond)
        :local expiryTotalSeconds (($expiryHour * 3600) + ($expiryMinute * 60) + $expirySecond)

        # Check if expired
        :local expired false
        :if ($currentYear > $expiryYear) do={ :set expired true }
        :if (($currentYear = $expiryYear) && ($currentMonth > $expiryMonth)) do={ :set expired true }
        :if (($currentYear = $expiryYear) && ($currentMonth = $expiryMonth) && ($currentDay > $expiryDay)) do={ :set expired true }
        :if (($currentYear = $expiryYear) && ($currentMonth = $expiryMonth) && ($currentDay = $expiryDay) && ($nowTotalSeconds >= $expiryTotalSeconds)) do={ :set expired true }

        # Remove user if expired
        :if ($expired = true) do={
            :log warning "User $username has expired! Removing now..."
            /ip hotspot active remove [find where user="$username"]
            /ip hotspot cookie remove [find where user="$username"]
            /ip hotspot user remove $i
            :log warning "Hotspot user $username removed!"
        } else={
            :log info "User $username is still active."
        }
    }

}

:log info "Hotspot User Expiry Check Completed."

## /system script run hotspotExpiryScript

## RemoveHotspotUser Script

You should Create This Scheduler Every 5Sec

## Mikrotik Script Ends..............############################

## MIKROTIK MAIN LOGIN PAGE IN THE lib Folder.

## start the server this is like nodemon

pm2 list
pm2 start npm --name "ease-mikrotik" -- start
pm2 stop ease-mikrotik
pm2 restart ease-mikrotik
pm2 delete ease-mikrotik

https://chat.deepseek.com/a/chat/s/4532c2aa-759f-4fd1-b4f2-60de571639a7
