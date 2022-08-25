import request from 'request-promise';

if(process.env.HEROKU_URL){
    setInterval(async()=> {
        try{
            await request.get(process.env.HEROKU_URL);
        }catch(err){}
    }, 1,5e+6);
}