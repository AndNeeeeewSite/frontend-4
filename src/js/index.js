let db_url = 'http://localhost:3000'
import template from '../temp/posts.hbs';
    
function render(posts){
    const output = template({ posts });
    document.querySelector('.blog_library').innerHTML = output
}
function get_posts(url){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        }
    };  
    fetch(url+'/posts', options)
        .then(response => response.json())
        .then(data => render(data))
        .catch(error => console.log("Error: " + error));
}

get_posts(db_url)
