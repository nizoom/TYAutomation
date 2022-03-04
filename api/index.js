import express from "express"
const app = express();


// app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

app.get('/test', function(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.json({status: 'message received'})
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
})
