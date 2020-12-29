const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password, ipAddress }) {
    const account = await db.Account.scope('withHash').findOne({ where: { email } });

    if (!account || !account.isVerified || !(await bcrypt.compare(password, account.passwordHash))) {
        throw 'Email or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    console.log("bbbbbbbbbb"+token);
    const refreshToken = await getRefreshToken(token);
    console.log("refresh"+JSON.stringify(refreshToken));
    const account = await getAccount(refreshToken.usersTableUsersId);

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

/*async function register(params, origin) {
    // validate
    if (await db.Account.findOne({ where: { email: params.email } })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    // create account object
    const account = new db.Account(params);

    // first registered account is an admin
    const isFirstAccount = (await db.Account.count()) === 0;
    account.role = isFirstAccount ? Role.Admin : Role.User;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = await hash(params.password);
    account.userName= params.userName;
    //added for avoiding the mail verification need to be remove in future
   // account.verified=Date.now();

    // save account
    await account.save();

    // send email
    await sendVerificationEmail(account, origin+'');
}*/
async function register(params, origin) {
    if(params.hasOwnProperty('PhoneNumber')){
        console.log("woking");

    }
    if(params.hasOwnProperty('EmailAddress')){
        console.log("Email woking");

    }
   
    const usetId=0;
    const phoneId=0;
    const loginId=0;
    const emailId=0;
    var logintypeObject =null;
   // const addressId=0;
    // validate
    const countryObject = await db.countryModel.findOne({ where: { CountryName: 'India' } });
    if (countryObject === null) {
      console.log('countryObject Not found!');
    } else {
      console.log(countryObject instanceof db.countryModel); // true
      console.log(countryObject.CountryID); // 'CountryID'
    }

    const phoneTypeObject = await db.phoneType.findOne({ where: { PhoneNoTypeDesc: 'Mobile' } });
    if (phoneTypeObject === null) {
      console.log('phoneTypeObject Not found!');
    } else {
      console.log(phoneTypeObject instanceof db.phoneType); // true
      console.log(phoneTypeObject.PhoneNoTypeID); // 'PhoneNoTypeID'
    }
    
    if(params.hasOwnProperty('PhoneNumber')){    
     logintypeObject = await db.loginType.findOne({ where: { LoginTypeDesc: 'Phone' } });
    }
    if(params.hasOwnProperty('EmailAddress')){    
        logintypeObject = await db.loginType.findOne({ where: { LoginTypeDesc: 'Email' } });
    }
    if (logintypeObject === null) {
      console.log('logintype ObjectNot found!');
    } else {
      console.log(logintypeObject instanceof db.loginType); // true
      console.log(logintypeObject.LoginTypeID); // 'LoginTypeID'
    }
 
    // create account object
    const user = new db.User(params);   
    const phone = new db.Phone(params);
    const phoneUser = new db.phoneUser(params);
    const login = new db.Login(params);
    const loginUser = new db.loginModel(params);
    const email= new db.Email(params);
    const emailUser= new db.emailUser(params);

    //email.EmailAddress=params.EmailAddress;
   // console.log(email.EmailAddress);
    //await email.save();


    if(params.hasOwnProperty('PhoneNumber')){        
        login.UserName = params.PhoneNumber;
    }
    if(params.hasOwnProperty('EmailAddress')){        
        login.UserName = params.EmailAddress;
    }
   
    login.LoginTypeID=logintypeObject.LoginTypeID;
    console.log("login.LoginTypeID=========>"+login.LoginTypeID)
    login.UserNameVerified= 0;
    login.LoginPassword=params.LoginPassword;
    login.LoginPasswordSalt=await hash(params.LoginPassword);
    
    
   const address = new db.Address(params);  
   const userAddress = new db.userAddress(params); 
   // save User,Address and User Address details
  // console.log("params.MiddleName==========>"+JSON.stringify(params));
   if(params.MiddleName==null || params.MiddleName==''){
    user.MiddleName='';
   }
  // 
  // user.UserID=10;

  address.Address='';
  address.Town='';
  address.State='';
  address.CountryID=countryObject.CountryID;
  address.PostCode='';
  address.save().then(async function(addressObject){

        console.log("addId======"+addressObject.AddressID);
        user.DefaultAddressID=addressObject.AddressID;
        if(params.hasOwnProperty('PhoneNumber')){ 
            phone.CountryID=countryObject.CountryID;
            phone.NumberinInterForm=0;
            phone.PhoneNoTypeID=phoneTypeObject.PhoneNoTypeID;
        
            await phone.save().then(async function(phoneResult){
                this.phoneId=phoneResult.PhoneNoID;
                console.log("PhoneNoID========>"+ this.phoneId);
                user.DefaultPhoneID=this.phoneId;

                    await user.save().then(async function(userResult){
                        userAddress.UserID=userResult.UserID; 
                        userAddress.AddressID=addressObject.AddressID;
                        userAddress.save();
                        this.usetId=userResult.UserID;
                        phoneUser.UserID=this.usetId;
                        phoneUser.PhoneNoID=this.phoneId;
                        await phoneUser.save();
                        await login.save().then(async function(loginResult){
                            this.loginId=loginResult.LoginID;
                            console.log("loginId========>"+ this.loginId);
                            console.log("userid========>"+ this.usetId);
                            loginUser.UserID=this.usetId;
                            loginUser.LoginID=this.loginId;
                            await loginUser.save();
                        
                        });
                    }); 
            });
        }

        if(params.hasOwnProperty('EmailAddress')){ 
            phone.CountryID=countryObject.CountryID;
            phone.NumberinInterForm=0;
            phone.PhoneNoTypeID=phoneTypeObject.PhoneNoTypeID;
            phone.PhoneNumber='000000000000';
        
            await phone.save().then(async function(phoneResult){
                this.phoneId=phoneResult.PhoneNoID;
                console.log("PhoneNoID========>"+ this.phoneId);
                user.DefaultPhoneID=this.phoneId;

                    await user.save().then(async function(userResult){
                        userAddress.UserID=userResult.UserID; 
                        userAddress.AddressID=addressObject.AddressID;
                        userAddress.save();
                        this.usetId=userResult.UserID;
                        phoneUser.UserID=this.usetId;
                        phoneUser.PhoneNoID=this.phoneId;
                        await phoneUser.save();

                        await email.save().then(async function(emailResult){
                            this.emailId=emailResult.EmailID;
                            console.log("EmailID========>"+ this.emailId);
                            console.log("userid========>"+ this.usetId);
                            emailUser.UserID=this.usetId;
                            emailUser.EmailID=this.emailId;
                            await emailUser.save();
                           
                        });

                        await login.save().then(async function(loginResult){
                            this.loginId=loginResult.LoginID;
                            console.log("loginId========>"+ this.loginId);
                            console.log("userid========>"+ this.usetId);
                            loginUser.UserID=this.usetId;
                            loginUser.LoginID=this.loginId;
                            await loginUser.save();
                        
                        });
                    }); 
            });
        }


  });

   
    
    
/*
    
    //added by temporary 
    //phone.PhoneNumber=123456;

  //  console.log("params.PhoneNumber=========>"+params.PhoneNumber);
    if(params.hasOwnProperty('PhoneNumber')){        
        login.UserName = params.PhoneNumber;
    }
    if(params.hasOwnProperty('EmailAddress')){        
        login.UserName = params.EmailAddress;
    }
   
    login.LoginTypeID=logintypeObject.LoginTypeID;
    console.log("login.LoginTypeID=========>"+login.LoginTypeID)
    login.UserNameVerified= 0;
    login.LoginPassword=params.LoginPassword;
    login.LoginPasswordSalt=await hash(params.LoginPassword);
   //address.Town='';
    //address.State='';
   // address.CountryID=countryObject.CountryID;
  //  address.PostCode='';
    await user.save().then(async function(userResult){
        this.usetId=userResult.UserID;
      //console.log("userid========>"+ this.usetId);

      

     if(params.hasOwnProperty('EmailAddress')){ 
      
        await email.save().then(async function(emailResult){
            this.emailId=emailResult.EmailID;
            console.log("EmailID========>"+ this.emailId);
            console.log("userid========>"+ this.usetId);
            emailUser.UserID=this.usetId;
            emailUser.EmailID=this.emailId;
            await emailUser.save();
           
        });
    }

        await login.save().then(async function(loginResult){
            this.loginId=loginResult.LoginID;
            console.log("loginId========>"+ this.loginId);
            console.log("userid========>"+ this.usetId);
            loginUser.UserID=this.usetId;
            loginUser.LoginID=this.loginId;
            await loginUser.save();
           
        });


    });*/


  //  console.log("UserID======"+user.save().UserID)
  //console.log("uuuuusetId========>"+this.usetId)
   // await address.save();

    //save Address
    
    // send email
    //await sendVerificationEmail(account, origin+'');
}


async function socialRegister(params, origin) {
    // validate login userName
    if (await db.loginModel.findOne({ where: { UserName: params.email } })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    if (await db.Email.findOne({ where: { EmailAddress: params.email } })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }






    // create account object
    const account = new db.Account(params);

    // first registered account is an admin
    const isFirstAccount = (await db.Account.count()) === 0;
    account.role = isFirstAccount ? Role.Admin : Role.User;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = await hash(params.password);
    account.userName= params.userName;
    //added for avoiding the mail verification need to be remove in future
   // account.verified=Date.now();

    // save account
    await account.save();

    // send email
    await sendVerificationEmail(account, origin+'');
}

async function verifyEmail({ token }) {
    const account = await db.Account.findOne({ where: { verificationToken: token } });

    if (!account) throw 'Verification failed';

    account.verified = Date.now();
    account.verificationToken = null;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await db.Account.findOne({ where: { email } });

    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = randomTokenString();
    account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000);
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await db.Account.findOne({
        where: {
            resetToken: token,
            resetTokenExpires: { [Op.gt]: Date.now() }
        }
    });

    if (!account) throw 'Invalid token';

    return account;
}

async function resetPassword({ token, password }) {
    const account = await validateResetToken({ token });

    // update password and remove reset token
    account.passwordHash = await hash(password);
    account.passwordReset = Date.now();
    account.resetToken = null;
    await account.save();
}

async function getAll() {
    const accounts = await db.Account.findAll();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}

async function create(params) {
    // validate
    if (await db.Account.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = await hash(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}

async function update(Users_id, params) {
    const account = await getAccount(Users_id);

    // validate (if email was changed)
    if (params.email && account.email !== params.email && await db.Account.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.destroy();
}

// helper functions

async function getAccount(id) {
    const account = await db.Account.findByPk(id);
    if (!account) throw 'Account not found';
    return account;
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ where: { token } });
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        accountId: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress,
        usersTableUsersId:account.Users_id
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
    const { Users_id, title, firstName, lastName, email, role, created, updated, isVerified,userAddress,userPhone } = account;
    return { Users_id, title, firstName, lastName, email, role, created, updated, isVerified ,userAddress,userPhone};
}

async function sendVerificationEmail(account, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/account/verify-email?token=${account.verificationToken}`;
        message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification API - Verify Email',
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'Sign-up Verification API - Email Already Registered',
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
}

async function sendPasswordResetEmail(account, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/account/reset-password?token=${account.resetToken}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification API - Reset Password',
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}