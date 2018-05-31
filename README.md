# Ethereum Demo using React Front End
## Installation & Deployment Instructions

### Database - MongoDB
- MongoDb config file in Server/dbconfig
- Mongodb configured to run in localhost:27017 
- Please confirm whether database is running 

### Server - Node JS
1. npm install
2. npm run serve - To Start the server in port 5000

- It will connects to the database and create the collection of all transactions
- Also, it will check for updates and updates the database accordingly

### Client
1. npm install
2. npm start - To Start the local server in port 3000

- It will connect to localhost:3000 page in the browser, displaying the transaction details
- Also it will check for updates from the database and refreshes the content if any

## Solution Details

#### Search
   - Copy From /To/Hash address into the Search bar to get the result
   - Clear the box to view all the transactions

#### Filter
   - Choose the Status from the Dropdown, Select Success / Failure to view the corresponding transactions
   - Choose the transaction type to view the respective transactions
  

#### Bookmark / Blacklist transaction
- Select a transaction , Click on Bookmark /Blacklist button to bookmark/blacklist that transaction
- Choose "Normal" To view all the transactions

#### Transaction details
- Click on the transaction hash to view its details
- Have implemented 2 possibilities of showing transaction details
    1.  Showing transaction details passed from main page
    2.  Getting just transaction hash and retriving values using web3 and displaying the details
##### Not Implemented
   - Displaying Number of PAL Tokens
  - Need to disable main page component refresh while returing back
   - Test cases for Back end
We can check for last block number added in the database, and retrieve the recent block number from blockchain, if both are same, no need to update.
Otherwise, keeping last added block number from database as starting block , can fetch all blocks upto the recent block in the blockchain to update the database and client.

#### OTHER
Thank you for this test. I have learned atleast basics about blockchain, ethereum. Its really interesting.