module.exports.home = function(req,res){
    console.log(req.cookies);
    res.cookie('user_id', 24);
    return res.render('home',{
        title: "Home"
    });
}