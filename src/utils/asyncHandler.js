/// IT IS AN HANDLER WITH THE PROMISES

const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}
export { asyncHandler}


// IT IS AN HANDLER WITH THE TRY AND CATCH METHODS

/*const asyncHandler=(fn)=> async (req,res,next)=>{
    try{
        await fn(req,res,next);
    }
    catch(error){
        res.status(error.code|| 500).json({
            success:false,
            message:error.message,
        })
    }
}*/
