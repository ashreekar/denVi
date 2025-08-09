const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(
            requestHandler(req, res, next)
        ).catch((err) => {
            next(err);
        })
    }
}

export { asyncHandler };

// other example

// const asyncHandler=()=>{}
// const asyncHandler=(fun)=>()=>{}
// const asyncHandler=(fun)=>async ()=>{}
// above is like
// const asyncHandler=(fun)=>{async ()=>{}}

// const asyncHandler=(reqHandler)=>async (req,res,next)=>{
//     try{
//         await reqHandler(req,res,next);
//     }catch(err){
//         res.status(err.code || 500).json({
//             sucess:false,
//             message:err.message
//         });
//     }
// }