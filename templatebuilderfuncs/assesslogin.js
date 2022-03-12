import "dotenv/config.js";

function assessLoginAttempt(attemptedPW){

    const correctPW = process.env.UI_APP_PW
 
    console.log(correctPW);
    console.log(process.env);

    if(correctPW === attemptedPW){
        console.log('success')
        return  {
            result : true,
        }
    }
    console.log('failed');
    return {
        result : false,
    }

}

export default assessLoginAttempt;