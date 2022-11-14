var express = require("express");
var router = express.Router();
const {check,validationResult} = require('express-validator');

const path = require('path');
const upload = require('../uploadMiddleware');
const Resize = require('../Resize');
const multi_upload = require("../middleware/upload");
const bodyParser = require('body-parser');
var user_md = require('../models/user');
var val_md = require('../models/val');
var reg_md = require('../models/reg');
var news_md = require('../models/news');
var helper = require("../helpers/helper");
var paypal = require('paypal-rest-sdk');
var randomstring = require("randomstring");

// helper functions 
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}       
// configure paypal with the credentials you got when you created your paypal app

var client_id = 'AbnMcd4XQcKEBlwDfG1FZutZe4jgUsZjErMM041-il4Up9OJS4_NcFJ_rHC2_WBSQu1OuJRf1HRU6W7e';
var secret = 'EC2gbb2HP2Vjg8cZwwrr3bkQcs-TdOlQDisfpgc4-u9NcoA5tJlEk2iAUyXsgU0Z4Mn93SLGxRQhjsx8';

//allow parsing of JSON bodies
router.use(bodyParser.json());

//configure for sandbox environment
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': client_id,
    'client_secret': secret
});


// router.get("/", function (req, res) {
//      res.render("signin", { data: {} });
// });

router.get('/create', function(req, res){
    //build PayPal payment request
    var payReq = JSON.stringify({
        'intent':'sale',
        'redirect_urls':{
            'return_url':'http://janaraksha.shop/admin/process',
            'cancel_url':'http://janaraksha.shop/cancel'
        },
        'payer':{
            'payment_method':'paypal'
        },
        'transactions':[{
            'amount':{
                'total':'10.50',
                'currency':'USD'
            },
            'description':'This is the payment transaction description.'
        }]
    });

    paypal.payment.create(payReq, function(error, payment){
        if(error){
            console.error(error);
        } else {
            //capture HATEOAS links
            var links = {};
            payment.links.forEach(function(linkObj){
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            })
        
            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')){
                res.redirect(links['approval_url'].href);
            } else {
                console.error('no redirect URI present');
            }
        }
    });
});


