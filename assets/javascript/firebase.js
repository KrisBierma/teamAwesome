// Initialize Firebase
var config = {
    apiKey: "AIzaSyCwhOakfPVFjGYSWZ9KwaM8EH9lqw5cY1A",
    authDomain: "teamawesome-f39d7.firebaseapp.com",
    databaseURL: "https://teamawesome-f39d7.firebaseio.com",
    projectId: "teamawesome-f39d7",
    storageBucket: "",
    messagingSenderId: "539466789478"
};
firebase.initializeApp(config);

var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var txtEmailLogin = document.getElementById('txtEmail');
var txtPasswordLogin = document.getElementById('txtPassword');
var btnLogin = document.getElementById('btnLogin');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogOut = document.getElementById('btnLogOut');

var uid; //get uid to create new node off root (1st level)
var name; //get user's name
// console.log(uid, name);

//Add login event
btnLogin.addEventListener('click', e => {
    e.preventDefault();
  //Get email and password
  var email = txtEmailLogin.value;
  var password = txtPasswordLogin.value;

  //Sign In
  var promise = firebase.auth().signInWithEmailAndPassword(email, password)
  promise.catch(e => console.log(e.message));
  promise.then(function(){
      console.log(firebase.auth().currentUser);
  });
  //if error message above, stop code below!!!!
//   promise.then(function(){
//     var user = firebase.auth().currentUser;
//     console.log(user,uid);
//     if (user != null){
//         console.log(user.uid);
//         uid=user.uid;
//         database.ref(uid).set({
//             name:name, //maybe delete later
//             tab1:false,
//             tab2:false,
//             tab3:false
//         });
//         user.updateProfile({
//             displayName:name
//         }).then(function(){
//             name=user.displayName;
//         }, function(error){
//             console.log("error");
//         });
//         console.log(uid, name);
//     }
//   });
  $("#loginForm")[0].reset();
});

//Add SignUp event
btnSignUp.addEventListener('click', e => {
  //Get email and pass
  //ToDo: Check 4 REAL email
  e.preventDefault();
  var email = txtEmail.value;
  var pass = txtPassword.value;
  var name = txtName.value;//get name from form
  $("#hiUser").text("Hi " + name);
  console.log(name);
  var auth = firebase.auth();
  //Sign Up
  var promise = auth.createUserWithEmailAndPassword(email, pass)
  promise.catch(e => console.log(e.message));
  //if error message above, stop code below!!!!
  promise.then(function(){
    var user = firebase.auth().currentUser;
    console.log(user,uid);
    if (user != null){
        console.log(user.uid);
        uid=user.uid;
        database.ref(uid).set({
            name:name, //maybe delete later
            tab1:false,
            tab2:false,
            tab3:false
        });
        user.updateProfile({
            displayName:name
        }).then(function(){
            name=user.displayName;
        }, function(error){
            console.log("error");
        });
        console.log(uid, name);
    }
  });
  $("#loginForm")[0].reset();

});

$("#btnLogOut").on("click", function(event){
    firebase.auth().signOut().then(function(){
        console.log("Sign out successful");
        $("#hiUser").empty();
        uid=undefined;
        name=undefined;
        console.log(uid,name);
    }).catch(function(error){
        console.log("Error in signing out");
    });
    $("#loginForm")[0].reset();
});

//Add a realtime listener -- this works!!
firebase.auth().onAuthStateChanged(function(user) {
  if (user!=null) {
    uid=user.uid;
    name=user.displayName;
    // console.log(uid, name);
    $("#hiUser").text("Hi " + name);
    //needs to detect user sign in and update page
    


} else {
    console.log('not logged in');
  }
});

var database = firebase.database();


$("#addTab").on("click", function(event){
    //to do:when add tab, add delete button to modal
    //to do:if delete btn clicked, delete fb info
    // console.log(uid);
    uid=firebase.auth().currentUser.uid; 
    var tabName=$("#tabName").val().trim();
    var tabStreet=$("#tabStreet").val().trim();
    var tabCity=$("#tabCity").val().trim();
    var tabZip=$("#tabZip").val().trim();
    console.log(tabName,tabStreet,tabCity,tabZip);
    console.log(uid);//uid

    //make sure all info is included
    if(tabStreet!=""&&tabStreet!=""&&tabCity!=""&&tabZip!=""){
        // cycle through all tabs
        label: for (var i=1; i<4; i++){
            var tabInfo=database.ref(uid).child("tab"+i).key;
            var tabValue;
            database.ref(uid).child("tab"+i).once("value", function(snap){
                tabValue=snap.val();
                console.log(tabValue);
            });
            //if there's an empty (false) tab, push the data
            if (tabValue === false){
                database.ref(uid).child(tabInfo).update({
                    tabName:capUpper(tabName),
                    tabStreet:capUpper(tabStreet),
                    tabCity:capUpper(tabCity),
                    tabZip:tabZip,
                });
                console.log(tabName);
                break label;
            } 
            //to do:else modal below with "You've reached the max tabs. Delete one first before adding another."
            // else {console.log("You've reached the max tabs. Delete one first before adding another.")}   
        }
    }
    else {
        console.log("error message - need more info");
    };
    $("#mapTabs")[0].reset();

});

//populates tabs from firebase info
database.ref(uid).on("value", function(snapShot) {
    var tabInfo=database.ref(uid).key;//uid
    var chillins=snapShot.child(uid).val();//children of uid
    // console.log(t1, t2, t3); //keep this

    if (uid !== undefined){
        var t1=chillins.tab1;//values of tab1
        var t2=chillins.tab2;
        var t3=chillins.tab3;
        var tabInfo=database.ref(uid).key;
        if (typeof t1 !== "boolean"){
            var newTab=$("<li>").addClass("tab col s3");
            var newA=$("<a id=tab1>").text(t1.tabName);
            newTab.append(newA);
            $(".tabs").append(newTab);
        }
        if (typeof t2 !== "boolean"){
            var newTab=$("<li>").addClass("tab col s3");
            var newA=$("<a id=tab2>").text(t2.tabName);
            newTab.append(newA);
            $(".tabs").append(newTab);
        }
        if (typeof t3 !== "boolean"){
            var newTab=$("<li>").addClass("tab col s3");
            var newA=$("<a id=tab3>").text(t3.tabName);
            newTab.append(newA);
            $(".tabs").append(newTab);
        }
    }
});

//when app opens, assign tab ids from firebase
//if tab has info, .update instead of push
//when address pushed, call function to change address to lat and long, then initmap map to that