$.get('https://zagster-service.herokuapp.com/rides/locations_and_times', function (response) {
    console.log(response)

    var total_distance = 0;
    var distance = 0;
    var distances = [0];
    var userIDs = [Object.values(response[0])[0]];
    var lengths = [0];
    var average_distance = 0;
    var length = 0;
    for (var i = 0; i < response.length; i++) {

        start_lat = Object.values(response[i])[1];
        start_lon = Object.values(response[i])[2];
        end_lat = Object.values(response[i])[3];
        end_lon = Object.values(response[i])[4];


        if (start_lat != null && start_lon != null && end_lat != null && end_lon != null) {
            distance = 12756274 * Math.atan2(Math.sqrt(Math.pow(Math.sin((end_lat - start_lat) * Math.PI / 360), 2) + Math.cos(start_lat * Math.PI / 180) * Math.cos(end_lat * Math.PI / 180) * Math.pow(Math.sin((end_lon - start_lon) * Math.PI / 360), 2)), Math.sqrt(1 - (Math.pow(Math.sin((end_lat - start_lat) * Math.PI / 360), 2) + Math.cos(start_lat * Math.PI / 180) * Math.cos(end_lat * Math.PI / 180) * Math.pow(Math.sin((end_lon - start_lon) * Math.PI / 360), 2))));
            if (distance > 1626000) {
                distance = 0;
            }
            total_distance += distance;
            if (userIDs.includes(Object.values(response[i])[0])) {
                distances[userIDs.indexOf(Object.values(response[i])[0])] += distance;
                lengths[userIDs.indexOf(Object.values(response[i])[0])]++;
            } else {
                userIDs[userIDs.length] = Object.values(response[i])[0];
                if (distances[userIDs.length - 1] == null) {
                    distances[userIDs.length - 1] = distance;
                    lengths[userIDs.length - 1] = 1;
                } else {
                    distances[userIDs.length] = distance;
                    lengths[userIDs.length] = 1;
                }
            }
            length++;
        }
    }
    if (length > 0) {
        average_distance = total_distance / length;
    }
    for (var i = 0; i < userIDs.length; i++) {
        distances[i] /= lengths[i];
    }
    alert(distances);
    if (average_distance == 1) {
        document.getElementById("average_distance").innerHTML = "Average Distance: 1 meter";
    } else {
        document.getElementById("average_distance").innerHTML = "Average Distance: " + average_distance.toFixed(3) + " meters";
    }
    var ctx = document.getElementById('chart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: userIDs,
            datasets: [{
                label: 'Average Distances',
                data: distances
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});
