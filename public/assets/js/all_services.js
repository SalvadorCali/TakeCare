const query = function () {
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}();

$(document).ready(function () {
    const holder = $('#all-services-row');
    holder.empty();

    if (query["sort"] === "location") {
        $('#dropdown-view button').html("Visualizza per sede");
        loadByLocation(holder);
    } else {
        $('#dropdown-view button').html("Visualizza per nome");
        loadByName(holder);
    }
});

function loadByName(holder) {
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "https://polimi-hyp-2018-team-10525745.herokuapp.com/services?sort=asc&fields=id,img,title,description",
        success: function (response) {
            let html = ``;
            $.each(response, function (i, service) {
                html += `<div class="col-12 col-md-6">
                        <a href="service.html?id=${service["id"]}">
                            <div class="card service-card-big flex-md-row">
                                <img src="../assets/img/${service["img"]}" class="card-img-right">
                                <div class="card-body d-flex flex-column align-items-start">
                                    <h4 class="card-title text-title text-primary-dark mb-2">
                                        ${service["title"]}
                                    </h4>
                                    <p class="text-body text-secondary-dark card-text max-lines mb-0">${service["description"]}</p>
                                </div>
                            </div>
                        </a>
                    </div>`;
            });
            holder.html(html);
        },
        error: function (request, error) {
            console.log(request, error);
        }
    });
}

function loadByLocation(holder) {
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "https://polimi-hyp-2018-team-10525745.herokuapp.com/services?group=location&sort=asc&fields=id,img,title,description",
        success: function (response) {
            let html = ``;
            $.each(response, function (i, item) {
                // Location title
                html += `<div class="col-12 mt-4">
                            <div class="title-decoration-accent mt-md-3">
                                <h4 class="text-primary-dark font-weight-bold pt-3">${item["location"]}</h4>
                            </div>
                        </div>`;

                // Add services
                $.each(item["services"], function (i, service) {
                    html += `<div class="col-12 col-md-6">
                        <a href="service.html?id=${service["id"]}">
                            <div class="card service-card-big flex-md-row no-border-bt">
                                <img src="../assets/img/${service["img"]}" class="card-img-right">
                                <div class="card-body d-flex flex-column align-items-start">
                                    <h4 class="card-title text-title text-primary-dark mb-2">
                                        ${service["title"]}
                                    </h4>
                                    <p class="text-body text-secondary-dark card-text max-lines mb-0">${service["description"]}</p>
                                </div>
                            </div>
                        </a>
                    </div>`;
                });
            });

            holder.html(html);
        },
        error: function (request, error) {
            console.log(request, error);
        }
    });
}