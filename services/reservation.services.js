const db = require("../mongo");
const jwt =require("jsonwebtoken");
const { rac, waitinglist } = require("../mongo");

const service = {
    async book(req,res) {
        try {
            const check1 = await db.confirm.findOne({status:""});
            const check2 = await db.rac.findOne({status:""});
            const check3 = await db.waitinglist.findOne({status:""});
            if(check1 || check2 || check3  ){
                await db.passenger.insertOne(req.body);
                if(req.body.age>5){
                if(check1){
                    const seat=await db.confirm.findOne({$and:[{status:""} , {birth:req.body.birth}]})
                    if(seat){
                        await db.confirm.findOneAndUpdate({$and:[{status:""} , {birth:req.body.birth}]},{$set:{status:"confirmed",alloted:req.body.ticket_no
                        ,name:req.body.name,age:req.body.age,gender:req.body.gender}});
                        res.send("booked")
                    }else{
                        await db.confirm.findOneAndUpdate({status: ""},{$set:{status:"confirmed",alloted:req.body.ticket_no
                        ,name:req.body.name,age:req.body.age,gender:req.body.gender}})
                    }
                }else if(check2){
                    const seat=await db.rac.findOne({status: ""})
                    if(seat){
                        await db.rac.findOneAndUpdate({status: ""},{$set:{status:"confirmed",alloted:req.body.ticket_no
                        ,name:req.body.name,age:req.body.age,gender:req.body.gender}})
                        res.send("booked")
                    }
                }else if(check3){
                    const seat=await db.waitinglist.findOne({status: ""})
                    if(seat){
                        await db.waitinglist.findOneAndUpdate({status: ""},{$set:{status:"confirmed",alloted:req.body.ticket_no
                        ,name:req.body.name,age:req.body.age,gender:req.body.gender}})
                        res.send("booked")
                    }
                }
            }
            res.sendStatus("200");
        }
            
        } catch (error) {
            console.log("Error Registering User - ",error);
            res.send(500)
        }
    },
    
    async cancel(req,res){
        try {
            const check1 = await db.confirm.findOne({alloted:req.body.ticket_no});        
            const check2 = await db.rac.findOne({alloted:req.body.ticket_no});
            const check3 = await db.waitinglist.findOne({alloted:req.body.ticket_no});
           if(check1){
            await db.confirm.findOneAndUpdate({alloted:req.body.ticket_no},{$set:{alloted:'',status:"",name:"",age:"",gender:""}});
            const seat= await db.rac.findOne({status:"confirmed"});
            await db.confirm.findOneAndUpdate({status: ""},{$set:{status:seat.status,alloted:seat.alloted,name:seat.name,age:seat.age,gender:seat.gender}});
            for(let i=2;i<19;i++){
                let j= i.toString();
                const rac_seat= await db.rac.findOne({seat:`${j}`});
                await db.rac.findOneAndUpdate({seat:`${j-1}`},{$set:{status:rac_seat.status,alloted:rac_seat.alloted,name:rac_seat.name,age:rac_seat.age,gender:rac_seat.gender}});
            }
            const rac_seat= await db.waitinglist.findOne({status:"confirmed"});
            await db.rac.findOneAndUpdate({seat:'18'},{$set:{status:rac_seat.status,alloted:rac_seat.alloted,name:rac_seat.name,age:rac_seat.age,gender:rac_seat.gender}});
            for(let i=2;i<11;i++){
                let j= i.toString();
                const waiting= await db.waitinglist.findOne({waiting_no:`${j}`});
                await db.waitinglist.findOneAndUpdate({waiting_no:`${j-1}`},{$set:{status:waiting.status,alloted:waiting.alloted,name:waiting.name,age:waiting.age,gender:waiting.gender}});
            }
            await db.waitinglist.findOneAndUpdate({waiting_no:"10"},{$set:{status:"",alloted:"",name:"",age:"",gender:""}});
            res.send("canceled")
           }else if(check2){
               await db.rac.findOneAndUpdate({alloted:req.body.ticket_no},{$set:{alloted:'',status:"",name:"",age:"",gender:""}});
               for(let i=check2.seat;i<18;i++){
                i = parseInt(i)+1;
                let j= i.toString();
                i=--i;
                const rac_seat= await db.rac.findOne({seat:`${j}`});
                await db.rac.findOneAndUpdate({seat:`${j-1}`},{$set:{status:rac_seat.status,alloted:rac_seat.alloted,name:rac_seat.name,age:rac_seat.age,gender:rac_seat.gender}});
            }
            const rac_seat= await db.waitinglist.findOne({status:"confirmed"});
            await db.rac.findOneAndUpdate({seat:'18'},{$set:{status:rac_seat.status,alloted:rac_seat.alloted,name:rac_seat.name,age:rac_seat.age,gender:rac_seat.gender}});
            for(let i=2;i<11;i++){
                let j= i.toString();
                const waiting= await db.waitinglist.findOne({waiting_no:`${j}`});
                await db.waitinglist.findOneAndUpdate({waiting_no:`${j-1}`},{$set:{status:waiting.status,alloted:waiting.alloted,name:waiting.name,age:waiting.age,gender:waiting.gender}});
            }
            await db.waitinglist.findOneAndUpdate({waiting_no:"10"},{$set:{status:"",alloted:"",name:"",age:"",gender:""}});
               res.send("canceled")
           }else if(check3){
            await db.waitinglist.findOneAndUpdate({alloted:req.body.ticket_no},{$set:{alloted:'',status:"",name:"",age:"",gender:""}});
            for(let i=check3.waiting_no;i<10;i++){
                i = parseInt(i)+1;
                let j= i.toString();
                i=--i;
                const waiting= await db.waitinglist.findOne({waiting_no:`${j}`});
                await db.waitinglist.findOneAndUpdate({waiting_no:`${j-1}`},{$set:{status:waiting.status,alloted:waiting.alloted,name:waiting.name,age:waiting.age,gender:waiting.gender}});
            }
            await db.waitinglist.findOneAndUpdate({waiting_no:"10"},{$set:{status:"",alloted:"",name:"",age:"",gender:""}});
            res.send("canceled")
        }
        } catch (error) {
            console.log("not cancelled - ",error);
            res.status(500);
        }
    },
    async bookedTickets(req,res){
        try{
            const confirmed=await db.confirm.find({alloted:{$ne:""}}).toArray();
            res.status(200).send(confirmed);
        }
        catch(err){
            res.send(err);
        }
    },
    async racTickets(req,res){
        try{
            const confirmed=await db.rac.find({alloted:{$ne:""}}).toArray();
            res.status(200).send(confirmed);
        }
        catch(err){
            res.send(err);
        }
    },
    async waiting(req,res){
        try{
            const confirmed=await db.waitinglist.find({alloted:{$ne:""}}).toArray();
            res.status(200).send(confirmed);
        }
        catch(err){
            res.send(err);
        }
    },
    async below(req,res){
        try{
            const confirmed=await db.passenger.find({$or:[{age:"1"} , {age:"2"},{age:"3"},{age:"4"},{age:"5"}]}).toArray();
            res.status(200).send(confirmed);
        }
        catch(err){
            res.send(err);
        }
    },  
    async availConfirm(req,res){
        try{
            const confirmed=await db.confirm.find({status:""}).toArray();
            res.status(200).send(confirmed);
        }
        catch(err){
            res.send(err);
        }
    },
    async availRac(req,res){
        try{
            const confirmed=await db.rac.find({status:""}).toArray();
            res.status(200).send(confirmed);
        }
        catch(err){
            res.send(err);
        }
    },
    async availticket(req,res){
        try{
            const check1 = await db.confirm.findOne({status:""});
            const check2 = await db.rac.findOne({status:""});
            const check3 = await db.waitinglist.findOne({status:""});
            if(check1){
                const data=check1;
                res.status(200).send(data);
            }else if(check2){
                const data=check2;
                res.status(200).send(data);
            }else if(check3){
                const data=check3;
                res.status(200).send(data);
            }else{
                const data=[];
                res.status(200).send(data);
            }
        }
        catch(err){
            res.send(err);
        }
    }
}


module.exports = service;