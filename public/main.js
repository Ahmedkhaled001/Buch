const userfun = getCurruntUser()

const baseUrl = "https://tarmeezacademy.com/api/v1"
// -------------------------------------------GET POSTS--------------------------------------------- //

let currentPage = 1
let lastPage = 1

window.addEventListener("scroll", () =>{
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    if(endOfPage )(
        getPosts(false , currentPage ++)
    )
});

getPosts()
function getPosts(reload = true , page = 1){
    axios.get(`${baseUrl}/posts?limit=2&page=${page}`)
    .then((response) => {
        const posts = response.data.data
        lastPage = response.data.meta.last_page
        
        // console.log(response.data.data.body)

        if(reload){
            document.getElementById("postsNew").innerHTML = ""
        }

        for(post of posts){
            // console.log(posts)
            const author = post.author

            let user = getCurruntUser()
            let myPost = user != null && author.id == user.id
            let editBtnContent = ``
            let deleteBtnContent = ``

            if(myPost){
                editBtnContent = `<button id="edit-btn" class="btn btn-outline-secondary" onclick= editClicked('${encodeURIComponent(JSON.stringify(post))}') data-bs-toggle="modal" data-bs-target="#updatePostModal">Edit</button>`
                deleteBtnContent = `<button id="delete-btn" class="btn btn-outline-danger" onclick= deleteClicked('${encodeURIComponent(JSON.stringify(post))}') data-bs-toggle="modal" data-bs-target="#deletePostModal">Delete</button>`
            }
            // document.getElementById("postsNew").innerHTML = ""
            let content = `
            <div class="post d-flex justify-content-center my-4 rounded" >
                <div class="card col-6">
                    <div class="card-header" style="display: flex; justify-content: space-between;">
                        <div>
                            <img src="${author.profile_image}" style="width: 40px; height: 40px;">
                            <span>
                                <a href="#" class="Profile-link"><h6 style="display: inline;">${author.username}</h6></a>
                            </span>
                        </div>
                        <div>
                        ${editBtnContent}
                        ${deleteBtnContent}
                        </div>
                    </div>
                    <div class="card-body shadow" onclick=(goToPost(${post.id})) style="cursor:pointer;">
                        <p class="card-text">${post.body}</p>
                        <h6 style="color: rgb(179, 179, 179); font-size: 13px;">${post.created_at}</h6>
                        <img src="${post.image}" style="height: 300px; width: 100%;" class="col-6">
                        <hr>
                        <span style="font-size: 13px;">
                            <a href="#"><i class="bi bi-pen"></i></a>
                            <p style="display: inline;">(${post.comments_count}) Commentes</p>
                        </span>
                    </div>
                </div>
            </div>
            `
            document.getElementById("postsNew").innerHTML += content
        }
    })
}

//location when clicked any post
function goToPost(postID){
    window.location= `postpreview.html?postID=${postID}`

}

//get post id
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("postID")


// ---------------------------------------------LOGIN----------------------------------------------- //
let logBtnNav = document.getElementById("logBtnNav") 
let signUpBtnNav = document.getElementById("signUpBtnNav") 
let logoutBtn = document.getElementById("logoutBtn") 
let addBtn = document.getElementById("addPostBtn")

