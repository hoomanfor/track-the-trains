
var firebaseConfig = {
    apiKey: "AIzaSyB-ouDmd2b0kGRbaZW3vprnml6pZMD9_s0",
    authDomain: "track-the-trains.firebaseapp.com",
    databaseURL: "https://track-the-trains.firebaseio.com",
    projectId: "track-the-trains",
    storageBucket: "",
    messagingSenderId: "786993245325",
    appId: "1:786993245325:web:2a935c8a243842e6d946c4"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database()

function displayData() {
    $("#add-row").empty();
    database.ref("trains").on("child_added", function(snapshot) {
        console.log("LOOK!", snapshot.key)
        var row = $("<tr>");
        var name = $("<td>");
        var destination = $("<td>");
        var frequency = $("<td>");
        var nextArrival = $("<td>");
        var minutesAway = $("<td>");
        var edit = $("<td>");
        var remove = $("<td>");
        name.text(snapshot.val().name);
        destination.text(snapshot.val().destination);
        frequency.text(snapshot.val().frequency);
        nextArrival.text(snapshot.val().next_arrival);
        minutesAway.text(snapshot.val().minutes_away);
        edit.html("<button type='button' class='btn btn-success'>Edit</button>")
        remove.html("<button type='button' class='btn btn-danger'>Remove</button>")
        row.append(name, destination, frequency, nextArrival, minutesAway, edit, remove);
        $("#add-row").append(row);
        }, function(errorObject) {
            console.log("errorObject.code: " + errorObject.code);
    });
}

displayData()

database.ref("trains").on("child_added", function(snapshot) {
    var trainKey = snapshot.key
    var nextArrival = snapshot.val().next_arrival;
    console.log("nextArrival", nextArrival);
    var frequency = snapshot.val().frequency; 
    console.log("frequency", frequency);
    var minutesAway = snapshot.val().minutes_away;
    var decrement = setInterval(function() {
        if (minutesAway > 0) {
            minutesAway--; 
            console.log("IF! minutesAway", minutesAway)
            database.ref("trains/" + trainKey).update({
                minutes_away: minutesAway
            })
            displayData()
        } else {
            minutesAway = frequency;
            nextArrival = moment(nextArrival, "HH:mm").add(frequency, "minutes");
            nextArrival = nextArrival.format("HH:mm")
            console.log("newArrival", nextArrival);
            database.ref("trains/" + trainKey).update({
                minutes_away: minutesAway,
                next_arrival: nextArrival
            })
            displayData()
        }
    }, 60000);
});



$("#submit").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstArrival = $("#first-arrival").val().trim();
    var frequency = parseInt($("#frequency").val().trim());

    var arrivalTimeConverted = moment(firstArrival, "HH:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(arrivalTimeConverted), "minutes");
    var timeRemainder = timeDifference % frequency;
    var minutesAway = frequency - timeRemainder;
    var nextArrival = moment().add(minutesAway, "minutes");
    nextArrival = nextArrival.format("HH:mm"); 
    
    database.ref("trains").push({
        name: trainName,
        destination: destination,
        frequency: frequency,
        next_arrival: nextArrival,
        minutes_away: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    var trainName = $("#train-name").val("");
    var destination = $("#destination").val("");
    var firstArrival = $("#first-arrival").val("");
    var frequency = $("#frequency").val("");
});




// ----

var now = moment("12:00", "HH:mm").add(30, "minutes"); 
now = now.format("HH:mm")
console.log(now)

// ----

// database.ref("trains/-LqX6bWwvMDm9zIX3-er").on("value", function(snapshot) {
//     console.log("LOOK 2!", snapshot.val());
// }, function(errorObject) {
//     console.log("errorObject.code: " + errorObject.code)
// }); 

// ----
// This is how I will update values in the database.
// database.ref("trains/-LqX6bWwvMDm9zIX3-er").update({
//     name: "Test 2",
// });
// ----

// ----
// This is a promise after the initial push
// .then(function(snapshot) {
//     console.log(snapshot.key)
//     database.ref("trains/" + snapshot.key).update({
//         name: "Child Changed Works!"
//     })
// })
// ----

// ----
// This is my initial promise for counting down minutes away and updating the database:
// .then(function(snapshot) {
//     var trainKey = snapshot.key
//     var decrement = setInterval(function() {
//         if (minutesAway > 0) {
//             minutesAway--; 
//             console.log("IF! minutesAway", minutesAway)
//             database.ref("trains/" + trainKey).update({
//                 minutes_away: minutesAway
//             });
//             displayData();
//         } else {
//             clearInterval(decrement);
//         }
//     }, 2000);
// });
// ----


