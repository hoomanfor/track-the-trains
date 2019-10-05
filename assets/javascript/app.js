
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

// var database = firebase.ref()

$("#submit").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    console.log(trainName);
    var destination = $("#destination").val().trim();
    console.log(destination);
    var firstArrival = $("#first-arrival").val().trim();
    console.log(firstArrival);
    var frequency = $("#frequency").val().trim();
    console.log(frequency);

    var arrivalTimeConverted = moment(firstArrival, "HH:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(arrivalTimeConverted), "minutes");
    var timeRemainder = timeDifference % frequency;
    var minutesAway = frequency - timeRemainder;
    console.log("minutesAway", minutesAway);
    var nextArrival = moment().add(minutesAway, "minutes");
    console.log("nextArrival", nextArrival.format("HH:mm"));
});

