let allcards= document.getElementById("allcards")

function login() {
    let loginusername = document.getElementById("username").value
    let loginpassword = document.getElementById("Password").value
    loederfun(true)
    axios.post(`https://tarmeezacademy.com/api/v1/login`,

        {
            "username": loginusername,
            "password": loginpassword
        }

    )
        .then((response) => {
            let token = response.data.token
            let user = response.data.user
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            let model = document.getElementById("login-modal")
            let modalinstance = bootstrap.Modal.getInstance(model)
            modalinstance.hide()
            alerts(`logged in successfully`, "success")
            navui()
            getposts()

        })
        .catch(error => {
            console.log(error.response.data.message);
            
            let errormassag = error.response.data.message
            alerts(errormassag, "danger")
        }).finally(() => {
            loederfun(false)
         }) 

}
function register() {
    let registername = document.getElementById("register-name").value
    let registerusername = document.getElementById("register-username").value
    let registerpassword = document.getElementById("register-Password").value
    let profile_image = document.getElementById("Profile-image").files[0]
    let form_data = new FormData()
    form_data.append("name", registername)
    form_data.append("username", registerusername)
    form_data.append("password", registerpassword)
    form_data.append("image", profile_image)
    loederfun(true)
    axios.post(`https://tarmeezacademy.com/api/v1/register`, form_data)
        .then((response) => {
            let token = response.data.token
            let user = response.data.user
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            let model = document.getElementById("register-modal")
            let modalinstance = bootstrap.Modal.getInstance(model)
            modalinstance.hide()
            // img_div_profile.url(profile_image.file.name)
            navui()
            alerts(`User Register successfully`, "success")
            getposts()

        })
        .catch(error => {
            let errormassag = error.response.data.message
            alerts(errormassag, "danger")
        }).finally(() => {
            loederfun(false)
         }) 

}
function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    alerts(`logged out successfully`, "success")
    navui()


}
function alerts(masseg, type = "success") {

    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        alertPlaceholder.append(wrapper)
    }
    appendAlert(masseg, type)

}

function getcurrentuser() {
    let user = null
    let userinstorg = localStorage.getItem("user")
    if (userinstorg != null) {
        user = JSON.parse(userinstorg)
    }
    return user
}
function getuserandimagforcomments(id) {
    localStorage.setItem("current-id-posts-clicked-by-yazan-mohamed-sawan", id)
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
        .then((response) => {
            let comments = response.data.data.comments
            console.log(comments);
            let div_comments = document.getElementById("div_comments").innerHTML = ``
            for (comment of comments) {
                let div_comments = document.getElementById("div_comments").innerHTML += `

                <div class="mb-3 comment">
                    <div class="comment-header" style="display: inline-block; margin-right: 10px;">
                        <img src="${comment.author.profile_image}" class="border rounded-circle" alt="" id="profile_imag_incomments"
                            style="width: 50px; height: 50px;">
                        <b id="userincomment">${comment.author.username}</b>
                    </div>
                    <div class="commentbody" style="display: inline-block;" >
                        <p>${comment.body}</p>
                    </div>
                </div>
                <hr>
                `
            }
        })
}
function creat_commment() {
    let id_post = localStorage.getItem("current-id-posts-clicked-by-yazan-mohamed-sawan")
    let token = localStorage.getItem("token")
    let input_comment = document.getElementById("input_comment")
    loederfun(true)
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id_post}/comments`,
        {
            "body": input_comment.value
        },
        {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }
    ).then((response) => {
        getuserandimagforcomments(id_post)
        allcards.innerHTML = ``
        input_comment.value = ``
        getposts()
    })
        .catch(error => {
            let errormassag = error.response.data.message
            alerts(errormassag, "danger")
        }).finally(() => {
            loederfun(false)
         }) 

}


function creatpost() {
    let id_post = localStorage.getItem("current-id-posts-clicked-by-yazan-mohamed-sawan")
    let title = document.getElementById("post-Title").value
    let body = document.getElementById("post-Body").value
    let post_file = document.getElementById("post-file").files[0]
    let token = localStorage.getItem("token")
    let form_data = new FormData()
    form_data.append("body", body)
    form_data.append("title", title)
    form_data.append("image", post_file)
    let model_title = document.getElementById("creat-modal-title")
    if (model_title.innerHTML == "CreatPost") {
        loederfun(true)
        axios.post(`https://tarmeezacademy.com/api/v1/posts`, form_data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                }
            })

            .then((response) => {
                let model = document.getElementById("creat-modal")
                let modalinstance = bootstrap.Modal.getInstance(model)
                modalinstance.hide()
                alerts("Created Post successfully ", "success")
                allcards.innerHTML = ``
                getposts()
                getuser()



            })
            .catch(error => {
                let errormassag = error.response.data.message
                alerts(errormassag, "danger")

            }).finally(() => {
                loederfun(false)
             }) 


    }
    else {
        console.log("dsa");
        form_data.append("_method", "put")
        loederfun(true)

        axios.post(`https://tarmeezacademy.com/api/v1/posts/${id_post}`, form_data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                }
            })

            .then((response) => {
                console.log("dsa");
                let model = document.getElementById("creat-modal")
                let modalinstance = bootstrap.Modal.getInstance(model)
                modalinstance.hide()
                alerts("Edit Post successfully ", "success")
                allcards.innerHTML = ``
                getposts()



            })
            .catch(error => {
                let errormassag = error.response.data.message
                alerts(errormassag, "danger")

            }).finally(() => {
                loederfun(false)
             }) 


    }


}

