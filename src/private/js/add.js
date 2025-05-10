add_button = document.querySelector('.post_add') 

function add_json_element(title,desc,data){
    token = localStorage.getItem('token')
    sortedPosts = [...data.posts].sort((a, b) => parseInt(b.id) - parseInt(a.id))
    newElementId = parseInt(sortedPosts[0].id) + 1
    new_element = {
        "id":newElementId + '',
        "title":title,
        "description":desc
    }
    data.posts.push(new_element)
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, token })
    }
    fetch("/addpost",options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}


add_button.addEventListener('click',function(event){
    event.preventDefault();
    title = document.querySelector('.post_title_add').value
    description = document.querySelector('.post_desc_add').value
    if (title.trim().length > 0 && description.trim().length > 0) {
        title = title.trimStart()
        description = description.trimStart()
        const options = {
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
