
var firebaseConfig = {
    apiKey: "AIzaSyB-ouDmd2b0kGRbaZW3vprnml6pZMD9_s0",
    authDomain: "track-the-trains.firebaseapp.com",
    databaseURL: "https://track-the-trains.firebaseio.com",
    projectId: "track-the-trains",
    storageBucket: "track-the-trains.appspot.com",
    messagingSenderId: "786993245325",
    appId: "1:786993245325:web:2a935c8a243842e6d946c4"
    };

firebase.initializeApp(firebaseConfig);

var database = firebase.database()

function displayData(snapshot) {
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
    edit.html("<button type='button' id='" + snapshot.key + "' class='btn btn-success' data-toggle='modal' data-target='#update-modal'>Update</button>")
    remove.html("<button type='button' id='" + snapshot.key + "' class='btn btn-danger'>Remove</button>")
    row.append(name, destination, frequency, nextArrival, minutesAway, edit, remove);
    $("#add-row").append(row);
}



database.ref("trains").orderByChild("date_added").on("child_added", function(snapshot) {
    var nextArrival = snapshot.val().next_arrival;
    var frequency = snapshot.val().frequency; 
    var minutesAway = snapshot.val().minutes_away;
    if (typeof snapshot.val().name === "undefined") {
        database.ref("trains/" + snapshot.key).remove();
    }
    var decrement = setInterval(function() {
        if (typeof snapshot.val().name === "undefined") {
            minutesAway = "";
            database.ref("trains/" + snapshot.key).remove();
        }
        else if (minutesAway > 0) {
            minutesAway--; 
            database.ref("trains/" + snapshot.key).update({
            minutes_away: minutesAway
        })
        $("#add-row").empty();
        database.ref("trains").orderByChild("date_added").on("child_added", displayData);
        database.ref("trains").off("child_added", displayData);
        } else {
            minutesAway = frequency;
            nextArrival = moment(nextArrival, "HH:mm").add(frequency, "minutes");
            nextArrival = nextArrival.format("HH:mm")
            database.ref("trains/" + snapshot.key).update({
            minutes_away: minutesAway,
            next_arrival: nextArrival
        })
        $("#add-row").empty();
        database.ref("trains").orderByChild("date_added").on("child_added", displayData);
        database.ref("trains").off("child_added", displayData);
        }
    }, 60000)
    database.ref("trains").on("value", function(snapshot) {
        if (!snapshot.val()) {
            clearInterval(decrement);
        }
    })
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

$(document).on("click", ".btn-success", function(event) {
    $("#update-train-name").val("");
    $("#update-destination").val("");
    $("#update-arrival").val("");
    event.preventDefault();
    var trainKey = $(this).attr("id");
    database.ref("trains/" + trainKey).once("value", function(snapshot) {
        var freq = snapshot.val().frequency;
        $("#update-submit").on("click", function(event) {
            event.preventDefault();
            var trainName = $("#update-train-name").val().trim();
            var destination = $("#update-destination").val().trim();
            var updateArrival = $("#update-arrival").val().trim();
            var arrivalTimeConverted = moment(updateArrival, "HH:mm").subtract(1, "years");
            var timeDifference = moment().diff(moment(arrivalTimeConverted), "minutes");
            var timeRemainder = timeDifference % freq;
            var minutesAway = freq - timeRemainder;
            var nextArrival = moment().add(minutesAway, "minutes");
            nextArrival = nextArrival.format("HH:mm");
            database.ref("trains/" + trainKey).update({
                    name: trainName,
                    destination: destination,
                    frequency: freq,
                    next_arrival: nextArrival,
                    minutes_away: minutesAway
            });
            $(this).off("click");
            $("#add-row").empty();
            database.ref("trains").orderByChild("date_added").on("child_added", displayData);
            database.ref("trains").off("child_added", displayData);
        })
    })
});

$(document).on("click", ".btn-danger", function(event) {
    var trainKey = $(this).attr("id");
    database.ref("trains/" + trainKey).remove();
    $("#add-row").empty();
    database.ref("trains").orderByChild("date_added").on("child_added", displayData);
    database.ref("trains").off("child_added", displayData);
});

database.ref("trains").orderByChild("date_added").on("child_added", displayData);


