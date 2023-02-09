const errorHandler = (err, req,res,next)=> {
    res.status(400).json({
        success: true,
        error: err.message
    });
}
module.exports = errorHandler