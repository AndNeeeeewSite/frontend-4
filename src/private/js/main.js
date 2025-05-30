//                    Add
add_button = document.querySelector('.post_submit')
token = localStorage.getItem('token')

function add_json_element(title, desc, element_tags, data) {
    let newElementId = 1;

    if (data.posts && data.posts.length > 0) {
        const sortedPosts = [...data.posts].sort((a, b) => parseInt(b.id) - parseInt(a.id));
        newElementId = parseInt(sortedPosts[0].id) + 1;
    }

    const new_element = {
        id: newElementId.toString(),
        title: title,
        description: desc,
        comments: [],
        tags: element_tags
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


add_button.addEventListener('click', function (event) {
    event.preventDefault();
    title = document.querySelector('.post_title_add').value
    description = document.querySelector('.post_desc_add').value
    tags = document.querySelector('.post_tags_add').value.split(",").map(item => item.trim())
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
            .then(data => add_json_element(title, description, tags, data))
            .catch(error => console.log("Error: " + error))
    }
    else {
        alert('Enter a normal text')
    }

})
//                    Remove and edit
function allDelete() {
    function renderDelete(posts) {
        posts = posts.posts
        console.log(posts)
        output = template({ posts });
        document.querySelector('.remove_posts').innerHTML = output
        delete_buttons = document.querySelectorAll('#delete_item')
        for (button of delete_buttons) {
            button.addEventListener('click', function (event) {
                event.preventDefault()
                if (confirm('Are you sure ?')) {
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
                                body: JSON.stringify({ data, token })
                            }
                            fetch("/deletepost", options)
                                .then(response => response.json())
                                .then(data => console.log(data))
                                .catch(error => console.log(error))
                            this.parentNode.remove();
                        })
                        .catch(error => console.log("Error: " + error))
                }
                else {

                }
            })

        }
        save_edit_button = document.querySelector('#save_edit_button')

        edit_buttons = document.querySelectorAll('#edit_item')
        for (button of edit_buttons) {
            button.addEventListener('click', function (event) {
                event.preventDefault()
                let options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    }
                };
                fetch('/posts', options)
                    .then(response => response.json())
                    .then(data => {
                        idToEdit = this.parentNode.id
                        titleToEdit = this.parentNode.children[0].textContent
                        deskToEdit = this.parentNode.children[1].textContent
                        rawTagsToEdit =  Array.from(this.parentNode.children[2].children)
                        rawTagsToEdit.shift()
                        tagsToEdit = []
                        for(tag of rawTagsToEdit){
                            tagsToEdit.push(tag.textContent)
                        }
                        editTitle = document.querySelector('.post_title_edit')
                        editDesc = document.querySelector('.post_desc_edit')
                        editTags = document.querySelector('.post_tags_edit')
                        editTitle.value = titleToEdit
                        editDesc.value = deskToEdit
                        editTags.value = tagsToEdit + ''
                        edit_form = document.querySelector('.edit_div')
                        edit_form.style.display = 'flex'
                        save_edit_button.addEventListener('click', function (event) {
                            event.preventDefault()
                            editValueTitle = editTitle.value
                            editValueDesc = editDesc.value
                            if (editValueTitle.trim().length > 0 && editValueDesc.trim().length > 0) {
                                editValueTitle = editValueTitle.trimStart()
                                editValueDesc = editValueDesc.trimStart()
                                editValueTags = editTags.value.split(",").map(item => item.trim())
                                editElemId = data.posts.findIndex(obj => obj.id === idToEdit)
                                data.posts[editElemId].title = editValueTitle
                                data.posts[editElemId].description = editValueDesc
                                data.posts[editElemId].tags = editValueTags
                                console.log(data.posts[editElemId])
                                console.log(data)
                                options = {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ data, token })
                                }
                                fetch("/editpost", options)
                                    .then(response => response.json())
                                    .then(data => {
                                        window.location.href = window.location.href;
                                    }
                                    )
                                    .catch(error => console.log(error))
                            }
                            else {
                                alert('Enter a normal text')
                            }
                        })
                    })
                    .catch(error => console.log("Error: " + error));

            })

        }
    }
    templateText = `
    {{#each posts}}
    <div class="render_panel" id={{id}}>
        <h2 class="render_title">{{title}}</h2>
        <h3 class="render_disc">{{description}}</h3>
        <div class="render_tags">
            <h2 class="tag_title">Tags:</h2> 
            {{#each tags}}
                <h2 class="render_tag">{{this}}</h2>
            {{/each}}
      </div>
        <button id="delete_item" class="post_submit">Remove</button>
        <button id="edit_item" class="post_submit">Edit</button>
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