const errorHandler=(statuscode,message)=>{
    const error=new Error();
    error.message=message;
    error.statusCode=statuscode
    return error;
}

export default errorHandler;