// require('dotenv').config()
// console.log(process.env.keys)

var firebaseConfig = {
    apiKey: 'AIzaSyCoi0g_uR2MK8rZSPkaGCohAafY238GKuE',
    authDomain: "can-you-sing.firebaseapp.com",
    projectId: "can-you-sing",
    storageBucket: "can-you-sing.appspot.com",
    messagingSenderId: "934455640156",
    appId: "1:934455640156:web:72e8fcf867dd7ccb23e699"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const uploadForm = document.querySelector('#upload-form');
const submitBtn = document.querySelector('#submit-btn');
const progressContainer = document.querySelector('.progress')
const progressBar = document.querySelector('#progress-bar');
const progressMsg = document.querySelector(".progress-msg");

if(uploadForm != null){
    uploadForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        if(document.getElementById("name").value != "" && document.getElementById("email").value != "" && document.getElementById("age").value != "" && document.getElementById("city").value != "" && document.getElementById("file-upload").files[0] != ""){
            let title = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let age = document.getElementById("age").value;
            let city = document.getElementById("city").value;
            let video = document.getElementById("file-upload").files[0];
            let message = document.getElementById("message");

            const storageRef = firebase.storage().ref();
            const stroageChild = storageRef.child(video.name);
            const postVideo = stroageChild.put(video)

            await new Promise((resolve) => {
                postVideo.on('state_changed', (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if(progressContainer != null){
                        progressContainer.style.display = true;
                    }
                    if(submitBtn != null){
                        submitBtn.disabled = true;
                    }
                    if(progressBar != null){
                        progressBar.value = progress;
                    } 
                }, (error) => {
                    console.log(error);
                }, async() => {
                    const downloadUrl = await stroageChild.getDownloadURL();
                    d = downloadUrl;
                    resolve();
                }
                );
            });
            let post = {
                title,
                email,
                age,
                city,
                video: d,
                // fileref : fileRef.location.path
            }
            const addPost = await firestore.collection("posts").add(post);
            const userID = addPost.id;
            
            if(submitBtn != null){
                submitBtn.disabled = false;
                progressMsg.innerHTML = "File successfully uploaded..."
                // window.location.replace(index.html);
                document.getElementById("message-wrapper").style.visibility = "visible"
                let markup =
                `<h4>Congratulation ${title}</h4>
                <p>Your registration ID is <b>${userID}<b></p>
                <p>Your journey to stardom commence now!!</p>

                <a href="../index.html">Return to Home</a>
                `
                message.insertAdjacentHTML("beforeend", markup)
            }

        }else{
            alert("Fill all fields with asteriks")
        }
    })
}
