const User = require('../models/user');

module.exports.profile = function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err,user){
            if(err){
                console.log('Error in displaying info on profile');
                return;
            }
            if(user){
                return res.render('user_profile',{
                    title: "User Profile",
                    user: user
                });
            }else{
                return res.redirect('/users/sign-in');
            }
        })
    }
    else{
        return res.redirect('/users/sign-in');
    }
    
}

module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title: "Vartalaap | SIGN UP"
    });
}

module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title: "Vartalaap | SIGN IN"
    });
}

module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user for signing up');
            return;
        }
        if(!user){
            User.create(req.body, function(err,user){
                if(err){
                    console.log('Error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }
        else{
            res.redirect('back');
        }
    })
}

module.exports.createSession=function(req,res){
    //steps for auth
    // find the user
    User.findOne({email:req.body.email}, function(err,user){
        if(err){
            console.log('Error in finding user for sign in');
            return;
        }
        // handle user found
        if(user){
            // if password doesn't match
            if(user.password != req.body.password){
                return res.redirect('back');
            }
            // create sessions
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        else{
            //handle user not found

            return res.redirect('back');
        }
    });



}