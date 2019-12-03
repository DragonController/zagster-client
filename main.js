$.get('https://zagster-service.herokuapp.com/rides/locations_and_times', function (response) {
    console.log(response)

    var distances = [0];
    var times = [0];
    var speeds = [0];
    var total_distance = 0;
    var total_time = 0;
    var average_distance = 0;
    var average_time = 0;
    var average_speed = 0;
    var distance = 0;
    var userIDs = [Object.values(response[0])[0]];
    var arrays = [[0, 0], [0, 0]];
    var lengths = [0];
    var length = 0;
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (var i = 0; i < response.length; i++) {
        var start_lat = Object.values(response[i])[1];
        var start_lon = Object.values(response[i])[2];
        var end_lat = Object.values(response[i])[3];
        var end_lon = Object.values(response[i])[4];
        var start_time = Object.values(response[i])[5];
        if (start_time != null) {
            start_time = Object.values(response[i])[5].replace("Z", "").split("-");
            start_time[3] = start_time[2].split("T")[1];
            start_time[2] = start_time[2].split("T")[0];
            start_time[5] = start_time[3].split(":")[2];
            start_time[4] = start_time[3].split(":")[1];
            start_time[3] = start_time[3].split(":")[0];
        }
        var end_time = Object.values(response[i])[6];
        if (end_time != null) {
            end_time = Object.values(response[i])[6].replace("Z", "").split("-");
            end_time[3] = end_time[2].split("T")[1];
            end_time[2] = end_time[2].split("T")[0];
            end_time[5] = end_time[3].split(":")[2];
            end_time[4] = end_time[3].split(":")[1];
            end_time[3] = end_time[3].split(":")[0];
        }
        if (start_lat != null && start_lon != null && end_lat != null && end_lon != null && Object.values(response[i])[5] != null && Object.values(response[i])[6] != null) {
            var distance = 12756274 * Math.atan2(Math.sqrt(Math.pow(Math.sin((end_lat - start_lat) * Math.PI / 360), 2) + Math.cos(start_lat * Math.PI / 180) * Math.cos(end_lat * Math.PI / 180) * Math.pow(Math.sin((end_lon - start_lon) * Math.PI / 360), 2)), Math.sqrt(1 - (Math.pow(Math.sin((end_lat - start_lat) * Math.PI / 360), 2) + Math.cos(start_lat * Math.PI / 180) * Math.cos(end_lat * Math.PI / 180) * Math.pow(Math.sin((end_lon - start_lon) * Math.PI / 360), 2))));
            var days = 0;
            for (var year = start_time[0], month = start_time[1]; year < end_time[0] || month < end_time[1]; month++) {
                if (month > 12) {
                    year++;
                    month = 1;
                }
                if (month == 2 && ((year % 4 == 0 && year % 100 != 0) || year % 400)) { // Leap Years
                    days += 29
                } else {
                    days += months[month * 1];
                }
            }
            days += end_time[2] - start_time[2];
            var time = days * 86400;
            time += (end_time[3] - start_time[3]) * 3600 + (end_time[4] - start_time[4]) * 60;
            if (distance / time < 35.145) {
                total_distance += distance;
                total_time += time;
                if (userIDs.includes(Object.values(response[i])[0])) {
                    distances[userIDs.indexOf(Object.values(response[i])[0])] += distance;
                    times[userIDs.indexOf(Object.values(response[i])[0])] += time;
                    lengths[userIDs.indexOf(Object.values(response[i])[0])]++;
                } else {
                    userIDs[userIDs.length] = Object.values(response[i])[0];
                    if (distances[userIDs.length - 1] == null) {
                        distances[userIDs.length - 1] = distance;
                        times[userIDs.length - 1] = time;
                    } else {
                        distances[userIDs.length] = distance;
                        times[userIDs.length] = time;
                    }
                }
                length++;
            }
        }
        console.log(i)
    }
    if (length > 0) {
        average_distance = total_distance / length;
        average_time = total_distance / length;
        average_speed = total_distance / total_time;
    }
    for (var i = 0; i < userIDs.length; i++) {
        speeds[i] = distances[i] / times[i];
        arrays[i] = [userIDs[i], speeds[i]];
    }
    if (average_distance == 1) {
        document.getElementById("average_distance").innerHTML = "Average Distance: 1 meter";
    } else {
        document.getElementById("average_distance").innerHTML = "Average Distance: " + average_distance.toFixed(3) + " meters";
    }
    if (average_time == 1) {
        document.getElementById("average_time").innerHTML = "Average Time: 1 second";
    } else {
        document.getElementById("average_time").innerHTML = "Average Time: " + average_time.toFixed(3) + " seconds";
    }
    document.getElementById("average_speed").innerHTML = "Average Speed: " + average_speed.toFixed(3) + " mps";
    arrays.sort((a, b) => a[1] - b[1]);
    for (var i = 0; i < userIDs.length; i++) {
        userIDs[i] = arrays[i][0];
        speeds[i] = arrays[i][1].toFixed(3);
    }
    new Chart(document.getElementById('speeds_chart'), {
        type: 'bar',
        data: {
            labels: userIDs,
            datasets: [{
                data: speeds
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'User IDs',
                        fontSize: 15
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Average Speeds (mps)',
                        fontSize: 15
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return tooltipItem.yLabel + " mps";
                    }
                }
            }
        }
    });
});
