#!/bin/sh

# Create a shell script that automatically creates a config.json with the following content:
# {
#   "discord_token": string,
#   "admin_secret": string,
#   "port": number,
# }
# The script should ask the user for the values and then create the file.
# Begin of the script

echo "Enter the discord token: (required)"
read -s discord_token

echo "Enter the admin secret: (will be generated)"
read admin_secret

echo "Enter the port: (3000)"
read port

# If discord token is empty, exit
if [ -z "$discord_token" ]; then
    echo "Discord token is required"
    exit 1
fi

# If admin secret is empty, generate one
if [ -z "$admin_secret" ]; then
    admin_secret=$(openssl rand -hex 16)
fi

# If port is empty, set it to 3000
if [ -z "$port" ]; then
    port=3000
fi

# Create the config.json file
echo "{
    \"discord_token\": \"$discord_token\",
    \"admin_secret\": \"$admin_secret\",
    \"port\": $port
}" > config.json

# Say that the config.json file was created
echo "config.json created"