document.getElementById("loginBtn").addEventListener("click", () => {
    const userAdd = document.getElementById("userNameInput").value
    const passAdd = document.getElementById("passwordInput").value

    axios.post(`${baseUrl}/login`, 
    {
        "username": userAdd,
        "password": passAdd
    }
    )
    .then(function (response) {
        let token = response.data.token
        let user = response.data.user
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        console.log("token received" , token);

        //To Close Modal when Click Login
        const modal = document.getElementById("exampleModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        logged()
    })

})



function loggedIn(){
    //To Change Buttons When Click Login
    document.getElementById("logoutBtn").style.display = 'block'
    document.getElementById("nav-log-out").style.display = 'flex'
    document.getElementById("logBtnNav").style.display = 'none'
    document.getElementById("signUpBtnNav").style.display = 'none'
    document.getElementById("nav-user-img").src = userfun.profile_image
    document.getElementById("nav-user-name").innerHTML = userfun.username

    
    if(addBtn != null){
        addBtn.style.display = 'block'
    }

}

function loggedOut(){
        console.log("hello");
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        document.getElementById("logoutBtn").style.display = 'none'
        document.getElementById("nav-log-out").style.display = 'none'
        document.getElementById("logBtnNav").style.display = 'block'
        document.getElementById("signUpBtnNav").style.display = 'block'

        if(addBtn != null){
            addBtn.style.display = 'none'
        }
        
}



function logged(){
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    if( token != null , user != null ){
        loggedIn()
    }else{
        loggedOut()
    }
}

logged()


// ---------------------------------------------Signup----------------------------------------------- //
document.getElementById("signUpBtn").addEventListener("click", () => {
    const nameAdd = document.getElementById("nameSignup").value
    const userAdd = document.getElementById("userNameSignup").value
    const passAdd = document.getElementById("passwordSignup").value
    const profileImage = document.getElementById("profileImage").files[0]
    
    let formData = new FormData()
    formData.append("name", nameAdd)
    formData.append("username", userAdd)
    formData.append("password", passAdd)
    formData.append("profile_image", profileImage)

    axios.post(`${baseUrl}/register`, formData
    )
    .then(function (response) {
        console.log(response);
        let token = response.data.token
        let user = response.data.user
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        console.log("token received" , token);

        //To Close Modal when Click Login
        const modal = document.getElementById("signUpModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        loggedIn()



    })
    

})

// -------------------------------------------create post--------------------------------------------- //

function creatPostClicked(){
    console.log('post abroved');
    const body = document.getElementById("message-text-post").value
    const image = document.getElementById("imagePost").files[0]
    const token = localStorage.getItem('token')

    // // check image type
    // if (['image/jpg', 'image/jpeg', 'image/png'].indexOf(image.type) === -1) {
    //     alert('image type not supported')
    // }

    //way to send data by form type
    let formData = new FormData()
    formData.append("body", body)
    formData.append("image", image)

    //way to send data by json type
    // const params = {
    //     "body": body
    // }

    const headers = {
        'Content-Type': "multipart/form-data",
        'authorization': `Bearer ${token}`
    }

    axios.post(`${baseUrl}/posts`, formData,
    {
        headers: headers
    }
    )
    .then(function (response) {


        //To Close Modal when Click Login
        const modal = document.getElementById("createPostModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        getPosts()
    })
    .catch( (error) =>{
        alert(error.response.data.message)
    }
    )
}


function getCurruntUser(){
    let user = null
    const storageUser = localStorage.getItem("user")

    if( storageUser != null ){
        user = JSON.parse(storageUser)
    }
    return user
}

function changehandle(){
    console.log("adsadasdsad")
}

// -------------------------------------------view post--------------------------------------------- //
viewPost()
async function viewPost(){
    await axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
        const post = response.data.data
        const author = post.author
        const comments = post.comments

        
        let commentContent = ``

        for(comment of comments){

            document.getElementById('comments').innerHTML = ""
            commentContent += 
            `
            <div id="comments" style="background-color: rgb(225, 225, 225); border-bottom: 10px; width: 345px;" class="p-2">
                <div id="comment" style="background-color: rgb(192, 192, 192);  margin-bottom: 2px" class="p-1 py-2 rounded">

                    <div class="px-1">
                    <img src="${comment.author.profile_image}" alt="img1" class="rounded-circle" style="width: 30px; height: 30px;">
                    <b>${comment.author.username}</b>
                    </div>
                    <div>
                    <p class="px-5">${comment.body}</p>
                    </div>
                </div>

            </div>


            `


            document.getElementById('comments').innerHTML += commentContent

        }

        

        let user = getCurruntUser()
        let myPost = user != null && author.id == user.id
        let editBtnContent = ``

        if(myPost){
            editBtnContent = `<button id="edit-btn" class="btn btn-secondary" onclick= editClicked('${encodeURIComponent(JSON.stringify(post))}') data-bs-toggle="modal" data-bs-target="#updatePostModal">Edit</button>`
        }

        let content = `
        <div class="post d-flex justify-content-center my-4 rounded" style=" flex-direction: column; align-items: center;" >
            <div class="card" style="width: 345px;">
                <div class="card-header" style="display: flex; justify-content: space-between;">
                    <div>
                        <img src="${author.profile_image}" style="width: 40px; height: 40px;">
                        <span>
                            <a href="#" class="Profile-link"><h6 style="display: inline;">${author.username}</h6></a>
                        </span>
                    </div>
                    ${editBtnContent}
                    </div>
                <div class="card-body " onclick=(goToPost(${post.id})) style="cursor:pointer;">
                    <p class="card-text" id="card-text">${post.body}</p>
                    <h6 style="color: rgb(179, 179, 179); font-size: 13px;">${post.created_at}</h6>
                    <img src="${post.image}" style="height: 300px; width: 100%;" class="col-6">
                    <hr>
                    <span style="font-size: 13px;">
                        <a href="#"><i class="bi bi-pen"></i></a>
                        <p style="display: inline;">(${post.comments_count}) Commentes</p>
                    </span>
                </div>
            </div>
            <div id="comments">
                ${commentContent}
            </div>
            
            <div style="display: flex; background-color: rgb(225, 225, 225); padding: 10px; margin-bottom: 50px; width: 345px; border-top: outset; border-bottom: ridge;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;">
            <input type="text" style="border-radius: 5px; margin-right: 3px; padding-left: 8px; border:none" class="input-group" id="input-comment" placeholder="Write Your Comment Here ...">
            <button class="btn btn-outline-primary" onclick="addCommentN()">Send</button>
            </div>
        </div>
        `
        document.getElementById("view-post").innerHTML = content

    })
}
// -------------------------------------------add Comments--------------------------------------------- //
function addCommentN(){
    let commValue = document.getElementById("input-comment").value
    let params = {
        "body": commValue,
    }

    let token = localStorage.getItem("token")

    let url = `${baseUrl}/posts/${id}/comments`

    axios.post(url , params , {
        headers:{
            "authorization" : `Bearer ${token}`
        }
        
    })
    .then((response) => {
        const commAuthor = response.data.data.author
        const commView = commAuthor.body
        viewPost()
    
    }).catch((err) => {
        alert(err.response.data.message)
    })
}
// -------------------------------------------//add Comments//--------------------------------------------- //

// -------------------------------------------Update Post--------------------------------------------- //
function editClicked(postObject){

    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("message-text-post-update").innerHTML = post.body
    document.getElementById("update-id-input").value = post.id

   
}

function updatePostClicked(){


    const id = document.getElementById("update-id-input").value
    const url = `${baseUrl}/posts/${id}`
    const token = localStorage.getItem("token")
    const body = document.getElementById("message-text-post-update").value
    
    

    

    let formData = new FormData()
    formData.append("body" , body)

    formData.append("_method","put" )

    // const params = {
    //     "body": body
    // }


    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    axios.post(url , formData , {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("updatePostModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        getPosts()
    })
}

// -------------------------------------------//Update Post//--------------------------------------------- //


// ---------------------------------------------Delete Post----------------------------------------------- //

function deleteClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("delete-id-input").value = post.id
}

function deletePostConfirmation(){
    const id = document.getElementById("delete-id-input").value
    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    const url = `${baseUrl}/posts/${id}`

    axios.delete(url , {
        headers: headers
    }).then((response) => {
        const modal = document.getElementById("deletePostModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        getPosts()
    })
}
// -------------------------------------------//Delete Post//--------------------------------------------- //
