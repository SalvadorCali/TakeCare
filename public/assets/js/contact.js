(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        let forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        const validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();


function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 45.46562, lng: 9.2026635}
    });

    let infoWindow = new google.maps.InfoWindow();

    let marker1 = new google.maps.Marker({
        position: {lat: 45.478085, lng: 9.225691},
        map: map
    });
    let marker2 = new google.maps.Marker({
        position: {lat: 45.453155, lng: 9.179636},
        map: map
    });


    marker1.addListener('click', function () {
        infoWindow.setContent(`<div class="p-1">
                                    <h6>Sede operativa</h6>
                                    <p class="text-secondary-dark mb-0">Piazza Leonardo da Vinci 1, Milano</p>
                                </div>`);
        infoWindow.open(map, marker1)
    });
    marker2.addListener('click', function () {
        infoWindow.setContent(`<div class="p-1">
                                    <h6>Sede legale</h6>
                                    <p class="text-secondary-dark mb-0">Piazza XIV Maggio 4, Milano</p>
                                </div>`);
        infoWindow.open(map, marker2)
    });

    let markerCluster = new MarkerClusterer(map, [marker1, marker2], {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
}