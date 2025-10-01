 const adminAuth = (req, res, next) =>{
    console.log("Admin Auth is getting checked");
    const token = "xyz";
    const isAdminAUthorized = token === 'xyz';
    if(!isAdminAUthorized){
      res.status(401).send("Unauthorize Request");
    }
    else{
        next()
    }
}

const userAuth = (req,res, next) =>{
    console.log("User auth is getting checekd ");
    const token  = "xyze";
    const isAdminAUthorized = token === "xyz";
    if (!isAdminAUthorized){
        res.status(401).send("Unauthorized Request");

    }
    else{
        next()
    }
}

module.exports = {
    adminAuth,userAuth
}