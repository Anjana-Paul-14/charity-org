var express = require("express");
var router = express.Router();
const {check,validationResult} = require('express-validator');

const path = require('path');
const upload = require('../uploadMiddleware');
const Resize = require('../Resize');
const multi_upload = require("../middleware/upload");

var reg_md = require('../models/reg');
var user_md = require('../models/user');

var randomstring = require("randomstring");

var helper = require("../helpers/helper");
var val_md = require('../models/val');


router.get('/', function(req, res) {
  // //console.log('hello world');
  res.render('web/home');

});


router.post("/req_new",  async function (req, res, next) {
 var photos = '';

    await multi_upload(req, res);
    ////console.log(req.files);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
  var photos = req.files;

   // return res.send(`Files has been uploaded.`);
   //return req;
   var formdata = req.body;
     var reqFrom = req.session.user.id;
            req_needm = {
 
                first_name: formdata.title,
                need: formdata.need,
                u_id:reqFrom,
               
  
            };
            
            //console.log(req_needm);
            // add user_md
            var results = reg_md.addRequest(req_needm,photos);
            ////console.log(results);
           
           

   
})

router.get('/about', function(req, res) {
  // //console.log('hello world');
res.render('web/f_web/about');

});
router.get('/gallery', function(req, res) {
  // //console.log('hello world');
res.render('web/f_web/gallery');

});
router.get('/contact', function(req, res) {
  // //console.log('hello world');
res.render('web/f_web/contact');

});

//router.get('/about', function(req, res) {
   // //console.log('hello world');
//res.render('web/about');

//});
/*router.get('/company', function(req, res) {
 //  //console.log('hello world');
res.render('web/company');

});*/

router.get('/projects', function(req, res) {
  // //console.log('hello world');
res.render('web/projects');

});
router.get('/profiles', function(req, res) {
  // //console.log('hello world');
res.render('web/profiles/profiles');

});

router.get('/user_profile', function(req, res) {
  // //console.log('hello world');
res.render('web/profiles/user_profile');

});
/*router.get('/userhome', function(req, res) {
  // //console.log('hello world');
res.render('web/profiles/userhome');

});*/

router.get('/message', function(req, res) {
  // //console.log('hello world');
res.render('web/message');

});
/*
router.get('/posts/:r_id', function(req, res) {
  // //console.log('hello world');
       // //console.log(params);
        var params = req.params;
        var r_id = params.r_id;

           var db = require("../common/database");
        var conn = db.getConnection();

        var query = conn.query('SELECT * FROM req_need where r_id='+r_id, function(err,req_received ) {
        ////console.log(query);
       

               // //console.log("request from : "+ req_received.u_id);
               // //console.log(" data is "+ JSON.stringify(req_received[0].u_id));
                res.render('web/profiles/posts', { myVar : r_id,requestby:req_received[0].u_id });
            });
          //  //console.log(data);


});
*/
router.get('/groups', function(req, res) {
  // //console.log('hello world');
if (req.session.user) {
//res.render('web/profiles/groups');
var data = reg_md.getGroups();
data.then(function (groups) {
            var data = {
                groups:groups,
                error: false
            };
            res.render("web/profiles/groups", { data: data });
        }).catch(function (err) {
            res.render("web/profiles/groups", { data: { error: "Get Post data is Error" } });
        });
        } else {
        res.redirect("userhome");
    }
});

/*router.get("/groups", function (req, res) {
    ////console.log('not logged');
    if (req.session.user) {
        ////console.log('logged');
        // res.json({"message": "This is Admin Page"});
         var gdata = reg_md.getGroups();
        var data = reg_md.getGroups();
        ////console.log(data);
           var rdata = reg_md.getRequests();
   
     
        rdata.then(function (requests_data) {
            var rdata = {
                requests_data: requests_data,
                error: false
            };
         gdata.then(function (groups) {
            var gdata = {
                groups:groups,
                error: false
            };

        data.then(function (groups) {
            var data = {
                groups:groups,
                error: false
            };

            res.render("web/profiles/groups", { data: data,gdata:gdata,rdata:rdata });
        }).catch(function (err) {
            res.render("web/profiles/groups", { data: { error: "Get Post data is Error" } });
        });
         });
          });
    } else {
        res.redirect("userhome");
    }
});
*/
router.get('/payments', function(req, res) {
  // //console.log('hello world');
res.render('web/payments');

});

