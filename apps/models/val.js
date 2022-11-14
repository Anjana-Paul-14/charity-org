var db = require("../common/database");
var q = require('q');

var conn = db.getConnection();

/*function regist(val) {

    if (val) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO registration SET ?', val, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}*/

function addsubadmin(val,subadmin_details) {

    if (val) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO users SET ?', val, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
               // defer.resolve(result);
                //var sub_code = result.insertId;
                var u_id = result.insertId;
            

                    subadd = {
                    

                        sub_code: subadmin_details.sub_code,
                        u_id:u_id,
                        address:subadmin_details.address,
                        dob:subadmin_details.dob,
                        pno:subadmin_details.pno,
                        gender:subadmin_details.gender,
                        ward:subadmin_details.ward,
                        pan:subadmin_details.pan,
                        taluk:subadmin_details.taluk,
                        dis:subadmin_details.dis,
                        state:subadmin_details.state,
                        pin:subadmin_details.pin,
                        bankno:subadmin_details.bankno,
                        bankholdername:subadmin_details.bankholdername,
                        bankifsc:subadmin_details.bankifsc,
                        bankdetails:subadmin_details.bankdetails

                

                    };
             
                      
                        console.log(subadd);
         
                 var query1 = conn.query('INSERT INTO user_details SET ?', subadd, function (err, result) {
                       console.log(query1);
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


function addFamilyMember(val,subadmin_details,photo) {

    if (val) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO users SET ?', val, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
               // defer.resolve(result);
                //var sub_code = result.insertId;
                var u_id = result.insertId;
                
                   photo.forEach(function(photo){
                    
                        console.log('event reg id det = '+ photo.filename);
                         proof_photo = {
 
                                u_id: u_id,
                                image: photo.filename,
                            };
                        // insert query
                         var query1 = conn.query('INSERT INTO proof_photos SET ?', proof_photo, function (err, result) {
                                    if (err) {
                                        defer.reject(err);
                                    } else {
                                        defer.resolve(result);
                                    }
                                });
                        // insert query end
                    });

                    subadd = {
                    

                        sub_code: subadmin_details.sub_code,
                        u_id:u_id,
                        address:subadmin_details.address,
                        dob:subadmin_details.dob,
                        pno:subadmin_details.pno,
                        gender:subadmin_details.gender,
                        ward:subadmin_details.ward,
                        pan:subadmin_details.pan,
                        taluk:subadmin_details.taluk,
                        dis:subadmin_details.dis,
                        state:subadmin_details.state,
                        pin:subadmin_details.pin,
                        bankno:subadmin_details.bankno,
                        bankholdername:subadmin_details.bankholdername,
                        bankifsc:subadmin_details.bankifsc,
                        bankdetails:subadmin_details.bankdetails

                

                    };
             
                      
                        console.log(subadd);
         
                 var query1 = conn.query('INSERT INTO user_details SET ?', subadd, function (err, result) {
                       console.log(query1);
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

function getState(){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM user_details', function(err, state) {
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(state);
        }
    });

    return defer.promise;
}

function getDistrict(){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM user_details ', function(err, district) {
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(district);
        }
    });

    return defer.promise;
}

function getTaluk(){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM user_details', function(err, taluk) {
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(taluk);
        }
    });

    return defer.promise;
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

function getAllUsers() {
    var defer = q.defer();

    var query = conn.query('SELECT * FROM users', function (err, users) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(users);
        }
    });

    return defer.promise;
}

function getRequest(district,type){
    var defer = q.defer();
var sql ='SELECT req_need.title,req_need.need,req_need.u_id,req_need.r_id FROM req_need ';
    if(type!='cl'){
      sql +=' where  req_need.dis='+district;
    }
    var query = conn.query(sql, function(err, request) {
      // console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(request);
        }
    });

    return defer.promise;
}

function getVerified(district,type,user_id){
    var defer = q.defer();
var sql ='SELECT req_need.title,req_need.need,approval.status FROM req_need,approval where req_need.r_id=approval.r_id  ';
    if(type!='cl'){
      sql +=' and  req_need.dis='+district+' and approval.status="approved"';
    }
     sql +=' and  approval.authority_id='+user_id+' ';
    var query = conn.query(sql, function(err, ver_request) {
    //   console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(ver_request);
        }
    });

    return defer.promise;
}
function getAdmVerified(district,type,user_id){
    var defer = q.defer();

    var sql ='SELECT req_need.title,req_need.need,approval.status,req_need.r_id,req_need.u_id FROM req_need,approval where req_need.r_id=approval.r_id  ';
    /*
    if(type!='cl'){
      sql +=' and  req_need.dis='+district+' and approval.status="approved"';
    }
    */

     sql +=' and approval.status="approved" and  approval.authority_id='+user_id+' ';
    var query = conn.query(sql, function(err, ver_request) {
       console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(ver_request);
        }
    });

    return defer.promise;
}
function getUnverified(district,type){
    var defer = q.defer();
var sql ='SELECT req_need.title,req_need.need,req_need.u_id,req_need.r_id FROM req_need where status!="approved" or status is NULL ';
    if(type!='cl'){
      sql +=' where  req_need.dis='+district;
    }
    var query = conn.query(sql, function(err, unver_request) {
       console.log(query);
       console.log('ok');
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(unver_request);
        }
    });

    return defer.promise;
}

