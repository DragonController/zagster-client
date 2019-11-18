$.get('https://zagster-service.herokuapp.com/rides/locations_and_times', function (response) {
    var total_distance = 0;
    var length = 0;
    for (var i = 0; i < response.length; i++) {
        start_lat = Object.values(response[i])[1];
        start_lon = Object.values(response[i])[2];
        end_lat = Object.values(response[i])[3];
        end_lon = Object.values(response[i])[4];

        var a = Math.pow(Math.sin((end_lat - start_lat) * Math.PI / 360), 2) + Math.cos(start_lat * Math.PI / 180) * Math.cos(end_lat * Math.PI / 180) * Math.pow(Math.sin((end_lon - start_lon) * Math.PI / 360), 2);
        if (start_lat != null && start_lon != null && end_lat != null && end_lon != null) {
            total_distance += Math.abs(12742e3 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
            length++;
        }
    }
    var average_distance = total_distance / length;
    document.getElementById("average_distance").innerHTML = "Average Distance: " + average_distance.toFixed(3) + " meters";
    if (average_distance == 1) {
        document.getElementById("average_distance").innerHTML = "Average Distance: 1 meter";
    }
});
