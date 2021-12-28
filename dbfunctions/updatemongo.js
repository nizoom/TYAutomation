import {Collection, MongoClient} from 'mongodb';

const url = 'mongodb://localhost:27017'

const client = new MongoClient(url)

const dbName = 'TYAutomation';

async function initMongo(donationsSoFarToday){

    // console.log(donationsSoFarToday + " This is line 11")

    const numberOfDonationSoFarToday = donationsSoFarToday.length;
    
    await client.connect();

    console.log('Connected successfully to server');

    const db = client.db(dbName);

    const collection = db.collection('documents')
    
    //START DB 

    // const insertResult = await collection.insertMany([{
    //     'recentDonations' : 'collection', dbNumberofDonations : 0
    // }])

    // console.log('Inserted documents => ', insertResult )

    // DELETE DATA 

    // const deleteResult = await collection.deleteMany({ 'recentDonations' : 'collection' });
    
    // console.log('Deleted documents =>', deleteResult);     
    


    // Old numner is the amount of donations previously recorded for today 

    // const dbSoFar = await collection.find().toArray(); 

    const oldNumberObject = await collection.find({'recentDonations' : 'collection'}).toArray();
        
    // console.log('Found documents', oldNumberObject)

    const oldNumber = oldNumberObject[0].dbNumberofDonations

    // console.log(dbSoFar)

    // if dbNumberofDonations is less than numberOfDonationSoFarToday 

    // UPDATE DATA AFTER for the next search after oldNumber is declared

    const updateCount = await collection.updateOne({'recentDonations' : 'collection'}, {$set: {'recentDonations' : 'collection', dbNumberofDonations : numberOfDonationSoFarToday }})

    client.close();

    // / console.log('Updated documents =>', updateCount);

    if(numberOfDonationSoFarToday > oldNumber){
        
         // then there has been a new donation and we need to trigger an email 

        console.log('caught')
        console.log(`number of donations so far today : ${numberOfDonationSoFarToday}`)
        console.log(`the number of donations last time we checked: ${oldNumber}`)
        const numberOfNewDonationsSinceLastCheck = numberOfDonationSoFarToday - oldNumber

        return numberOfNewDonationsSinceLastCheck;
    } //else no new donations and return 0
    return 0; 

   
    
   
}



export default initMongo;

//TODO: 1) HIS NUMBER NEEDS TO BE WIPED AT MIDNIGHT AFTER LAST CHECK OF THE DAY