router.get('/requests', function(req, res) {
  // //console.log('hello world');
res.render('web/requests/requests');

});

router.get('/req_need', function(req, res) {
  // //console.log('hello world');  
res.render('web/requests/req_need');

});

/*router.get('/req_received', function(req, res) {
  // //console.log('hello world');
//console.log('not logged');
    if (req.session.cust) {
        //console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = reg_md.getRequests();
        //console.log(data);
        data.then(function (req_received) {
            var data = {
                req_received:req_received,
                error: false
            };

            res.render("web/requests/req_received", { data: data });
        }).catch(function (err) {
            res.render("web/requests/req_received", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("userhome");
    }
});*/
router.get("/req_received", function (req, res) {
    if (req.session.user) {
      var uid = req.session.user.u_id;
        // res.json({"message": "This is Admin Page"});
       
       // //console.log(id);
       //  var data = advw_md.getprofile(id);
        //var data = news_md.getAllNews();
        var db = require("../common/database");
        var conn = db.getConnection();

        var query = conn.query('SELECT * FROM req_need ', function(err,req_received ) {
        //console.log(query);
        if(err){
           // defer.reject(err);
        }else{

                //console.log("profile resutl : "+ req_received);
                //console.log(" data is "+ JSON.stringify(req_received));
               // var gdata = reg_md.getGroups();
        var data = reg_md.getGroups();
        //console.log(data);
           //var rdata = reg_md.getRequests();
   
     
        /*rdata.then(function (requests_data) {
            var rdata = {
                requests_data: requests_data,
                error: false
            };
         gdata.then(function (groups) {
            var gdata = {
                groups:groups,
                error: false
            };*/

        data.then(function (groups) {
            var data = {
                groups:groups,
                error: false
            };

            res.render("web/requests/req_received", { data: req_received });
      });
       // });
       //  });
               // res.render("web/requests/req_received", { data: req_received });
        }
    });
       
    } else {
        res.redirect("req_received");
    }
});


router.get('/samithy_signup', function (req, res) {
    res.render("web/samithy_signup", { data: {} });
})



