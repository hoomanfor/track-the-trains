
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

$("#submit").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstArrival = $("#first-arrival").val().trim();
    var frequency = $("#frequency").val().trim();

    var arrivalTimeConverted = moment(firstArrival, "HH:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(arrivalTimeConverted), "minutes");
    var timeRemainder = timeDifference % frequency;
    var minutesAway = frequency - timeRemainder;
    var nextArrival = moment().add(minutesAway, "minutes");
    nextArrival = nextArrival.format("HH:mm");

    var train = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        next_arrival: nextArrival,
        minutes_away: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    }
    console.log(train);
    
    database.ref().push({train});

});

database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());
    var row = $("<tr>");
    var name = $("<td>");
    var destination = $("<td>");
    var frequency = $("<td>");
    var nextArrival = $("<td>");
    var minutesAway = $("<td>");
    name.text(snapshot.val().train.name);
    destination.text(snapshot.val().train.destination);
    frequency.text(snapshot.val().train.frequency);
    nextArrival.text(snapshot.val().train.next_arrival);
    minutesAway.text(snapshot.val().train.minutes_away);
    row.append(name, destination, frequency, nextArrival, minutesAway);
    $("#add-row").append(row);
}, function(errorObject) {
    console.log("errorObject.code: " + errorObject.code);
});



