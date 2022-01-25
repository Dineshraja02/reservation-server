const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URL);
module.exports ={
    db:null,
    auth:null,
    confirm:null,
    rac:null,
    waitinglist:null,
    passenger:null,

    async connect(){
        await client.connect();

        this.db = client.db(process.env.MONGODB_NAME);
        console.log("Database Selected")

        this.auth=this.db.collection('auth');
        this.confirm=this.db.collection('confirm');
        this.rac=this.db.collection('rac');
        this.waitinglist=this.db.collection('waitinglist');
        this.passenger=this.db.collection('passenger');
    }
}