

getposts()
// Pagination_________________

let current_page = 1
let lastpage = 1
window.addEventListener("scroll", () => {
    if (window.scrollY + window.innerHeight + 1 >= document.documentElement.scrollHeight && current_page < lastpage) {
        getposts(current_page++)
    }
})
// Pagination 

function get_id_to_profile(userid) {
    window.location = `profile.html?userid=${userid}`
}

function getposts(current_page = 1) {
    loederfun(true)
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=4&page=${current_page}`)
        .then((response) => {
            let posts = response.data.data
            lastpage = response.data.meta.last_page
            for (post of posts) {

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

                <div onclick="get_id_to_profile(${post.author.id})" style="display: inline-block; cursor: pointer;">
                
                    <img src="${post.author.profile_image}" class="border rounded-circle" alt=""
                        style="width: 50px; height: 50px;">
                    <b> @ ${post.author.username}</b>
                    </div>

                    ${btneditanddelete}
                </div>
                    <div class="card-body">
                        <img src="${post.image}" alt="" style="width: 100%;">
                        <h6 style="color: gray;" class="mt-2">${post.created_at}</h6>
                        <h5 id="titlepost">${post.title}</h5>
                        <p>${post.body}</p>
                 <hr>  
                    <div style="display: flex;">
                       <span id="div_comments">
                       <img src="./chatbox-outline.svg" alt="" style="width: 25px; height:25px ;">
                       <p style="display:inline-block ;margin-left: 5px;" id="btn_comments" onclick="getuserandimagforcomments(${post.id})"  data-bs-toggle="modal"
                       data-bs-target="#comments-modal">(${post.comments_count}) Comments</p>
                       </span>
                       <span class="tags mx-3" id="post_tags${post.id}">
                        
                        </span>
                    </div>
                </div>
            </div>

                `
                if (post.title == null) {
                    let titlepost = document.getElementById("titlepost").innerHTML = ""
                }
                // let titlePost = document.getElementById("titlePost")
                // if(post.title != null){
                //     titlePost.innerHTML = `${post.title}`
                // }
                // else{
                //     titlePost.innerHTML = ``
                // }
                let tag_id = `post_tags${post.id}`
                document.getElementById(tag_id).innerHTML = ""
                if (post.tags != null && post.tags != "") {
                    for (tag of post.tags) {
                        document.getElementById(tag_id).innerHTML = `
                            <button class="tage rounded-pill"style="padding: 7px 20px; color: #f0ecff; background-color: rgb(82, 82, 82); ">
                                ${post.tags.name}
                            </button>       

                    `
                    }

                }
            }
        }).finally(() => {
           loederfun(false)
        }) 


}






navui()

