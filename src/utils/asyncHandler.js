const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(
            requestHandler(req,res,next)
        ).catch((err)=>{
            next(err);
        })
    }
}

export {asyncHandler};

// other example

// const asyncHandler=()=>{}
// const asyncHandler=(fun)=>()=>{}
// const asyncHandler=(fun)=>async ()=>{}
// above is like 
// const asyncHandler=(fun)=>{async ()=>{}}

// const asyncHandler=(fun)=>async (req,res,next)=>{
//     try{
//         await fun(req,res,next);
//     }catch(err){
//         res.status(err.code || 500).json({
//             sucess:false,
//             message:err.message
//         });
//     }
// }