router.post("/samithy_signup",[
  check('email', 'email is required').not().isEmpty(),
  check('password', 'password  is required').not().isEmpty(),
  check('first_name', 'first name is required').not().isEmpty(),

  check('address', 'address is required').not().isEmpty(),
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
            //console.log(errors[key].value);
      }
      //console.log(subadmin);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/samithy_signup", { errors });
          }else{


            // connet to DB
            var hpassword = helper.hash_password(subadmin.password);
            var randval = randomstring.generate({
                length: 10,
                charset: 'numeric'
            });
/*//console.log(user.aadhar);
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

       
                address:subadmin.address,
               
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
            ////console.log(subadd);
            ////console.log(user);
            // add user_md
            var results = val_md.addsubadmin(subadminm,subadd);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/admin/signin");
            }).catch((err) => {
                //console.log(err);
                res.render("web/samithy_signup", { errors: { error: 'Error' } });
            })

           }

   
})



router.get('/registration', function (req, res) {
    res.render("web/registration", { data: {} });
})



router.post("/registration",[
 
  
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
            //console.log(errors[key].value);
      }
      //console.log(member);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/registration", { errors });
          }else{

            // connet to DB
            var hpassword = helper.hash_password(member.password);

            var randval = randomstring.generate({
              length: 10,
              charset: 'numeric'
            });


            membermm = {
                mem_code: randval,
                email: member.email,
                password: hpassword,
                
                first_name: member.first_name,
                last_name: member.last_name,
                
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
                bankdetails:member.bankdetails
                
                

            };
            //console.log(memadd);
            // add user_md
            var results = reg_md.addMember(membermm,memadd);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/sign");
            }).catch((err) => {
                //console.log(err);
                res.render("web/registration", { errors: { error: 'Error' } });
            })

           }

   
})


router.get('/sign', function (req, res) {
    res.render("web/signin", { data: {} });
})


router.post("/sign", function (req, res) {
    var params = req.body;

    if (params.email.trim().length == 0) {
        res.render("web/signin", { data: { error: "Please enter an email" } });
       
    } else {

        var data = user_md.getUserByEmail(params.email);

        if (data) {
            data.then(function (users) {
                var user = users[0];

                var status = helper.compare_password(params.password, user.password);

                if (!status) {
                    res.render("web/signin", { data: { error: "Password Wrong" } });
                } else {
                    
                    //console.log("userdetails"+user);
                    //console.log("ss"+user.user_type);
                    if(user.user_type=='cl')
                    {
                      req.session.admin = user;
                      res.redirect("/admin/index");
                    }
                    else if(user.user_type=='subad')
                    {
                      req.session.admin = user;
                      res.redirect("/admin/index");
                    }
                    else if(user.user_type=='m')
                    {
                      req.session.user = user;
                      res.redirect("/userhome");
                    }
                     //console.log(user);

                    
                }
            });
        } else {
            res.render("web/signin", { data: { error: "User not exists" } });
        }
    }
})
/*router.get('/registrationweb', function (req, res) {
    res.render("web/registrationweb", { data: {} });
})



router.post("/registrationweb",[
 
  
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
            //console.log(errors[key].value);
      }
      //console.log(member);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/registrationweb", { errors });
          }else{

            // connet to DB
            var hpassword = helper.hash_password(member.password);

            var randval = randomstring.generate({
              length: 10,
              charset: 'numeric'
            });


            membermm = {
                mem_code: randval,
                email: member.email,
                password: hpassword,
                
                first_name: member.first_name,
                last_name: member.last_name,
                
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
                bankdetails:member.bankdetails
                
                

            };
            //console.log(memadd);
            // add user_md
            var results = reg_md.addMember(membermm,memadd);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/sign");
            }).catch((err) => {
                //console.log(err);
                res.render("web/registrationweb", { errors: { error: 'Error' } });
            })

           }

   
})

*/

router.get('/fam_reg', function(req, res) {
  // //console.log('hello world');
res.render('web/profiles/fam_reg');

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
            //console.log(errors[key].value);
      }
      //console.log(fam);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/profiles/fam_reg", { errors });
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
            ////console.log(user);
            // add user_md
            var results = reg_md.addFamMember(famm,famadd);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/userhome");
            }).catch((err) => {
                //console.log(err);
                res.render("web/profiles/fam_reg", { errors: { error: 'Error' } });
            })

           }

   
})


router.post("/req_need", upload.single('image'), async function (req, res, next) {

  const imagePath = path.join(__dirname, '../../public/helpPhoto');
    //console.log(imagePath);
    const fileUpload = new Resize(imagePath);
    //console.log(fileUpload);
      if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
      }
    const filename = await fileUpload.save(req.file.buffer);
      //return res.status(200).json({ name: filename });
//console.log(filename);

      //check validate data
      const result = validationResult(req);
      var errors = result.errors;
        var request = req.body;
       
    for (var key in errors) {
            //console.log(errors[key].value);
      }
     // //console.log(request);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/requests/req_need", { errors });
          }else{

            // connet to DB
            
       //console.log("seeeeee"+req.session.user.id);
      var reqFrom = req.session.user.id;
            req_needm = {
                
                
                
                
                first_name: request.first_name,
                need: request.need,
                u_id:reqFrom,
                image:filename,
              
                
                
            };
            
            ////console.log(req_needm);
            // add user_md
            var results = reg_md.addRequest(req_needm);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/userhome");
            }).catch((err) => {
                //console.log(err);
                res.render("web/requests/req_need", { errors: { error: 'Error' } });
            })

           }

   
})
/*
router.get('/posts', function(req, res) {
  // //console.log('hello world');
  var params = req.params;
        var r_id = params.r_id;
res.render('web/profiles/posts', { myVar : r_id });

});


router.post("/posts", upload.single('image'), async function (req, res, next) {

  const imagePath = path.join(__dirname, '../../public/posts');
    //console.log(imagePath);
    const fileUpload = new Resize(imagePath);
    //console.log(fileUpload);
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
            //console.log(errors[key].value);
      }
      //console.log("errrrrrrrrr"+errors);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/profiles/posts", { errors ,myVar : r_id });
          }else{

            // connet to DB  r_by
            
      ////console.log("seeeeee"+req.session.user.id);
      var postFrom = req.session.user.id;

            postsm = {
              first_name: posts.first_name,
                request: posts.request,
                amt: posts.amt,
                paid_date:posts.paid_date,
              
                image:filename,
                u_id:postFrom 
                
                
            };
            // first_name: posts.first_name,
            //    request: posts.request,
           // //console.log(postsm);
            // add user_md
            var results = reg_md.addPosts(postsm);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/userhome");
            }).catch((err) => {
                //console.log(err);
                res.render("web/profiles/posts", { errors: { error: 'Error' } });
            })

           }

   
})

*/
router.get("/userhome", function (req, res) {
    //console.log('not logged');
    ////console.log(req.session.user);
    if (req.session.user) {
        //console.log('logged');
        var id = req.session.user.u_id;
        // res.json({"message": "This is Admin Page"});
        var data = reg_md.getPosts(id);
        //console.log("id is"+id);
        ////console.log(data);
        data.then(function (userhome) {
            var data = {
                userhome:userhome,
                error: false
            };

  var gdata = reg_md.getGroups();

      ////console.log("cart count : " +  JSON.stringify(cartitem));
   ////console.log('ccccccccc'+cart_count);
   var rdata = reg_md.getRequests();
   
     
        /*rdata.then(function (requests_data) {
            var rdata = {
                requests_data: requests_data,
                error: false
            };
        gdata.then(function (groups) {
            var gdata = {
                groups:groups,
                error: false
            };
//console.log("grup : " +  JSON.stringify(gdata));
//console.log("requests : " +  JSON.stringify(rdata));*/
            res.render("web/profiles/userhome", { data: data,gdata: gdata,rdata : rdata });
       
        });
        //});
        //});
        

    } else {
        res.redirect("/sign");
    }
});

