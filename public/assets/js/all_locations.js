$(document).ready(function () {
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "https://polimi-hyp-2018-team-10525745.herokuapp.com/locations?sort=asc&fields=id,title,address,img",
        success: function (response) {
            const holder = $('#location-row');
            holder.empty();

            $.each(response, function (i, location) {
                const html = `<div class="col-12 col-md-6 col-lg-4 col-xl-4">
                    <a href="location.html?id=${location["id"]}">
                        <div class="card location-card">
                            <img class="card-img-top img-center-crop" src="../assets/img/${location["img"]}">
                            <div class="card-body">
                                <h5 class="card-title text-title text-primary-dark">${location["title"]}</h5>
                                <p class="card-text text-secondary-dark">${location["address"]}</p>
                            </div>
                        </div>
                    </a>
                </div>`;

                holder.append(html);
            });
        },
        error: function (request, error) {
            console.log(request, error);
        }
    });
});

const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function initMap() {
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "https://polimi-hyp-2018-team-10525745.herokuapp.com/locations?sort=asc&fields=id,title,lat,lng",
        success: function (response) {
            const coords = response.map(function (value) {
                return {lat: value["lat"], lng: value["lng"]}
            });

            let map = new google.maps.Map(document.getElementById('map'), {
                zoom: 11,
                center: {
                    lat: (coords.reduce((max, val) => Math.max(max, val["lat"]), 0) + coords.reduce((min, val) => Math.min(min, val["lat"]), Number.MAX_VALUE)) / 2,
                    lng: (coords.reduce((max, val) => Math.max(max, val["lng"]), 0) + coords.reduce((min, val) => Math.min(min, val["lng"]), Number.MAX_VALUE)) / 2,
                }
            });

            let infoWindow = new google.maps.InfoWindow();

            let markers = coords.map(function (coordinate, i) {
                return new google.maps.Marker({
                    position: coordinate,
                    label: labels[i % labels.length]
                });
            });

            markers.map(function (marker, i) {
                marker.addListener('click', function () {
                    infoWindow.setContent(`<div class="p-1">
                        <h6>${response[i]["title"]}</h6>
                        <a class="text-accent" href="location.html?id=${response[i]["id"]}">Vai alla sede</a>
                    </div>`);
                    infoWindow.open(map, marker);
                });
            });

            // Add a marker cluster to manage the markers.
            let markerCluster = new MarkerClusterer(map, markers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
        },
        error: function (request, error) {
            console.log(request, error);
        }
    });
}