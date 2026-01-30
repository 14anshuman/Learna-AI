const errorHandler=(err,req,res,next)=>{
    let statusCode=err.statusCode || 500;
    let message=err.message || 'Internal Server Error';

    if(err.name==='ValidationError'){
        statusCode=400;
        message=Object.values(err.errors).map((val)=>val.message).join(', ');
    }
    if(err.code && err.code===11000){
        statusCode=400;
        const field=Object.keys(err.keyValue);
        message=`Duplicate field value entered for ${field}`;
    } 
     if(err.name==='CastError'){
        statusCode=404;
        message=Object.values(err.errors).map((val)=>val.message).join(', ');
    }  

    if(err.code=='LIMIT_FILE_SIZE'){
        statusCode=400;
        message='File size is too large. Maximum limit is 1MB';
    }

    if(err.code==='JsonWebTokenError'){
        statusCode=401;
        message='Invalid token. Please log in again.';
    }

    if(err.name==='TokenExpiredError'){
        statusCode=401;
        message='Your token has expired. Please log in again.';
    }

    console.error('Error:',{
        message:err.message,
        stack:process.env.NODE_ENV==='development'?err.stack:null,
    })

    res.status(statusCode).json({
        success:false,
        error:message,
        statusCode,
        ...process.env.NODE_ENV==='development' && {stack:err.stack},
    });
    
}

export default errorHandler;