router.get('/process', function(req, res){
    
    

    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };

    paypal.payment.execute(paymentId, payerId, function(error, payment){
        if(error){
            console.error(error);
        } else {
            if (payment.state == 'approved'){ 
                res.send('payment completed successfully');
            } else {
                res.send('payment not successful');
            }
        }
    });
});
router.get("/", function (req, res) {
    if (req.session.admin) {
        // res.json({"message": "This is Admin Page"});
        var data = news_md.getAllNews();
        data.then(function (posts) {
            var data = {
                posts: posts,
                error: false
            };

            res.render("admin/index/index", { data: data });
        }).catch(function (err) {
            res.render("admin/index/index", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});
router.get('/index', function (req, res) {
    res.render("admin/index/index", { data: {} });
})


router.get('/signin', function (req, res) {
    res.render("signin", { data: {} });
})


router.post("/signin", function (req, res) {
    var params = req.body;
 console.log("admin login end ");
    if (params.email.trim().length == 0) {
        res.render("signin", { data: { error: "Please enter an email" } });
    } else {
        var data = user_md.getUserByEmail(params.email);
 console.log("admin login end ");
        if (data) {
            data.then(function (users) {
                var user = users[0];
            console.log("admin login " +user.user_type);
                var status = helper.compare_password(params.password, user.password);

                if (!status) {
                    res.render("signin", { data: { error: "Password Wrong" } });
                } else {
  
                         req.session.admin = user;

                    res.redirect("/admin/");
                }
            });
        } else {
            res.render("signin", { data: { error: "User not exists" } });
        }
    }
})



router.get('/logout',function(req,res){
  req.session.destroy();
  res.locals.admin="";
  res.locals.user="";
  res.redirect('/admin');
});

router.get('/signup', function (req, res) {
    res.render("signup", { data: {} });
})


router.post("/signup",[
  check('email', 'email is required').isEmail(),
  check('passwd', 'password is required').not().isEmpty(),
  check('confirmPassword') 
  
    // To delete leading and triling space 
    .trim() 
  
    // Validate minimum length of password 
    // Optional for this context 
    // .isLength({min:4, max:6}) 
  
    // // Custom message 
    // .withMessage('Password must be between 4 to 6 characters') 
  
    // Custom validation 
    // Validate confirmPassword 
   .custom(async (confirmPassword, {req}) => { 
      const password = req.body.passwd 
      const repasswd = req.body.repasswd 
  
      // If password and confirm password not same 
      // don't allow to sign up and throw error 
      if(password !== repasswd){ 
        throw new Error('Passwords must be same') 
      } 
    }), 
], function (req, res, next) {

      //check validate data
      const result= validationResult(req);
      var errors = result.errors;
        var user = req.body;
       
    for (var key in errors) {
            console.log(errors[key].value);
      }
          if (!result.isEmpty()) {
          //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("signup", { errors });
          }else{

            // connet to DB
            var hpassword = helper.hash_password(user.passwd);

            user = {
                email: user.email,
                password: hpassword,
                first_name: user.firstname,
                last_name: user.lastname,
                user_type: 'cl'
            };
                console.log(user);
            // add user_md
            var results = user_md.addUser(user);

            results.then((errors) => {
                res.redirect("/admin/signin");
            }).catch((err) => {
                console.log(err);
                res.render("signup", { errors: { error: 'Error' } });
            })




                  }

   
})



//router.get("/products/addidea",function(req,res){
    //res.render("admin/products/addidea");
//});


router.get("/news", function (req, res) {
    if (req.session.admin) {
        // res.json({"message": "This is Admin Page"});
        var data = news_md.getAllNews();
        data.then(function (news) {
            var data = {
                news: news,
                error: false
            };

            res.render("admin/news/list", { data: data });
        }).catch(function (err) {
            res.render("admin/dashboard", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});


router.get("/taluk", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getTaluk();
        console.log(data);
        data.then(function (taluk) {
            var data = {
                taluk:taluk,
                error: false
            };

            res.render("admin/details/taluk", { data: data });
        }).catch(function (err) {
            res.render("admin/details/taluk", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});


router.get("/district", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getDistrict();
        console.log(data);
        data.then(function (district) {
            var data = {
                district:district,
                error: false
            };

            res.render("admin/details/district", { data: data });
        }).catch(function (err) {
            res.render("admin/details/district", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});



router.get("/state", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getState();
        console.log(data);
        data.then(function (state) {
            var data = {
                state:state,
                error: false
            };

            res.render("admin/details/state", { data: data });
        }).catch(function (err) {
            res.render("admin/details/state", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});






router.get("/news/new", function (req, res) {
    if (req.session.admin) {
        res.render("admin/news/new", { data: { error: false } });
    } else {
        res.redirect("/admin/signin");
    }
});


router.post("/news/new", upload.single('image'), async function (req, res) {


    const imagePath = path.join(__dirname, '../../public/image');
    console.log(imagePath);
    const fileUpload = new Resize(imagePath);
    console.log(fileUpload);
      if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
      }
    const filename = await fileUpload.save(req.file.buffer);
      //return res.status(200).json({ name: filename });
   

    var params = req.body;

    if (params.title.trim().length == 0) {
        var data = {
            error: "Please enter a title"
        };

        res.render("admin/news/new", { data: data });
    } else {
        var now = new Date();
        params.image = filename;
        params.created_at = now;
        params.updated_at = now;

        var data = news_md.addNews(params);

        data.then(function (result) {
            res.redirect("/admin/news");
        }).catch(function (err) {
            var data = {
                error: "Could not insert post"
            };

            res.render("admin/news/new", { data: data });
        });
    }
});

router.get("/news/edit/:id", function (req, res) {


    if (req.session.admin) {
        var params = req.params;
        var id = params.id;

        var data = news_md.getNewsByID(id);

        if (data) {
            data.then(function (posts) {
                var post = posts[0];
                var data = {
                    post: post,
                    error: false
                };

                res.render("admin/news/edit", { data: data });
            }).catch(function (err) {
                var data = {
                    error: "Could not get Post by ID"
                };

                res.render("admin/news/edit", { data: data });
            });
        } else {
            var data = {
                error: "Could not get Post by ID"
            };

            res.render("admin/news/edit", { data: data });
        }
    } else {
        res.redirect("/admin/signin");
    }

});

router.put("/news/edit", function (req, res) {
    var params = req.body;

    data = news_md.updatePost(params);

    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        }).catch(function (err) {
            res.json({ status_code: 500 });
        });
    }
});

router.delete("/news/delete", function (req, res) {
    var post_id = req.body.id;

    var data = news_md.deletePost(post_id);

    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        }).catch(function (err) {
            res.json({ status_code: 500 });
        });
    }
});




router.get('/registration', function (req, res) {
    res.render("admin/famreg/registration", { data: {} });
})



router.post("/registration",[
  check('email', 'email is required').not().isEmpty(),
  check('password', 'password  is required').not().isEmpty(),
  check('first_name', 'first name is required').not().isEmpty(),
  check('last_name', 'last name is required').not().isEmpty(),
  check('gender', 'gender is required').not().isEmpty(),
  check('address', 'address is required').not().isEmpty(),
  check('dob', 'date of birth is required').not().isEmpty(),
  check('pno', 'phone number is required').not().isEmpty(),
  
  check('ward', 'ward is required').not().isEmpty(),
  check('pan', 'panchayath is required').not().isEmpty(),
  check('taluk', 'taluk name is required').not().isEmpty(),
  check('dis', 'district is required').not().isEmpty(),
  check('state', 'state is required').not().isEmpty(),
  check('pin', 'pincode is required').not().isEmpty(),
  check('bankno', 'bank number is required').not().isEmpty(),
  check('bankholdername', 'bank holder name is required').not().isEmpty(),
  check('bankifsc', 'bank ifsc is required').not().isEmpty(),
  check('bankdetails', 'bank details is required').not().isEmpty(),
  //check('user', 'user name is required').not().isEmpty(),
  check('password', 'password name is required').not().isEmpty()
 //check('cpass', ' confirm password name is required').not().isEmpty()
    // To delete leading and triling space 
    .trim() 
  
    // Validate minimum length of password 
    // Optional for this context 
    // .isLength({min:4, max:6}) 
  
    // // Custom message 
    // .withMessage('Password must be between 4 to 6 characters') 
  
    // Custom validation 
    // Validate confirmPassword 

], function (req, res, next) {

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
        var subadmin = req.body;
       
    for (var key in errors) {
            console.log(errors[key].value);
      }
      console.log(subadmin);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("admin/famreg/registration", { errors });
          }else{


            // connet to DB
            var hpassword = helper.hash_password(subadmin.password);
            var randval = randomstring.generate({
                length: 10,
                charset: 'numeric'
            });
/*console.log(user.aadhar);
var aadhar = user.aadhar;
var email = user.email;*/

            subadminm = {
                sub_code: randval,
                email: subadmin.email,
                password: hpassword,
                
                first_name: subadmin.first_name,
                last_name: subadmin.last_name,
                
                user_type: 'subad'
            };
             subadd = {
                sub_code: randval,

                gender:subadmin.gender,
                address:subadmin.address,
                dob:subadmin.dob,
                pno:subadmin.pno,
                ward:subadmin.ward,
                pan:subadmin.pan,
                taluk:subadmin.taluk,
                dis:subadmin.dis,
                state:subadmin.state,
                pin:subadmin.pin,
                bankno:subadmin.bankno,
                bankholdername:subadmin.bankholdername,
                bankifsc:subadmin.bankifsc,
                bankdetails:subadmin.bankdetails

             

            };
            console.log(subadd);
            //console.log(user);
            // add user_md
            var results = val_md.addsubadmin(subadminm,subadd);
            console.log(results);
            results.then((errors) => {
                res.redirect("/admin/registration");
            }).catch((err) => {
                console.log(err);
                res.render("admin/famreg/registration", { errors: { error: 'Error' } });
            })

           }

   
})



router.get('/fam_mem_registration/:fid', function (req, res) {
    var params = req.params;
        var fid = params.fid;

    res.render("admin/famreg/fam_reg", { data:fid });
})


router.post("/fam_mem_registration",  async function (req, res, next) {
 var photos = '';

    await multi_upload(req, res);
    //console.log(req.files);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
  var photos = req.files;

   // return res.send(`Files has been uploaded.`);
   //return req;
   var subadmin = req.body;
     var reqFrom = req.session.admin.id;

          var hpassword = helper.hash_password(subadmin.password);
            var randval = randomstring.generate({
                length: 10,
                charset: 'numeric'
            });



    var added_by = req.session.admin.sub_code;
       


            subadminm = {
                fam_code : subadmin.family_code,
                sub_code: randval,
                email: subadmin.email,
                password: hpassword,
                added_by: added_by,
                first_name: subadmin.first_name,
                last_name: subadmin.last_name,
                
                user_type: 'f'
            };
             subadd = {
                sub_code: randval,
                gender:subadmin.gender,
                address:subadmin.address,
                dob:subadmin.dob,
                pno:subadmin.pno,
                ward:subadmin.ward,
                pan:subadmin.pan,
                taluk:subadmin.taluk,
                dis:subadmin.dis,
                state:subadmin.state,
                pin:subadmin.pin,
                bankno:subadmin.bankno,
                bankholdername:subadmin.bankholdername,
                bankifsc:subadmin.bankifsc,
                bankdetails:subadmin.bankdetails
            };
             console.log(subadd);
            //console.log(user);
            // add user_md
            var results = val_md.addFamilyMember(subadminm,subadd,photos);
    
              console.log(results);
            results.then((errors) => {
                res.redirect("/admin/view_members");
            }).catch((err) => {
                console.log(err);
                res.render("admin/famreg/fam_reg", { data:subadmin.family_code ,errors: { error: 'Error' } });
            })
           
          // res.redirect("/admin/samithi_request_added");

   
})



router.post("/fam_mem_registration-old",upload.any(),[
  check('email', 'email is required').not().isEmpty(),
  check('password', 'password  is required').not().isEmpty(),
  check('first_name', 'first name is required').not().isEmpty(),
  check('last_name', 'last name is required').not().isEmpty(),

  check('address', 'address is required').not().isEmpty(),
  check('dob', 'date of birth is required').not().isEmpty(),
  check('pno', 'phone number is required').not().isEmpty()


 //check('cpass', ' confirm password name is required').not().isEmpty()
    // To delete leading and triling space 
    .trim() 
  
    // Validate minimum length of password 
    // Optional for this context 
    // .isLength({min:4, max:6}) 
  
    // // Custom message 
    // .withMessage('Password must be between 4 to 6 characters') 
  
    // Custom validation 
    // Validate confirmPassword 

],  async function (req, res, next) {

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
      var subadmin = req.body;
      
    
    var photos = '';
    await multi_upload(req, res);
    console.log(req.files);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
    var photos = req.files;


    for (var key in errors) {
            console.log(errors[key].value);
      }
      console.log(subadmin);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("admin/famreg/fam_reg", { data:subadmin.family_code,errors });
          }else{


            // connet to DB
            var hpassword = helper.hash_password(subadmin.password);
            var randval = randomstring.generate({
                length: 10,
                charset: 'numeric'
            });

      var added_by = req.session.admin.sub_code;
       


            subadminm = {
                fam_code : subadmin.family_code,
                sub_code: randval,
                email: subadmin.email,
                password: hpassword,
                added_by: added_by,
                first_name: subadmin.first_name,
                last_name: subadmin.last_name,
                
                user_type: 'fm'
            };
             subadd = {
                sub_code: randval,
                gender:subadmin.gender,
                address:subadmin.address,
                dob:subadmin.dob,
                pno:subadmin.pno,
                ward:subadmin.ward,
                pan:subadmin.pan,
                taluk:subadmin.taluk,
                dis:subadmin.dis,
                state:subadmin.state,
                pin:subadmin.pin,
                bankno:subadmin.bankno,
                bankholdername:subadmin.bankholdername,
                bankifsc:subadmin.bankifsc,
                bankdetails:subadmin.bankdetails
            };
             console.log(subadd);
            //console.log(user);
            // add user_md
            var results = val_md.addsubadmin(subadminm,subadd);
            console.log(results);
            results.then((errors) => {
                res.redirect("/admin/view_members");
            }).catch((err) => {
                console.log(err);
                res.render("admin/famreg/fam_reg", { data:subadmin.family_code ,errors: { error: 'Error' } });
            })

           }

   
})


router.get('/member_add', function (req, res) {
    res.render("admin/member/mem_registration", { data: {} });
})


/*
router.post("/mem_registration",[
 
  
  check('first_name', 'first name is required').not().isEmpty(),
  check('last_name', 'last name is required').not().isEmpty(),
  check('gender', 'gender is required').not().isEmpty(),
  check('address', 'address is required').not().isEmpty(),
  check('dob', 'date of birth is required').not().isEmpty(),
  check('pno', 'phone number is required').not().isEmpty(),
   check('email', 'email is required').not().isEmpty(),
  
 check('ward', 'ward is required').not().isEmpty(),
  check('pan', 'panchayath is required').not().isEmpty(),
  check('taluk', 'taluk name is required').not().isEmpty(),
  check('dis', 'district is required').not().isEmpty(),
  check('state', 'state is required').not().isEmpty(),
  check('pin', 'pincode is required').not().isEmpty(),
  check('bankno', 'bank number is required').not().isEmpty(),
  check('bankholdername', 'bank holder name is required').not().isEmpty(),
  check('bankifsc', 'bank ifsc is required').not().isEmpty(),
  check('bankdetails', 'bank details is required').not().isEmpty(),
  //check('user', 'user name is required').not().isEmpty(),
  check('password', 'password name is required').not().isEmpty()
 // check('cpass', ' confirm password name is required').not().isEmpty()
    // To delete leading and triling space 
    .trim() 
  
    // Validate minimum length of password 
    // Optional for this context 
    // .isLength({min:4, max:6}) 
  
    // // Custom message 
    // .withMessage('Password must be between 4 to 6 characters') 
  
    // Custom validation 
    // Validate confirmPassword 
    .custom(async (confirmPassword, {req}) => { 
      const password = req.body.passwd 
      const repasswd = req.body.repasswd 
  
      // If password and confirm password not same 
      // don't allow to sign up and throw error 
      if(password !== repasswd){ 
        throw new Error('Passwords must be same') 
      } 
    }), 

], function (req, res, next) {

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
        var member = req.body;
       
    for (var key in errors) {
            console.log(errors[key].value);
      }
      console.log(member);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("admin/member/mem_registration", { errors });
          }else{

            // connet to DB
            var hpassword = helper.hash_password(member.password);

            var randval = randomstring.generate({
              length: 10,
              charset: 'numeric'
            });

            var added_by = req.session.admin.sub_code;
            membermm = {
                mem_code: randval,
                email: member.email,
                password: hpassword,
                
                first_name: member.first_name,
                last_name: member.last_name,
                added_by: added_by,
                user_type: 'm'
            };
             memadd = {
                mem_code: randval,
                address:member.address,
                dob:member.dob,
                pno:member.pno,
                gender:member.gender,
                ward:member.ward,
                pan:member.pan,
                taluk:member.taluk,
                dis:member.dis,
                state:member.state,
                pin:member.pin,
                bankno:member.bankno,
                bankholdername:member.bankholdername,
                bankifsc:member.bankifsc,
                bankdetails:member.bankdetails,
                googlepay : member.googlepay,  
                phonepe : member.phonepe ,
                paytm : member.paytm
                
                

            };
            var regfee = member.regfee;
            console.log(memadd);
            // add user_md
            var results = reg_md.addMember(membermm,memadd,regfee);
            console.log(results);
            results.then((errors) => {
                res.redirect("/sign");
            }).catch((err) => {
                console.log(err);
                res.render("admin/member/mem_registration", { errors: { error: 'Error' } });
            })

           }

   
})

*/

router.post("/mem_registration",[
 
 
  check('first_name', 'first name is required').not().isEmpty(),
  check('last_name', 'last name is required').not().isEmpty(),
  check('gender', 'gender is required').not().isEmpty(),
  check('address', 'address is required').not().isEmpty(),
  check('dob', 'date of birth is required').not().isEmpty(),
  check('pno', 'phone number is required').not().isEmpty(),
   check('email', 'email is required').not().isEmpty(),
 
 check('ward', 'ward is required').not().isEmpty(),
  check('pan', 'panchayath is required').not().isEmpty(),
  check('taluk', 'taluk name is required').not().isEmpty(),
  check('dis', 'district is required').not().isEmpty(),
  check('state', 'state is required').not().isEmpty(),
  check('pin', 'pincode is required').not().isEmpty(),
  check('bankno', 'bank number is required').not().isEmpty(),
  check('bankholdername', 'bank holder name is required').not().isEmpty(),
  check('bankifsc', 'bank ifsc is required').not().isEmpty(),
  check('bankdetails', 'bank details is required').not().isEmpty(),
  //check('user', 'user name is required').not().isEmpty(),
  check('password', 'password name is required').not().isEmpty()
 // check('cpass', ' confirm password name is required').not().isEmpty()
    // To delete leading and triling space
    .trim()
 
    // Validate minimum length of password
    // Optional for this context
    // .isLength({min:4, max:6})
 
    // // Custom message
    // .withMessage('Password must be between 4 to 6 characters')
 
    // Custom validation
    // Validate confirmPassword
    .custom(async (confirmPassword, {req}) => {
      const password = req.body.passwd
      const repasswd = req.body.repasswd
 
      // If password and confirm password not same
      // don't allow to sign up and throw error
      if(password !== repasswd){
        throw new Error('Passwords must be same')
      }
    }),

], function (req, res, next) {

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
        var member = req.body;
        if (req.session.admin) {
     console.log('logged');
 } else {
        res.redirect("/admin/signin");
    }
    for (var key in errors) {
            console.log(errors[key].value);
      }
      console.log(member);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("admin/member/mem_registration", { errors });
          }else{

            // connet to DB
            var hpassword = helper.hash_password(member.password);

            var randval = randomstring.generate({
              length: 10,
              charset: 'numeric'
            });

            var added_by = req.session.admin.sub_code;
            membermm = {
                mem_code: randval,
                email: member.email,
                password: hpassword,
               
                first_name: member.first_name,
                last_name: member.last_name,
                added_by: added_by,
                user_type: 'm'
            };
             memadd = {
                mem_code: randval,
                address:member.address,
                dob:member.dob,
                pno:member.pno,
                gender:member.gender,
                ward:member.ward,
                pan:member.pan,
                taluk:member.taluk,
                dis:member.dis,
                state:member.state,
                pin:member.pin,
                bankno:member.bankno,
                bankholdername:member.bankholdername,
                bankifsc:member.bankifsc,
                bankdetails:member.bankdetails,
                googlepay : member.googlepay,  
                phonepe : member.phonepe ,
                paytm : member.paytm
               
               

            };
            var regfee = member.regfee;
            console.log(memadd);
            // add user_md
            var results = reg_md.addMember(membermm,memadd,regfee,added_by);
            console.log(results);
            results.then((errors) => {
                res.redirect("/admin/view_members");
            }).catch((err) => {
                console.log(err);
                res.render("admin/member/mem_registration", { errors: { error: 'Error' } });
            })

           }

   
})

router.get('/add_fund', function (req, res) {
    res.render("admin/member/mem_fund", { errors:'',data: {} });
})


router.post("/add_fund",[
 

  //check('user', 'user name is required').not().isEmpty(),
  check('memid', 'Member id is required').not().isEmpty()
 // check('cpass', ' confirm password name is required').not().isEmpty()
    // To delete leading and triling space 
    .trim() 
  
    // Validate minimum length of password 
    // Optional for this context 
    // .isLength({min:4, max:6}) 
  
    // // Custom message 
    // .withMessage('Password must be between 4 to 6 characters') 
  
    // Custom validation 
    // Validate confirmPassword 


], function (req, res, next) {

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
        var member = req.body;

    var memid = req.body.memid;
    var fund = req.body.fund;
    var ddate = req.ddate;
 
    console.log(memid);

        var db = require("../common/database");
        var conn = db.getConnection();

       
    for (var key in errors) {
            console.log(errors[key].value);
      }
      console.log(member);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("admin/member/mem_registration", { errors });
          }else{

           if (memid) {
        conn.query('SELECT * FROM users WHERE mem_code = ? ', [memid], function(error, memresults, fields) {
            console.log(memid);
            if (memresults.length > 0) {
                 console.log(" data is "+ JSON.stringify(memresults[0].id));
                 var u_id = memresults[0].id;

                 // var added_by = req.session.admin.sub_code;
                  var added_by = req.session.admin.sub_code;
           // console.log('samithy id '+ added_by);
           // console.log('all sessionssss '+req.session.admin);
           
            var fund = member.fund;
             fundadd = {
                        amount : fund,
                        u_id:u_id,
                        samithy_id:added_by,
                        deposit_date : ddate,
                        description:'fund'
                   };

            var results = reg_md.addFund(fundadd);
            console.log(results);
          
                // request.session.loggedin = true;
                // request.session.user_name = username;
               res.redirect('/admin/add_fund');
            } else {
                
                console.log('Incorrect Member ID!');
               // res.send('Incorrect Member ID!');
                res.render("admin/member/mem_fund", { errors : 'Incorrect Member ID!' });
            }           
          //  res.end();
        });
    }



           }

   
})



router.get("/fund_statement", function (req, res) {
   // console.log('not logged');
    
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getFund(req.session.admin.id);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/fund_statement", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/fund_statement", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});


router.get("/request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getRequest(district,user_type);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/request", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/request", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});

router.get("/samithi_request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getRequest(district,user_type);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/add_request", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/add_request", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});

router.post("/samithi_req_new",  async function (req, res, next) {
 var photos = '';

    await multi_upload(req, res);
    //console.log(req.files);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
  var photos = req.files;

   // return res.send(`Files has been uploaded.`);
   //return req;
   var formdata = req.body;
     var reqFrom = req.session.admin.id;
            req_needm = {
                memid: formdata.memid,
                bac:formdata.bac,
                title: formdata.title,
                need: formdata.need,
                u_id:reqFrom,
                googlepay : formdata.googlepay,  
                phonepe : formdata.phonepe ,
                paytm : formdata.paytm
               
  
            };
            
            console.log(req_needm);
            // add user_md
            var results = reg_md.addRequest(req_needm,photos);
            //console.log(results);
           
           res.redirect("/admin/samithi_request_added");

   
})


router.get("/samithi_request_added", function (req, res) {
   // console.log('not logged');
    
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getMyrequest(req.session.admin.id);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/my_posted_request", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/my_posted_request", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});



router.get("/shared_request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getFundrequest(req.session.admin.id);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/other_posted_request", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/other_posted_request", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});


router.get("/paid_shared_request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getPaidFundrequest(req.session.admin.id);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/other_posted_request", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/other_posted_request", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});

// 17152-imeet old slider id

router.get("/non_paid_shared_request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getUnPaidFundrequest();
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/other_posted_request", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/other_posted_request", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});


router.get("/request_history", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getAllrequest();
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/requests/all_request", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/all_request", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});



router.get('/aloted_samithi/:r_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var r_id = params.r_id;
 
        var data = val_md.getAloted_samithi_for_request(r_id);
        console.log("req det "+JSON.stringify(data));
        data.then(function (req_details) {
            var data = {
                req_details:req_details,
                error: false
            };

       
            res.render("admin/requests/request_alotted", { data: data });


});
        });

router.get('/upload_fund_slip/:r_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var r_id = params.r_id;

           var db = require("../common/database");
        var conn = db.getConnection();

        var query = conn.query('SELECT * FROM req_need where r_id='+r_id, function(err,req_received ) {
        console.log(query);
       

               // console.log("request from : "+ req_received.u_id);
                console.log(" data is "+ JSON.stringify(req_received[0].u_id));
                res.render('admin/requests/upload_fund_slip', { myVar : r_id,requestby:req_received[0].u_id });
            });
          //  console.log(data);


});



router.post("/upload_fund_slip", upload.single('image'), async function (req, res, next) {

  const imagePath = path.join(__dirname, '../../public/deposit_slip');
    console.log(imagePath);
    const fileUpload = new Resize(imagePath);
    console.log(fileUpload);
      if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
      }
    const filename = await fileUpload.save(req.file.buffer);
      //return res.status(200).json({ name: filename });
   

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
        var posts = req.body;
        var r_id = posts.r_id;
    for (var key in errors) {
            console.log(errors[key].value);
      }
      console.log("errrrrrrrrr"+errors);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("admin/requests/upload_fund_slip", { errors ,myVar : r_id });
          }else{

            // connet to DB  r_by
            var p_r_id= posts.r_id
      //console.log("seeeeee"+req.session.user.id);
      var postFrom = req.session.admin.id;

            postsm = {
                first_name:posts.first_name,
                request:posts.request,
                amt: posts.amt,
                paid_date:posts.paid_date,
                request: posts.r_by,
                image:filename,
                u_id:postFrom 
               
                
                
            };

                   fundadd = {
                        amount : posts.amt,
                        u_id:'0',
                        samithy_id:posts.r_by,
                        description:'sent'
                   };

            var fund_results = reg_md.addFund(fundadd);
            // first_name: posts.first_name,
            //    request: posts.request,
           // console.log(postsm);
            // add user_md
            var results = reg_md.addPosts(postsm,p_r_id);
            console.log(results);
            results.then((errors) => {
                res.redirect("/admin/shared_request/");
            }).catch((err) => {
                console.log(err);
                res.render("admin/requests/upload_fund_slip", { errors: { error: 'Error',myVar : r_id } });
            })

           }

   
})


router.get('/payed', function(req, res) {
  
  var uid = req.session.admin.id;
      //console.log('not logged');
      //if (req.session.user) {
        //console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = reg_md.getAmtpiad(uid);
        console.log(data);
        data.then(function (paid) {
            var data = {
                paid:paid,
                error: false
            };
console.log(JSON.stringify(data));

res.render('admin/requests/paid_statement', { data: data });
})
});


router.get('/paid_slip', function(req, res) {
  
  var uid = req.session.admin.id;
      //console.log('not logged');
      //if (req.session.user) {
        //console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = reg_md.getAllAmtpiad();
        console.log(data);
        data.then(function (paid) {
            var data = {
                paid:paid,
                error: false
            };
console.log(JSON.stringify(data));

res.render('admin/requests/paid_statement', { data: data });
})
});

router.post('/select_member', function (req,res){

  var db = require("../common/database");
        var conn = db.getConnection();
    var mid=  req.body.mid;
    var sql='SELECT  * FROM `users`,user_details where users.id=user_details.u_id and  users.mem_code='+mid;
    //console.log(sql);
    conn.query(sql,function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});// SELECT  * FROM `users`,user_details where users.id=user_details.u_id and  users.mem_code=6801850784

router.get('/req_details/:r_id/:u_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var r_id = params.r_id;
         var u_id = params.u_id;

      console.log("user id "+u_id);
//res.render('web/details/profile',  { myVar : u_id });

        var data = val_md.getReq_details(r_id,u_id);
        console.log("req det "+JSON.stringify(data));
        data.then(function (req_details) {
            var data = {
                req_details:req_details,
                error: false
            };

        var data_photo = val_md.getMyrequestPhotos(r_id);
        console.log("photo det "+JSON.stringify(data_photo));
        data_photo.then(function (req_photo) {
            var data_photo = {
                req_photo:req_photo,
                error: false
            };

            res.render("admin/details/profile", { data: data,data_photo:data_photo });

});
});
        });
 //this post section
/*
router.get('/fund_req_details/:r_id/:u_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var r_id = params.r_id;
        var u_id = params.u_id;

      console.log("user id "+u_id);
//res.render('web/details/profile',  { myVar : u_id });

        var data = val_md.getReq_details(r_id,u_id);
        console.log("req det "+JSON.stringify(data));
        data.then(function (req_details) {
            var data = {
                req_details:req_details,
                error: false
            };

        var data_photo = val_md.````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````getMyrequestPhotos(r_id);
        // console.log("photo det "+JSON.stringify(data_photo));
        data_photo.then(function (req_photo) {
            var data_photo = {
                req_photo:req_photo,
                error: false
            };

            res.render("admin/details/fund_req_details", { data: data,data_photo:data_photo });
           });
        });
        });
});
 //this post section
*/


router.get('/fund_req_details/:r_id/:u_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var r_id = params.r_id;
        var u_id = params.u_id;

      console.log("user id "+u_id);
//res.render('web/details/profile',  { myVar : u_id });

        var data = val_md.getReq_details(r_id,u_id);
        console.log("req det "+JSON.stringify(data));
        data.then(function (req_details) {
            var data = {
                req_details:req_details,
                error: false
            };

        var data_photo = val_md.getMyrequestPhotos(r_id);
        console.log("photo det "+JSON.stringify(data_photo));
        data_photo.then(function (req_photo) {
            var data_photo = {
                req_photo:req_photo,
                error: false
            };

            res.render("admin/details/fund_req_details", { data: data,data_photo:data_photo });

});
});
        });
 //this post section


