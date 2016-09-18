var DB = require('../../models/models');
var jwt = require('jsonwebtoken');

//


module.exports = function(app, express) {




 
  app.post('/api/register', function(req, res) {

    var email = req.body.email.toLowerCase();

    DB.User.find({'public.email': email}, function(err, user) {
      if (user.length == 0) {
        var user = new DB.User();
		user.public.name = req.body.name;
        user.private.password = user.generateHash(req.body.password);
        user.public.email = email;
        user.save();
        var token = jwt.sign({ _id: user._id,name:user.public.name,email:user.public.email}, app.get('superSecret'), {expiresIn: "24hr"});        
        res.json({
          success: true,
          token: token
        });
      } else {
        res.json({
          success: false,
          message: "Registration Failed"
        });
      }
    });
  });

  app.post('/api/login', function(req, res) {
    var email = req.body.email.toLowerCase();

    DB.User.findOne({'public.email': email}, function(err, user) {
      if (user && user.validPassword(req.body.password)){
		var token = jwt.sign({ _id: user._id,name:user.public.name,email:user.public.email}, app.get('superSecret'), {expiresIn: "24hr"}); 
        res.json({
          success: true,
          token: token
        });
    }
    else
    {
      res.json({
          success: false,
          message: "Login Failed"
        });
    }
    });
  });

   app.get('/api/user',isLoggedIn, function(req, res) {
   res.json({ success: true, message: req.user}); 
  });

   app.get('/api/memory',isLoggedIn, function(req, res) {
DB.Memory.find({}, function(err, memory) {
   res.json({ success: true, message: memory}); 
  });
});

   app.post('/api/memory',isLoggedIn, function(req, res) {
    
DB.User.findById('req.user._id', function(err, user) {
console.log(req.user._id)
var memory = new DB.Memory();
    memory.author = "Colin";
    memory.lat = req.body.lat;
    memory.lon = req.body.lon;
    memory.data = req.body.data;
    memory.date = Date.now();
    memory.type = req.body.type;
        memory.save();
     res.json({ success: true, message: memory});    

});




});   

  app.all('/api/*', function(req, res) {
    res.status(404).send({ 
        success: false,
        message:"404"
    });
  });

function isLoggedIn(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        //Invalid Token
        return res.json({ success: false, message: 'User Session Expired!' });    
      } else {
          DB.User.findOne({_id:decoded._id},{'private.password':0}, function(err, user) {
            req.user = user
            req.decoded = decoded;   
            next(); 
          });
      }
    });
  } else {
    //No token
    return res.json({ success: false, message: 'Not Logged In!'}); 
  }
}

}











