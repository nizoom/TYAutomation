import express from 'express'

import path from 'path';

const app = express();

const port = 3001

const __dirname = path.resolve();

async function startExpress(){
    app.listen(port, () => {
        console.log('nodeMailer is listening at port: ' + port  )
    })
    
    app.use(express.static(__dirname + '/templates/media')); //Serves resources from public folder
}

export default startExpress