router.get('/fund_req_other_samithy/:r_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var r_id = params.r_id;
        var u_id = params.u_id;

      console.log("user id "+u_id);
//res.render('web/details/profile',  { myVar : u_id });

var data = val_md.getFund_req_details(r_id);
        console.log("req det "+JSON.stringify(data));
        data.then(function (req_details) {
            var data = {
                req_details:req_details,
                error: false
            };
var data_photo = val_md.getMyrequestPhotos(r_id);
        console.log("photo det "+JSON.stringify(data_photo));
        data_photo.then(function (req_photo) {
            var data_photo = {
                req_photo:req_photo,
                error: false
            };

            res.render("admin/details/oth_fund_req_details", { data: data,data_photo:data_photo });

    });
        });
});
 //this post section


router.post("/profile", async function (req, res, next) {

      //check validate data
        const result = validationResult(req);
        var errors = result.errors;
         var req_details=req.body;
        var status = req.status;
        var authority_id= req.authority_id;
        var r_id= req.r_id;
       /*
 var photos = '';
    await multi_upload(req, res);
    //console.log(req.files);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
  var photos = req.files;
     */  
    for (var key in errors) {
            console.log(errors[key].value);
      }
         // connet to DB
            
   // console.log("sqq"+req.session.admin.id);
      var approval = req.session.admin.id;
      var dis = req.session.admin.dis;
      var user_type = req.session.admin.user_type;
            approvalm = {
                status:'approved',
                authority_id:approval,
                dis:dis,
                user_type:user_type,
                r_id:req.body.r_id,
                 };
            //console.log(" request approved 1"+ JSON.stringify(approvalm));

            var results = val_md.Admin_Approval(approvalm);


             res.redirect("/admin/ver_request");
          
   
})


