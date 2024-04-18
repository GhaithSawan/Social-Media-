navui()
getposts()
getuser()
let img_user = document.getElementById("profile-iamg")
let name_inprofile = document.getElementById("name_inprofile")
let username_inprofile = document.getElementById("username_inprofile")
let user_posts_count = document.getElementById("posts-count")
getiduser()
function getiduser() {
    let urlparmes = new URLSearchParams(window.location.search)
    let id = urlparmes.get("userid")
    return id
}

function getuser() {

    let userid = getiduser()
    loederfun(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userid}`)
        .then((response) => {
            let user = response.data.data
            name_inprofile.innerHTML = `Name : ${user.name}`
            username_inprofile.innerHTML = `UserName : ${user.username}`
            user_posts_count.innerHTML = user.posts_count
            img_user.src = user.profile_image

        })
        .catch(error => {
            let errormassag = error.response.data.message
            alerts(errormassag, "danger")
        })
        .finally(() => {
            loederfun(false)
         }) 
 
}


function getposts() {
    let userid = getiduser()
    loederfun(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userid}/posts`)
        .then((response) => {
            let posts = response.data.data
            console.log(posts);
            for (post of posts) {
                let who_user = document.getElementById("who_user").innerHTML = `${post.author.username}`

                let user = getcurrentuser()
                let buttoneditshow = user != null && post.author.id == user.id
                let btneditanddelete = ``
                if (buttoneditshow) {
                    btneditanddelete = `
                    <button onclick="deletepost('${encodeURIComponent(JSON.stringify(post))}')" id="btn_delete" class="btn btn-outline-danger" style="margin-top: 7px;" data-bs-toggle="modal"
                    data-bs-target="#delete-modal">Delete<ion-icon name="trash-outline"></ion-icon></button>
                    <button onclick="editpost('${encodeURIComponent(JSON.stringify(post))}')" id="btn_edit" class="btn btn-outline-primary" style="margin-top: 7px;" >edit<ion-icon name="create-outline"></ion-icon></button>
                    `
                }

                allcards.innerHTML += `
                
                
                <div class="card shadow" style="margin-top: 30px;" id="card">

                    <div class="card-header">
                    <img src="${post.author.profile_image}" class="border rounded-circle" alt=""
                    style="width: 50px; height: 50px;">
                <b>${post.author.username}</b>
                    
                
                    


                        ${btneditanddelete}

                        </div>
                    <div class="card-body">
                        <img src="${post.image}" alt="" style="width: 100%;">
                        <h7 style="color: gray;" class="mt-2"> 2 Minutes Later</h7>
                        <h5 id="title_post">${post.title}</h5>
                        <p>${post.body}</p>
                        <hr>
                        <div style="display: flex; align-items: center;">
                            <div>

                                <span>
                                    <img src="./chatbox-outline.svg" alt="" style="width: 25px; height:25px ;">
                                    <p style="display:inline-block ;margin-left: 5px;" id="btn_comments" onclick="getuserandimagforcomments(${post.id})"  data-bs-toggle="modal"
                                    data-bs-target="#comments-modal">${post.comments_count} Comments</p>

                                </span>

                            </div>


                        </div>

                    </div>

                </div>
                
                `
                if (post.title == null) {
                    let title_post = document.getElementById("title_post").innerHTML = ""
                }
            }
        })
        .catch(error => {
            let errormassag = error.response.data.message
            alerts(errormassag, "danger")
        }).finally(() => {
            loederfun(false)
         }) 
 
}