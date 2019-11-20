$.get('https://zagster-service.herokuapp.com/rides/locations_and_times', function (response) {
    console.log(response)
    var total_distance = 0;
    var average_distance = 0;
    var length = 0;
    for (var i = 0; i < response.length; i++) {
        start_lat = Object.values(response[i])[1];
        start_lon = Object.values(response[i])[2];
        end_lat = Object.values(response[i])[3];
        end_lon = Object.values(response[i])[4];


        if (start_lat != null && start_lon != null && end_lat != null && end_lon != null) {
            total_distance += 12756274 * Math.atan2(Math.sqrt(Math.pow(Math.sin((end_lat - start_lat) * Math.PI / 360), 2) + Math.cos(start_lat * Math.PI / 180) * Math.cos(end_lat * Math.PI / 180) * Math.pow(Math.sin((end_lon - start_lon) * Math.PI / 360), 2)), Math.sqrt(1 - (Math.pow(Math.sin((end_lat - start_lat) * Math.PI / 360), 2) + Math.cos(start_lat * Math.PI / 180) * Math.cos(end_lat * Math.PI / 180) * Math.pow(Math.sin((end_lon - start_lon) * Math.PI / 360), 2))));
            length++;
        }
    }
    if (length > 0) {
        average_distance = total_distance / length;
    }
    if (average_distance == 1) {
        document.getElementById("average_distance").innerHTML = "Average Distance: 1 meter";
    } else {
        document.getElementById("average_distance").innerHTML = "Average Distance: " + average_distance.toFixed(3) + " meters";
    }
});
