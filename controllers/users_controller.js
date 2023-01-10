const User = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('user_profile',{
        title: "User Profile"
    });
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
    //
}