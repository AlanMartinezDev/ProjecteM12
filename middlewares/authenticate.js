
exports.isAuth = function (req, res, next) {
    
    if(!req.session.data) {
        res.redirect('/auth/login')
    }
    else {       
      next();  
    }   
}

exports.hasRole = function  (role)  {
    return function (req, res, next)  {

        if(req.session.data.rol instanceof Array) {
            if( req.session.data.rol.includes(rol)) return next();
           
            // error insuficients privilegis
            var err = new Error("You don't have suficient privileges to do this action.");
            err.status = 401;             
            return next(err);
            
        }
        else {
                if( req.session.data.rol == rol) return next();                
                // error insuficients privilegis
                var err = new Error("You don't have suficient privileges to do this action.");
                err.status = 401;             
                return next(err);
                
        }
    }
}

// module.exports = isAuth;