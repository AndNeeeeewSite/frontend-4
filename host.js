const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 1234;

adminData = {
    "name":"admin",
    "password":"123456"
}
adminToken = "Se9kYb0ZCpFBh16lE3z0G0dg8DpVKks0gEJEieaLDLHs9xJG7B9dt2VsBFtALMPzbHU09SyMd5UrqVU285gB2sMmQRSyd1vpUAlb3TGV1wD1KZB08woHkXAPoT94Of10Wd8cyOsTMYamB0u72sSx1t4DvsyEHb2v5Zzg7Mk7A7b2oeTBzGfJzl0ktg1Zj27L0rE2qvrcAmLTCSvywrq5XZsv148JYXb9tbhQzvUUEsfPJ98pFSj95ql8l3"

const publicPath = path.join(__dirname, 'src', 'public');
const privatePath = path.join(__dirname, 'src', 'private');


app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use('/js', express.static(path.join(privatePath, 'js')));
app.use('/style', express.static(path.join(privatePath, 'style')));

app.get('/', (req, res) => {
    console.log('GET /');
    return res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/login', (req, res) => {
    console.log('GET /login');
    const token = req.query.token;
    return res.sendFile(path.join(publicPath, 'login.html'));
});

app.get('/posts', (req, res) => {
    console.log('GET /posts');
    return res.sendFile(path.join(publicPath, 'db.json'));
});

app.post('/addpost', (req, res) => {
    const userData = req.body.data;
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
    console.log('GET /admin');
    const token = req.query.token;
    if (token === adminToken) {
        return res.sendFile(path.join(privatePath, 'admin.html'));
    }   
    else {
        return res.status(401).sendFile(path.join(publicPath, 'err/401.html'));
    }
});

app.post('/logindata', (req, res) => {  
    console.log('POST /logindata'); 
    const userData = req.body;  
    if (userData.login_name === adminData.name && userData.login_password === adminData.password) {
        return res.json({ status: true , token:adminToken}); 
    }
    return res.json({ status: false }); 
});

app.post('/isadmin', (req, res) => {  
    console.log('POST /isadmin'); 
    const userToken = req.body.token;  
    if (userToken === adminToken) {
        return res.json({ status: true}); 
    }
    return res.json({ status: false }); 
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
