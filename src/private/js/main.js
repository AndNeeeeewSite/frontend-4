//                    Add

add_button = document.querySelector('.post_submit') 
token = localStorage.getItem('token')

function add_json_element(title, desc, data) {
    let newElementId = 1;

    if (data.posts && data.posts.length > 0) {
        const sortedPosts = [...data.posts].sort((a, b) => parseInt(b.id) - parseInt(a.id));
        newElementId = parseInt(sortedPosts[0].id) + 1;
    }

    const new_element = {
        id: newElementId.toString(),
        title: title,
        description: desc
    };

    data.posts.push(new_element);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, token })
    };

    fetch("/addpost", options)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert('Post added');
                allDelete();
            } else {
                alert('Error!');
            }
        })
        .catch(error => console.log(error));
}


add_button.addEventListener('click',function(event){
    event.preventDefault();
    title = document.querySelector('.post_title_add').value
    description = document.querySelector('.post_desc_add').value
    if (title.trim().length > 0 && description.trim().length > 0) {
        title = title.trimStart()
        description = description.trimStart()
         options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            }
        }
        fetch('/posts', options)
            .then(response => response.json())
            .then(data => add_json_element(title,description,data))
            .catch(error => console.log("Error: " + error))
    } 
    else {
        alert('Enter a normal text')
    }

})
//                    Remove
function allDelete(){
    function renderDelete(posts){
        posts = posts.posts
        console.log(posts)
        output = template({ posts });
        document.querySelector('.remove_posts').innerHTML = output
        delete_buttons = document.querySelectorAll('#delete_item')
        for (button of delete_buttons) {
            button.addEventListener('click',function(event){
            event.preventDefault()
            options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                }
            }
            fetch('/posts', options)
            .then(response => response.json())
            .then(data => {
                idToRemove = this.parentNode.id
                data.posts = data.posts.filter(post => post.id !== idToRemove);
                options = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data , token})
                }
                fetch("/deletepost",options)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error))
                this.parentNode.remove();
            })
            .catch(error => console.log("Error: " + error))
        })

    }
    }
    templateText = `
    {{#each posts}}
    <div class="render_panel" id={{id}}>
        <h2 class="render_title">{{title}}</h2>
        <h3 class="render_disc">{{description}}</h3>
        <button id="delete_item" class="post_submit">Remove</button>
    </div>
    {{/each}}`;

    template = Handlebars.compile(templateText);
    options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            }
        };  
        fetch('/posts', options)
            .then(response => response.json())
            .then(data => renderDelete(data))
            .catch(error => console.log("Error: " + error));
}

allDelete()