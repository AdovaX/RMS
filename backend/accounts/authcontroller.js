const express = require('express');
const router = express.Router();
const accountService = require('./authenticate.service');
const bcrypt = require('bcryptjs');
var session = require('express-session');
var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

router.post('/authenticate', authenticate);
const db = require('_helpers/db');
module.exports = router;


async function authenticate (request, response,next) {
	var username = request.body.UserName;
    var password = request.body.LoginPassword;
    var userId;
    var userObject;
    var emailId;
    var email;
    var phoneId;
    var phoneObject;
    var addressId;
    var addressObject;
    var countryId;
    var countryName;

    const loginObject = await db.Login.findOne({ where: { UserName: username } });

    if (!loginObject || !(await bcrypt.compare(password, loginObject.LoginPasswordSalt))) {
       
        response.send('Email or password is incorrect');
    }
    else{
        await db.loginModel.findOne({
            attributes: ['UserID'],
            where: {LoginID: loginObject.LoginID}                       
    
    }).then(async function (loginUsers) {

            console.log("unnalke======="+JSON.stringify(loginUsers.UserID));
            this.userId=loginUsers.UserID;
            });
          
            this.userObject= await db.User.findOne({
                where:{UserID:this.userId}
            });

            this.emailId= await db.emailUser.findOne({
                attributes: ['EmailID'],
                where:{UserID:this.userId}
            }).then(async function(emailUsers){
                console.log("emaildetails======="+JSON.stringify(emailUsers.EmailID));
                this.email= await db.Email.findOne({
                    attributes: ['EmailAddress'],
                    where:{EmailID:emailUsers.EmailID}
                })
                console.log("emaildetailssss======="+JSON.stringify(this.email.EmailAddress));
           // response.json({userdetails:userObject,email:email.EmailAddress})
            });

            this.phoneId= await db.phoneUser.findOne({
                attributes: ['PhoneNoID'],
                where:{UserID:this.userId}
            }).then(async function(phoneUsers){

                if(!phoneUsers){
                   this.phoneObject=0;

                }else{
                    this.phoneObject= await db.Phone.findOne({
                        where:{PhoneNoID:phoneUsers.PhoneNoID}
                    })

                }
                console.log("phoneObject==========>"+this.phoneObject)
                
               
            });


            this.addressId= await db.userAddress.findOne({
                attributes: ['AddressID'],
                where:{UserID:this.userId}
            }).then(async function(addressUsers){

                if(!addressUsers){                   
                    this.addressObject=null;

                }else{
                    this.addressObject= await db.Address.findOne({
                        where:{AddressID:addressUsers.AddressID}
                    }).then(async function(address){

                        if(!address){
                            this.countryName=null;

                        }else{
                            this.countryName= await db.countryModel.findOne({
                                where:{CountryID: address.CountryID}
                            })                            
                        }
                        
                    });

                }
                console.log("phoneObject==========>"+this.addressObject);             
               
            });

            
            


           
                request.session.loggedin = true;
                request.session.UserName = username;

                console.log( request.session);
                console.log( request.session.loggedin);
                response.send(request.session);
                                //response.redirect('/home');
    }
    

	/*if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}*/
};

router.get('/home', function(request, response) {
   console.log("dfsfsdfsdfsdfsdf"+request.session.Username);
   console.log(request.session.loggedin);

	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.Username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

/*function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    accountService.authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
          //  res.json(account);
            res.json({account:account,refreshToken:refreshToken});
        })
        .catch(next);
}*/