router.post("/alot_samithi", function (req, res, next) {

      //check validate data
        const result = validationResult(req);
        var errors = result.errors;
    

       
        var req_details=req.body;

        var samithi_id= req_details.samithi;
         var r_id= req_details.r_id;
          var samithi_limit= req_details.smno;

     //  console.log(" selected samithi "+ JSON.stringify(samithi_id));
   // for (var key in errors) {
    //        console.log(errors[key].value);
    //  }
         // connet to DB
            
            console.log("sqq"+req.session.admin.id);
            var approval = req.session.admin.id;
            var dis = req.session.admin.dis;
            var user_type = req.session.admin.user_type;
            var db = require("../common/database");
            var conn = db.getConnection();

               conn.query('SELECT users. *,users.id,COUNT(aloted_request.u_id) as cuid FROM users LEFT JOIN aloted_request ON users.id=aloted_request.u_id  WHERE users.user_type="subad"GROUP BY `users`.`id` ORDER BY cuid ASC limit '+samithi_limit,  function(error, pdt, fields) {
      
     
    // var ab=bib_starting;
          Object.keys(pdt).forEach(function(key){
            var row = pdt[key];
            var samithi_id =  pdt[key].id;
  
 //console.log("samithi id is "+ champ);
     
         //  console.log(ab);
         //   var q2 = {
         //   bib_number : ab
         //   };

        //  console.log('UPDATE event_reg SET ? WHERE bib_number = ?',[ {bib_number: ab}]);  
              alotment = {
                        r_id:r_id,
                        u_id:samithi_id,
             
                    };
         var query = conn.query('INSERT INTO aloted_request SET ?', alotment, function(err,req_received ) {
   // conn.query('UPDATE event_reg SET ? WHERE champ_id = ? and district = ? and s_no = ?', [{bib_number: ab}, champ,district,slno], function(err, result) {
        //if (err) throw err;
        //response.redirect('/login');
          });
 //ab++;
       
           
            });
        });

/*
            var i;
                       samithi_id.forEach(function(samithi_id){

                    console.log('samithi = '+ samithi_id);
                         var params = req.params;
       

         
         alotment = {
                        r_id:r_id,
                        u_id:samithi_id,
             
                    };
        var query = conn.query('INSERT INTO aloted_request SET ?', alotment, function(err,req_received ) {
               console.log(query);
       

               // console.log("request from : "+ req_received.u_id);
              //  console.log(" data is "+ JSON.stringify(req_received[0].u_id));
               // res.render('web/profiles/posts', { myVar : r_id,requestby:req_received[0].u_id });
            });
                });
                       */

          //  var results = val_md.addApproval(approvalm);
             res.redirect("/admin/request");
          
   
})