/*
router.get('/fund_statement', function(req, res) {
  
  var uid = req.session.user.id;
      ////console.log('not logged');
      //if (req.session.user) {
        ////console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = reg_md.getAmtpiad(uid);
        //console.log(data);
        data.then(function (paid) {
            var data = {
                paid:paid,
                error: false
            };
console.log(JSON.stringify(data));

res.render('web/payement/fund_statement', { data: data });
})
});
*/
router.get('/received', function(req, res) {
var uid = req.session.user.id;
      ////console.log('not logged');
      //if (req.session.user) {
        ////console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = reg_md.getAmtrec(uid);
        //console.log(data);
        data.then(function (received) {
            var data = {
                received:received,
                error: false
            };
//console.log(JSON.stringify(data));
            res.render("web/payement/received", { data: data });
        }).catch(function (err) {
            res.render("web/payement/received", { data: { error: "Get Post data is Error" } });
        });
   // } 
   
  // //console.log('hello world');


});


router.get('/group_form', function(req, res) {
  // //console.log('hello world');
    //console.log('not logged');
    if (req.session.user) {
        //console.log('logged');
        // res.json({"message": "This is Admin Page"});
        var data = reg_md.getMemberlist();
        //console.log(data);
        var myJSON = JSON.stringify(data);
        //console.log("rrrr"+myJSON);
        data.then(function (gpmem) {
            var data = {
                gpmem:gpmem,
                error: false
            };

            res.render("web/profiles/group_form", { data: data });
        }).catch(function (err) {
            res.render("web/profiles/group_form", { data: { error: "Get Post data is Error" } });
        });
    } else {
        res.redirect("userhome");
    }
});

router.post("/group_form",[
 
  
  check('gp_name', 'first name is required').not().isEmpty()
  
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
        var gp = req.body;
       
    for (var key in errors) {
            //console.log(errors[key].value);
      }
      //console.log(gp);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/profiles/group_form", { errors });
          }else{
var randval = randomstring.generate({
              length: 10,
              charset: 'numeric'
            });
            // connet to DB
            
            

            gpm = {
                
                
                
                
                gp_name: gp.gp_name,
               
                gp_code:randval
                
                
            };
            
            ////console.log(user);
            // add user_md
            var results = reg_md.addGroup(gpm);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/userhome");
            }).catch((err) => {
                //console.log(err);
                res.render("web/profiles/group_form", { errors: { error: 'Error' } });
            })

           }

   
})
/*
router.get('/addMember', function(req, res) {
     //var gdata = reg_md.getGroups();
//console.log(" data is "+ JSON.stringify(gdata));
        /*var data = reg_md.getGroups();
        //console.log(data);
           var rdata = reg_md.getRequests();
   
     
        rdata.then(function (requests_data) {
            var rdata = {
                requests_data: requests_data,
                error: false
            };
         
        data.then(function (groups) {
            var data = {
                groups:groups,
                error: false
            };

            res.render("web/profiles/addmember", { data:'',rdata:'' });
      });
        });
         });
        
//res.render('web/profiles/addmember');
*/
router.get('/add', function(req, res) {
  // //console.log('hello world');
res.render('web/profiles/addmember');

});

