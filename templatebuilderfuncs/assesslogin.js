import "dotenv/config.js";

function assessLoginAttempt(attemptedPW){

    const correctPW = process.env.UI_APP_PW

    //check if attempt matches env pw
    
    const result = correctPW === attemptedPW ? true : false 

    return result 
}

export default assessLoginAttempt;