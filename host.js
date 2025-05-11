express = require('express');
path = require('path');
bodyParser = require('body-parser');
fs = require('fs');
app = express();
port = 1234;

adminData = {
    "name":"admin",
    "password":"123"
}
adminToken = "aRgLwGGPa4kE54pqxG9gXC7PVfFWEvWS3mHW"

publicPath = path.join(__dirname, 'src', 'public');
privatePath = path.join(__dirname, 'src', 'private');


app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use('/js', express.static(path.join(privatePath, 'js')));
app.use('/style', express.static(path.join(privatePath, 'style')));

app.get('/', (req, res) => {
    now = new Date();

    console.log('GET / ' + now);
    return res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/login', (req, res) => {
    now = new Date();
    console.log('GET /login '+ now);
    token = req.query.token;
    return res.sendFile(path.join(publicPath, 'login.html'));
});

app.get('/posts', (req, res) => {
    now = new Date();
    console.log('GET /posts '+ now);
    return res.sendFile(path.join(publicPath, 'db.json'));
});

app.post('/addpost', (req, res) => {
    now = new Date();
    console.log('POST /addpost '+ now)
    userData = req.body.data;
    if(req.body.token === adminToken){
        fs.writeFile(publicPath + '/db.json', JSON.stringify(userData, null, 2), function(err){
                if (err) {
                    console.error('Error to add post:', err);
                    return res.json({ status: false }); 
                } else {
                    console.log('Post created');
                }
            });
        return res.json({ status: true }); 
    }
    else{
        return res.json({ status: false }); 
    }
    
});




app.get('/admin', (req, res) => {
    now = new Date();
    console.log('GET /admin '+ now);
    token = req.query.token;
    if (token === adminToken) {
        return res.sendFile(path.join(privatePath, 'admin.html'));
    }   
    else {
        return res.status(401).sendFile(path.join(publicPath, 'err/401.html'));
    }
});

app.post('/logindata', (req, res) => { 
    now = new Date(); 
    console.log('POST /logindata '+ now); 
    userData = req.body;  
    if (userData.login_name === adminData.name && userData.login_password === adminData.password) {
        return res.json({ status: true , token:adminToken}); 
    }
    return res.json({ status: false }); 
});

app.delete('/deletepost', (req, res) => { 
    now = new Date(); 
    console.log('POST /deletepost '+ now); 
    userData = req.body.data;
    if(req.body.token === adminToken){
        fs.writeFile(publicPath + '/db.json', JSON.stringify(userData, null, 2), function(err){
                if (err) {
                    console.error('Error to delete post:', err);
                    return res.json({ status: false }); 
                } else {
                    console.log('Post deleted');
                }
            });
        return res.json({ status: true }); 
    }
    else{
        return res.json({ status: false }); 
    }
});

app.post('/editpost', (req, res) => { 
    now = new Date(); 
    console.log('POST /deletepost '+ now); 
    userData = req.body.data;
    if(req.body.token === adminToken){
        fs.writeFile(publicPath + '/db.json', JSON.stringify(userData, null, 2), function(err){
                if (err) {
                    console.error('Error to delete post:', err);
                    return res.json({ status: false }); 
                } else {
                    console.log('Post deleted');
                }
            });
        return res.json({ status: true }); 
    }
    else{
        return res.json({ status: false }); 
    }
});

app.get('/404', (req, res) => {
    return res.sendFile(path.join(publicPath, 'err/404.html'));
});
app.get('/401', (req, res) => { 
    return res.sendFile(path.join(publicPath, 'err/401.html'));
});
app.use((req, res) => {
  res.redirect('/404');
});
app.listen(port, () => {
    console.log(`Site at http://localhost:${port}`);
});