router.post("/addMember",[
  
  check('gp_code', 'first name is required').not().isEmpty(),
  check('gp_member_id', 'first name is required').not().isEmpty()
  
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
    var params = req.body;
console.log(params);
    if (params.gp_code.trim().length == 0) {
        res.render("web/profiles/addmember", { data: { error: "Please enter the group code" } });
       
    } else {
        var data = reg_md.getUserByGpcode(params.gp_code);

        if (data) {
            data.then(function (group_form) {
                var user = users[0];    
            });
        } else {
            res.render("web/profiles/addmember", { data: { error: "User not exists" } });
        }
    }

      const result = validationResult(req);
      var errors = result.errors;
        var mem = req.body;
       
    for (var key in errors) {
            //console.log(errors[key].value);
      }
      //console.log(mem);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/profiles/addmember", { errors });
          }else{
            // connet to DB
            mm = {
              
                gp_code: mem.gp_code,
                gp_member_id:mem.gp_member_id  

                }; 
            ////console.log(user);
            // add user_md
            var results = reg_md.addGpmem(mm);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/userhome");
            }).catch((err) => {
                //console.log(err);
                res.render("web/profiles/addmember", { errors: { error: 'Error' } });
            })
           }  



    
})

router.get('/join_gp', function(req, res) {
  // //console.log('hello world');
   var gdata = reg_md.getGroups();
        var data = reg_md.getGroups();
        //console.log(data);
           var rdata = reg_md.getRequests();
   
     
        rdata.then(function (requests_data) {
            var rdata = {
                requests_data: requests_data,
                error: false
            };
         gdata.then(function (groups) {
            var gdata = {
                groups:groups,
                error: false
            };

   res.render("web/profiles/join_gp", {gdata:gdata,rdata:rdata });
});
         });

});

router.get('/join_group/:gid', function(req, res) {
  var gid = req.params.gid;
  // //console.log('hello world');
   var gdata = reg_md.getGroups();
        var data = reg_md.getGroups();
        //console.log(data);
           var rdata = reg_md.getRequests();
   
     
        rdata.then(function (requests_data) {
            var rdata = {
                requests_data: requests_data,
                error: false
            };
         gdata.then(function (groups) {
            var gdata = {
                groups:groups,
                error: false
            };

   res.render("web/profiles/join_gp", {gdata:gdata,rdata:rdata,gid:gid });
});
         });
        
});

router.post("/join_gp",[
 
  
  check('gp_code', 'first name is required').not().isEmpty(),
  check('gp_member_id', 'first name is required').not().isEmpty()
  
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
        var group = req.body;
       
    for (var key in errors) {
            //console.log(errors[key].value);
      }
      //console.log(group);
          if (!result.isEmpty()) {
            //response validate data to register.ejs
            // res.render('signup', { data:{  error: errors }  })
              res.render("web/profiles/join_gp", { errors });
          }else{

            // connet to DB
            
            

            groupm = {
                
                
                
                
                gp_code: group.gp_code,
                gp_member_id:group.gp_member_id
                
                
                
            };
            
            ////console.log(user);
            // add user_md
            var results = reg_md.joinGroup(groupm);
            //console.log(results);
            results.then((errors) => {
                res.redirect("/userhome");
            }).catch((err) => {
                //console.log(err);
                res.render("web/profiles/join_gp", { errors: { error: 'Error' } });
            })

           }

   
})


router.get('/logout',function(req,res){
  req.session.destroy();
  res.locals.member="0";
  res.redirect('/');
});





module.exports = router;