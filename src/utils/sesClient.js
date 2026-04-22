const  {SESClient} =  require("@aws-sdk/client-ses");
//Seet The AWS Region

const Regeion = "ap-south-1";    


const sesClient = new SESClient({region: Regeion, credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
}});


module.exports = { sesClient };