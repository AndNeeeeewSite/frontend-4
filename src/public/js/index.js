let templateText = `
{{#each posts}}
  <div class="render_panel" id={{id}}>
    <div class="render_text">    
    <h2 class="render_title">{{title}}</h2>
    <h3 class="render_disc">{{description}}</h3>
    <div class="render_tags">
      <h2 class="tag_title">Tags:</h2> 
      {{#each tags}}
        <h2 class="render_tag">{{this}}</h2>
      {{/each}}
    </div>
    </div>

    <div class="comments_div">
      <input placeholder="Comment" class="add_comment_input">
      <button class="add_comment">Submit</button>
        <h2 class="render_disc">Comments</h2>
    </div>
    <div class="render_comments">
        {{#each comments}}
          <h2>{{this}}</h2>
        {{/each}}
    </div>
  </div>
{{/each}}`;
let template = Handlebars.compile(templateText);


function render(posts){
    document.querySelector('.blog_library').innerHTML = ''
    posts = posts.posts
    let output = template({ posts });
    document.querySelector('.blog_library').innerHTML = output
    let addCommentButton = document.querySelectorAll('.add_comment')
    for(let button of addCommentButton){
      button.addEventListener('click',function(){
        let comment = button.parentNode.children[0].value
        let id = button.parentNode.parentNode.id
        const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ comment ,id})
        };

        fetch("/addcomment", options)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                  alert('Comment added')
                  window.location.href = window.location.href;
                } else {
                    alert('Enter normal text!');
                }
            })
            .catch(error => console.log(error));
      })
    }
}
function get_posts(){
    let options = {
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

let main_search = document.querySelector('.main_search')
main_search.addEventListener('input', _.debounce(function(){
  if(main_search.value.trim().length > 0){
    let requestedTags = main_search.value.split(",").map(item => item.trim())
    let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            }
        };  
        fetch('/posts', options)
            .then(response => response.json())
            .then(data => {
              let filtered = data.posts
                .map(post => {
                  let matchCount = post.tags.filter(tag => requestedTags.includes(tag)).length;
                  return { ...post, matchCount };
                })
                .filter(post => post.matchCount > 0)
                .sort((a, b) => b.matchCount - a.matchCount);
                filtered = {
                  "posts":filtered
                }
                render(filtered)
            })
            .catch(error => console.log("Error: " + error));
  }else{
      let options = {
          method: "GET",
          headers: {
              "Content-Type": "application/json; charset=UTF-8",
          }
      }; 
    fetch('/posts', options)
            .then(response => response.json())
            .then(data => {
                render(data)
            })
            .catch(error => console.log("Error: " + error));
  }
}, 1000))