function getReq_details(r_id,u_id){
    var defer = q.defer();

//    var sql="SELECT * FROM `users`,req_need,user_details WHERE req_need.u_id=users.id and users.id=user_details.u_id and req_need.r_id="+r_id +" and req_need.u_id="+u_id;

    var sql="SELECT * FROM `users`,req_need,user_details WHERE req_need.memid=users.mem_code and users.id=user_details.u_id and req_need.r_id="+r_id +" and req_need.u_id="+u_id;

    var query = conn.query(sql, function(err, req_details) {
      console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_details);
        }
    });

    return defer.promise;
}

function getProfile_details(u_id){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM `users`,user_details WHERE users.id=user_details.u_id and users.id='+u_id , function(err, req_details) {
     // console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_details);
        }
    });

    return defer.promise;
}

function getFund_req_details(r_id){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM `users`,req_need,user_details,aloted_request WHERE req_need.u_id=users.id and users.id=user_details.u_id and aloted_request.r_id='+r_id +' and req_need.r_id='+r_id +' and aloted_request.u_id >0 ', function(err, req_details) {
         console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_details);
        }
    });

    return defer.promise;
}


/*

function addBib(bib_starting,district,champ) {



    conn.query('SELECT * FROM event_reg WHERE ?', {champ_id : champ}, function(error, pdt, fields) {
      
      console.log("champ id"+ champ);
     
     var ab=bib_starting;
          Object.keys(pdt).forEach(function(key){
            var row = pdt[key];
            var slno =  pdt[key].s_no;
  

           console.log(ab);
            var q2 = {
            bib_number : ab
            };

        //  console.log('UPDATE event_reg SET ? WHERE bib_number = ?',[ {bib_number: ab}]);  
           
    conn.query('UPDATE event_reg SET ? WHERE champ_id = ? and district = ? and s_no = ?', [{bib_number: ab}, champ,district,slno], function(err, result) {
        //if (err) throw err;
        //response.redirect('/login');
          });
 ab++;
       
           
            });
        });

}


*/
function getSamithi(){
    var defer = q.defer();

    // var query = conn.query('SELECT * FROM `users` WHERE  user_type="subad"', function(err, req_details) {
    var query = conn.query('SELECT users. *,users.id,COUNT(users.id) as cuid FROM users LEFT JOIN posts ON users.id=posts.u_id GROUP BY `users`.`id` ORDER BY cuid ASC', function(err, req_details) {
    // var query = conn.query('SELECT * FROM `users`,aloted_request WHERE users-id=aloted_request.u_id and  users.user_type="subad"', function(err, req_details) {

     // console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_details);
        }
    });

    return defer.promise;
}
//this function 
function addApproval(approval,photos) {

    if (approval) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO approval SET ?',approval , function (err,req_details) {
         
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(req_details);
            var request_id =  approval.r_id;
            var user_type =  approval.user_type;
                if(user_type =='cl'){
                 var query = conn.query('UPDATE req_need SET status = "approved" WHERE r_id = ?',
                     [request_id], function(err, result) {
                       //  console.log(query);
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
                photos.forEach(function(photo){
                    
                        console.log('event reg id det = '+ photo.filename);
                         req_photo = {
 
                                r_id: request_id,
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
       }

            }
        });

        return defer.promise;
    }
    return false;
}
function getFund(id){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM fund_statement LEFT JOIN users ON fund_statement.u_id=users.id where fund_statement.samithy_id='+id+' ORDER BY fund_statement.id DESC ', function(err, req_received) {
        console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}
function getMyrequest(id){
    var defer = q.defer();

    var query = conn.query('SELECT req_need.r_id,req_need.title,req_need.need,request_photos.image FROM req_need LEFT JOIN request_photos ON req_need.r_id=request_photos.r_id where req_need.u_id='+id+'  GROUP BY request_photos.r_id    ORDER BY req_need.r_id DESC ', function(err, req_received) {
        console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}

function getMembers(added){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM users,user_details where users.id=user_details.u_id and users.user_type="m" and users.added_by="'+added+'"  ORDER BY users.id DESC ', function(err, req_received) {
         console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}

function getFamily_Members(fcode){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM users,user_details where users.id=user_details.u_id and users.fam_code="'+fcode+'"  ORDER BY users.id DESC ', function(err, req_received) {
        console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}
function getMyrequestPhotos(rid){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM request_photos  where r_id='+rid, function(err, req_received) {
       // console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}


function getProofPhotos(uid){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM proof_photos where u_id='+uid, function(err, req_received) {
        console.log(query);
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}

function getFundrequest(id){
    var defer = q.defer();

    var query = conn.query('SELECT req_need.r_id,req_need.u_id,req_need.title,req_need.need,request_photos.image,aloted_request.payment FROM req_need , request_photos,aloted_request WHERE req_need.r_id=request_photos.r_id and req_need.r_id=aloted_request.r_id and aloted_request.u_id='+id+' and aloted_request.payment IS NULL  GROUP BY request_photos.r_id ORDER BY req_need.r_id DESC', function(err, req_received) {
        // console.log(query);


        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}

function getUnPaidFundrequest(){
    var defer = q.defer();

    var query = conn.query('SELECT users.first_name,req_need.r_id,req_need.u_id,req_need.title,req_need.need,request_photos.image,aloted_request.payment FROM req_need , request_photos,aloted_request,users WHERE req_need.r_id=request_photos.r_id and req_need.r_id=aloted_request.r_id and req_need.u_id=users.id  and aloted_request.payment !="y"  GROUP BY request_photos.r_id    ORDER BY req_need.r_id DESC', function(err, req_received) {
        console.log(query);


        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}


function getPaidFundrequest(id){
    var defer = q.defer();

    var query = conn.query('SELECT req_need.r_id,req_need.u_id,req_need.title,users.first_name,req_need.need,request_photos.image,aloted_request.payment FROM req_need , request_photos,aloted_request,users WHERE req_need.r_id=request_photos.r_id and req_need.r_id=aloted_request.r_id and req_need.u_id=users.u_id and aloted_request.u_id='+id+' and aloted_request.payment ="y"  GROUP BY request_photos.r_id    ORDER BY req_need.r_id DESC', function(err, req_received) {
        console.log(query);


        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}



function getAloted_samithi_for_request(rid){
    var defer = q.defer();

    var query = conn.query('SELECT * FROM `aloted_request`,users where aloted_request.u_id=users.id and aloted_request.r_id='+rid+'  ORDER BY aloted_request.r_id DESC', function(err, req_received) {
        console.log(query);


        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}

function getAllrequest(){
    var defer = q.defer();

    var query = conn.query('SELECT req_need.r_id,req_need.u_id,req_need.title,req_need.need FROM req_need  ORDER BY req_need.r_id DESC', function(err, req_received) {
        console.log(query);

        if(err){
            defer.reject(err);
        }else{
            defer.resolve(req_received);
        }
    });

    return defer.promise;
}


function Admin_Approval(approval) {

    if (approval) {
        var defer = q.defer();

        var query = conn.query('INSERT INTO approval SET ?',approval , function (err,req_details) {
         
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(req_details);
            var request_id =  approval.r_id;
            var user_type =  approval.user_type;
                if(user_type =='cl'){
                 var query = conn.query('UPDATE req_need SET status = "approved" WHERE r_id = ?',
                     [request_id], function(err, result) {
                       //  console.log(query);
                      //  console.log("model log -- "+approval);
            if(err){
                defer.reject(err);
            }
        });
       }

            }
        });

        return defer.promise;
    }
    return false;
}

                                   
module.exports = {
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers,
    getState:getState,
    getDistrict:getDistrict,
    getTaluk:getTaluk,
    getRequest:getRequest,
    getReq_details:getReq_details,
    addsubadmin:addsubadmin,
    addApproval:addApproval, 
    getVerified:getVerified,
    getAdmVerified : getAdmVerified,
    getUnverified:getUnverified,
    getSamithi:getSamithi,
    getMyrequest:getMyrequest,
    getFundrequest:getFundrequest,
    getMyrequestPhotos :getMyrequestPhotos,
    getFund_req_details : getFund_req_details,
    getPaidFundrequest : getPaidFundrequest,
    getUnPaidFundrequest : getUnPaidFundrequest,
    getMembers : getMembers,
    getFamily_Members : getFamily_Members,
    Admin_Approval : Admin_Approval,
    addFamilyMember : addFamilyMember,
    getProofPhotos : getProofPhotos,
    getProfile_details : getProfile_details,
    getAllrequest : getAllrequest,
    getAloted_samithi_for_request : getAloted_samithi_for_request,
    getFund : getFund,
}