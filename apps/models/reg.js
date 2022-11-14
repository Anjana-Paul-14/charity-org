var db = require("../common/database");
var q = require('q');

var conn = db.getConnection();
/*
function regist(reg) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO m_registration SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}
*/



function addFund(fund) {

    if (fund) {
        var defer = q.defer();

             
            
                var query = conn.query('INSERT INTO fund_statement SET ?', fund, function (err, result) {
                    //console.log(query);
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(result);
                        
                    }
                });


             
              
        

        return defer.promise;
    }
    return false;
}

/*function addMember(reg,member_details,regfee) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO users SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
               // defer.resolve(result);
                var u_id = result.insertId;
                var added_by = locals.admin.sub_code;
                 feeadd = {
                        amount : regfee,
                        u_id:u_id,
                        samithy_id:added_by,
                        description:'regfee'
                   };
             
            
                var query = conn.query('INSERT INTO fund_statement SET ?', feeadd, function (err, result) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(result);
                        
                    }
                });


                    memadd = {
                    

                mem_code: member_details.mem_code,
                       
                u_id:u_id,
                address:member_details.address,

                dob:member_details.dob,
                gender:member_details.gender,
                pno:member_details.pno,
                ward:member_details.ward,
                pan:member_details.pan,
                taluk:member_details.taluk,
                dis:member_details.dis,
                state:member_details.state,
                pin:member_details.pin,
                bankno:member_details.bankno,
                bankholdername:member_details.bankholdername,
                bankifsc:member_details.bankifsc,
                bankdetails:member_details.bankdetails
                

                    };
             
                      
                        ////console.log(memadd);
         
                 var query = conn.query('INSERT INTO user_details SET ?', memadd, function (err, result) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(result);
                        
                    }
                });
            }
        });

        return defer.promise;
    }
    return false;
}*/
function addMember(reg,member_details,regfee,added_by) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO users SET ?', reg, function (err, result) {
            console.log(query);
            if (err) {
                defer.reject(err);
            } else {
               // defer.resolve(result);
                var u_id = result.insertId;
               // var added_by = locals.admin.sub_code;
                 feeadd = {
                        amount : regfee,
                        u_id:u_id,
                        samithy_id:added_by,
                        description:'regfee'
                   };
             
           
                var query = conn.query('INSERT INTO fund_statement SET ?', feeadd, function (err, result) {
                    //console.log(query);
                    if (err) {

                        defer.reject(err);
                    } else {
                        defer.resolve(result);
                       
                    }
                });


                    memadd = {
                   

                mem_code: member_details.mem_code,
                       
                u_id:u_id,
                address:member_details.address,

                dob:member_details.dob,
                gender:member_details.gender,
                pno:member_details.pno,
                ward:member_details.ward,
                pan:member_details.pan,
                taluk:member_details.taluk,
                dis:member_details.dis,
                state:member_details.state,
                pin:member_details.pin,
                bankno:member_details.bankno,
                bankholdername:member_details.bankholdername,
                bankifsc:member_details.bankifsc,
                bankdetails:member_details.bankdetails
               

                    };
             
                     
                        //console.log(memadd);
         
                 var query = conn.query('INSERT INTO user_details SET ?', memadd, function (err, result) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(result);
                       
                    }
                });
            }
        });

        return defer.promise;
    }
    return false;
}

function addFamMember(reg,fmember_details) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO users SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
               // defer.resolve(result);
                var fam_code = result.insertId;
            

                    famadd = {
                    

                        fam_code: fmember_details.fam_code,
                        

                address:fmember_details.address,

                dob:fmember_details.dob,
                pno:fmember_details.pno
                

                    };
             
                      
                        ////console.log(famadd);
         
                 var query = conn.query('INSERT INTO user_details SET ?', famadd, function (err, result) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(result);
                        
                    }
                });
            }
        });

        return defer.promise;
    }
    return false;
}