router.get("/admin_ver_request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
       // var approved = req.session.admin.status;
        var user_type = req.session.admin.user_type;
        var user_id = req.session.admin.id;
        // res.json({"message": "This is Admin Page"});
        console.log("approved : "+user_type);
        var data = val_md.getAdmVerified(district,user_type,user_id);
        console.log(data);
        data.then(function (ver_request) {
            var data = {
                ver_request:ver_request,

                error: false
            };

            res.render("admin/requests/adm_ver_req", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/adm_ver_req", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});



router.get('/req_allotment/:r_id/:u_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var r_id = params.r_id;
         var u_id = params.u_id;

      console.log("user id "+u_id);
//res.render('web/details/profile',  { myVar : u_id });

var data = val_md.getReq_details(r_id,u_id);
var sdata = val_md.getSamithi();

       
         sdata.then(function (samithi) {
            var sdata = {
                samithi:samithi,
                error: false
            };

        data.then(function (req_details) {
            var data = {
                req_details:req_details,
                error: false
            };
 console.log("samithi list "+JSON.stringify(sdata));
            res.render("admin/details/alotment", { data: data, sdata: sdata });
         });
        });
});
 //this post section



router.get("/ver_request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
       // var approved = req.session.admin.status;
        var user_type = req.session.admin.user_type;
        var user_id = req.session.admin.id;
        // res.json({"message": "This is Admin Page"});
        console.log("approved : "+user_type);
        var data = val_md.getVerified(district,user_type,user_id);
        console.log(data);
        data.then(function (ver_request) {
            var data = {
                ver_request:ver_request,
                error: false
            };

            res.render("admin/requests/ver_req", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/ver_req", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});

router.get("/unver_request", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getUnverified(district,user_type);
        console.log(data);
        data.then(function (unver_request) {
            var data = {
                unver_request:unver_request,
                error: false
            };

            res.render("admin/requests/unver_req", { data: data });
        }).catch(function (err) {
            res.render("admin/requests/unver_req", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});


router.get('/fam_reg', function(req, res) {
  // console.log('hello world');
res.render('admin/famreg/fam_reg');

});

router.post("/fam_reg",[
 
  
  check('first_name', 'first name is required').not().isEmpty(),
  check('last_name', 'last name is required').not().isEmpty(),
  //check('gender', 'gender is required').not().isEmpty(),
  check('address', 'address is required').not().isEmpty(),
  check('dob', 'date of birth is required').not().isEmpty(),
  check('pno', 'phone number is required').not().isEmpty(),
   check('email', 'email is required').not().isEmpty(),
  
 /* check('ward', 'ward is required').not().isEmpty(),
  check('pan', 'panchayath is required').not().isEmpty(),
  check('taluk', 'taluk name is required').not().isEmpty(),
  check('dis', 'district is required').not().isEmpty(),
  check('state', 'state is required').not().isEmpty(),
  check('pin', 'pincode is required').not().isEmpty(),
  check('bankno', 'bank number is required').not().isEmpty(),
  check('bankholdername', 'bank holder name is required').not().isEmpty(),
  check('bankifsc', 'bank ifsc is required').not().isEmpty(),
  check('bankdetails', 'bank details is required').not().isEmpty(),*/
  //check('user', 'user name is required').not().isEmpty(),
  check('password', 'password name is required').not().isEmpty()
 // check('cpass', ' confirm password name is required').not().isEmpty()
    // To delete leading and triling space 
    .trim() 
  
    // Validate minimum length of password 
    // Optional for this context 
    // .isLength({min:4, max:6}) 
  
    // // Custom message 
    // .withMessage('Password must be between 4 to 6 characters') 
  
    // Custom validation 
    // Validate confirmPassword 
    .custom(async (confirmPassword, {req}) => { 
      const password = req.body.passwd 
      const repasswd = req.body.repasswd 
  
      // If password and confirm password not same 
      // don't allow to sign up and throw error 
      if(password !== repasswd){ 
        throw new Error('Passwords must be same') 
      } 
    }), 

], function (req, res, next) {

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
        var fam = req.body;
       
    for (var key in errors) {
            console.log(errors[key].value);
      }
      console.log(fam);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("admin/famreg/fam_reg", { errors });
          }else{
var randval = randomstring.generate({
              length: 10,
              charset: 'numeric'
            });
            // connet to DB
            var hpassword = helper.hash_password(fam.password);


            famm = {
                fam_code: randval,
                email: fam.email,
                password: hpassword,
                
                first_name: fam.first_name,
                last_name: fam.last_name,
                
                user_type: 'f'
            };
             famadd = {
                fam_code: randval,

                address:fam.address,

                dob:fam.dob,
                pno:fam.pno
                

            };
            //console.log(user);
            // add user_md
            var results = reg_md.addFamMember(famm,famadd);
            console.log(results);
            results.then((errors) => {
                res.redirect("/userhome");
            }).catch((err) => {
                console.log(err);
                res.render("admin/famreg/fam_reg", { errors: { error: 'Error' } });
            })

           }

   
})


router.get("/view_members", function (req, res) {
    console.log('not logged');
    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        var added = req.session.admin.sub_code;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getMembers(added);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/member/member_list", { data: data });
        }).catch(function (err) {
            res.render("admin/member/member_list", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});

// '/req_allotment/:r_id/:u_id'
router.get("/family/:f_code", function (req, res) {
    console.log('not logged');

     var params = req.params;
        var f_code = params.f_code;

    if (req.session.admin) {
        console.log('logged');
        var district = req.session.admin.dis;
        
        var user_type = req.session.admin.user_type;
        // res.json({"message": "This is Admin Page"});
        var data = val_md.getFamily_Members(f_code);
        console.log(data);
        data.then(function (request) {
            var data = {
                request:request,
                error: false
            };

            res.render("admin/member/family_member_list", { data: data });
        }).catch(function (err) {
            res.render("admin/member/family_member_list", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
});



router.get('/profile_details/:u_id', function(req, res) {
  // console.log('hello world');
       // console.log(params);
        var params = req.params;
        var u_id = params.u_id;

      console.log("user id "+u_id);
//res.render('web/details/profile',  { myVar : u_id });

        var data = val_md.getProfile_details(u_id);
        console.log("req det "+JSON.stringify(data));
        data.then(function (req_details) {
            var data = {
                req_details:req_details,
                error: false
            };

        var data_photo = val_md.getProofPhotos(u_id);
        console.log("photo det "+JSON.stringify(data_photo));
        data_photo.then(function (proof_photo) {
            var data_photo = {
                proof_photo:proof_photo,
                error: false
            };

            res.render("admin/details/profile_details", { data: data,data_photo:data_photo });

});
});
        });
 //this post section



module.exports = router;

