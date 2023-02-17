const express = require("express"); 
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended:true})); 
// To use css-img files as public file...
app.use(express.static("public")); 

app.get("/",function(req,res){ 
    res.sendFile(__dirname + "/signup.html"); 
}); 

app.post("/",function(req,res){
    const name = req.body.fullname;
    const where = req.body.where; 
    const email = req.body.email;
    
    const data = {
        members: [
            {email_address: email,
            status:"subscribed",
            merge_fields:{
                FNAME : name,
                WHERE : where
                }
            } 
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/c9d1ea736b";
    const options = {
        method:"POST",
        auth: "api:52716e1ac9b42b9594bbfc256d6bd712-us21"
    }
    

    const request = https.request(url,options,function(response){
       if(response.statusCode === 200){
        response.on("data",function (data) {
            console.log(JSON.parse(data));
            console.log(response.statusCode);
          })
        res.sendFile(__dirname + "/success.html")
       }
       else{
        res.sendFile(__dirname + "/failure.html");
       }
        
     });

     request.write(jsonData);
     request.end();

});


app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is working now!")
})