function addRequest(reg,photo) {

    // //console.log('kkkkkkkkkkkkkkll'+photo.filename);
      //console.log(" data is "+ JSON.stringify(photo));
     

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO req_need SET ?', reg, function (err, result) {
            //console.log(query);
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
                 var r_id = result.insertId;

                   photo.forEach(function(photo){
                    
                        //console.log('event reg id det = '+ photo.filename);
                         req_photo = {
 
                                r_id: r_id,
                                image: photo.filename,
                                                             
                  
                            };
                        // insert query
                         var query1 = conn.query('INSERT INTO request_photos SET ?', req_photo, function (err, result) {
                                    if (err) {
                                        defer.reject(err);
                                    } else {
                                        defer.resolve(result);
                                    }
                                });
                        // insert query end
                    });
            }
        });

        return defer.promise;
    }
    return false;
    
}

function addGroup(reg) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO group_form SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}

function addGpmem(reg) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO gp_members SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}


function joinGroup(reg) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO gp_members SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}

/*
function addPosts(reg,r_id) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO posts SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
           var request_id = r_id;
                var query1 = conn.query('UPDATE aloted_request SET payment = "y" WHERE r_id = ?',
                     [request_id], function (err, result) {
                        //console.log(query1);
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

               // defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}
*/
function addPosts(reg) {

    if (reg) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO posts SET ?', reg, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}

function addUser(user) {

    if (user) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO users SET ?', user, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}

function getUserByEmail(email) {
    if (email) {
        var defer = q.defer();

        var query = conn.query('SELECT * FROM users WHERE ?', { email: email }, function (err, result) {
            //console.log(query);
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }

    return false;
}

function getUserByGpcode(gp_code) {
    if (gp_code) {
        var defer = q.defer();

        var query = conn.query('SELECT * FROM group_form WHERE ?', { gp_code: gp_code }, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }

    return false;
}


function getPosts(id){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM posts ', function(err, userhome) {
        //console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(userhome);
        }
    });

    return defer.promise;
}

function getGroups(){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM group_form', function(err, groups) {
        //console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(groups);
        }
    });

    return defer.promise;
}
/*
function getRequests(){
    var defer = q.defer();

    var query = conn.query('SELECT req_need.r_id,req_need.first_name,req_need.need,request_photos.image FROM req_need LEFT JOIN request_photos ON req_need.r_id=request_photos.r_id  GROUP BY request_photos.r_id    ORDER BY req_need.r_id DESC ', function(err, req_received) {
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}
*/
function getRequests(){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM req_need ', function(err, req_received) {
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}

function getMemberlist(){
    var defer = q.defer();

    var query = conn.query('SELECT gp_code,gp_member_id FROM gp_members', function(err, gpmem) {
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(gpmem);
           // return gpmem;
        }
    });

    return defer.promise;
}

function getAmtrec(uid){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM posts where request='+uid, function(err, received) {
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(received);
        }
    });

    return defer.promise;
}


function getAmtpiad(uid){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM fund_statement where u_id='+uid, function(err, received) {
       // //console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(received);
        }
    });

    return defer.promise;
}

function getAllAmtpiad(){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM posts,users where posts.u_id=users.id ', function(err, received) {
       // //console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(received);
        }
    });

    return defer.promise;
}
module.exports = {
    getUserByEmail: getUserByEmail,
    addMember:addMember,
    addRequest:addRequest,
    addPosts:addPosts,
    addGroup:addGroup,
    addFamMember:addFamMember,
    addUser:addUser,
    getPosts:getPosts,
    getGroups:getGroups,
    addGpmem:addGpmem,
    joinGroup:joinGroup,
    getMemberlist:getMemberlist,
    getUserByGpcode:getUserByGpcode,
    getRequests:getRequests,
    getAmtrec:getAmtrec,
    getAmtpiad : getAmtpiad,
    getAllAmtpiad : getAllAmtpiad,
    addFund : addFund,
    //regist: regist
    
}