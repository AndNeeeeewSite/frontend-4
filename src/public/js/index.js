const templateText = `
{{#each posts}}
  <div class="render_panel">
    <h2 class="render_title">{{title}}</h2>
    <h3 class="render_disc">{{description}}</h3>
  </div>
{{/each}}`;
const template = Handlebars.compile(templateText);


function render(posts){
    posts = posts.posts
    const output = template({ posts });
    document.querySelector('.blog_library').innerHTML = output
}
function get_posts(){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        }
    };  
    fetch('/posts', options)
        .then(response => response.json())
        .then(data => render(data))
        .catch(error => console.log("Error: " + error));
}

get_posts()
