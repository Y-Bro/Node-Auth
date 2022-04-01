import Joi from "joi";

export const signUpValidation = (body,res) =>{
    const schema = Joi.object({
        name : Joi.string().required(),
        email : Joi.string().email().required(),
        password : Joi.string().required()
    })

    try{
        console.log("here");
        const validation = schema.validate(body);
        console.log("here222");
        if(validation.error){
            throw new Error(validation.error.message)
        }
    }catch(error){
        console.log("here IN ERROR");
        res.send(error.message);
    }
}
    