function editpost(postobg) {
    let post = JSON.parse(decodeURIComponent(postobg))
    localStorage.setItem("current-id-posts-clicked-by-yazan-mohamed-sawan", post.id)
    console.log(post);

    document.getElementById("creat-modal-title").innerHTML = `Edit post`
    let post_Body = document.getElementById("post-Body").value = post.body
    document.getElementById("btn-post-creat").innerHTML = `EditPost`
    let editModal = new bootstrap.Modal(document.getElementById("creat-modal"), {})
    editModal.toggle()
    if (post.title == null) {
        document.getElementById("post-Title").innerHTML = ""
    }
    else {
        document.getElementById("post-Title").value = `${post.title}`
    }
}


function deletepost(postobg) {
    let post = JSON.parse(decodeURIComponent(postobg))
    localStorage.setItem("current-id-posts-clicked-by-yazan-mohamed-sawan", post.id)
}


function deletepostfun() {
    let token = localStorage.getItem("token")
    let post_id = localStorage.getItem("current-id-posts-clicked-by-yazan-mohamed-sawan")
    loederfun(true)
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${post_id}`,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            let model = document.getElementById("delete-modal")
            let modalinstance = bootstrap.Modal.getInstance(model)
            modalinstance.hide()
            alerts("delete Post successfully ", "success")
            allcards.innerHTML = ``
            getposts()
            getuser()

        })
        .catch(error => {
            let errormassag = error.response.data.message
            alerts(errormassag, "danger")

        }).finally(() => {
           loederfun(false)
        }) 


}


function navui(user = null, imag = null) {
    let token = localStorage.getItem("token")
    let divlogin = document.getElementById("divlogin")
    let divlogout = document.getElementById("divlogout")
    let addbotton = document.getElementById("addbotton")



    if (token == null) {
        divlogin.style.setProperty("display", "flex", "important")
        divlogout.style.setProperty("display", "none", "important")
        div_imagand_username.style.setProperty("display", "none", "important")
        if(addbotton != null){
            addbotton.style.setProperty("display", "none", "important")
        }

    }
    else {
        divlogin.style.setProperty("display", "none", "important")
        divlogout.style.setProperty("display", "flex", "important")
        div_imagand_username.style.setProperty("display", "flex", "important")
        let user = getcurrentuser()
        document.getElementById("usernameinnav").innerHTML = user.username
        document.getElementById("img-div-profile").src = user.profile_image
        if(addbotton != null){
            addbotton.style.setProperty("display", "flex", "important")
        }
    }
}




function getuseridsame(){
    let user = getcurrentuser()
    window.location = `profile.html?userid=${user.id}`

}


function creatpostmodalfun() {
    document.getElementById("creat-modal-title").innerHTML = `CreatPost`
    let post_Body = document.getElementById("post-Body").value = ``
    document.getElementById("btn-post-creat").innerHTML = `Creat`
    let editModal = new bootstrap.Modal(document.getElementById("creat-modal"), {})
    editModal.toggle()
    document.getElementById("post-Title").value = ``
}

function loederfun(tip=true){
    if(tip){
        document.getElementById("loeder").style.visibility=`visible`
    }
    else{
        document.getElementById("loeder").style.visibility=`hidden`

    }
}



