$(document).ready(function () {
    $.ajax({
        method: "GET",
        dataType: "json",
        url: "https://polimi-hyp-2018-team-10525745.herokuapp.com/profiles?sort=asc&fields=id,img,job,first_name,last_name,twitter",
        success: function (response) {
            loadData(response);
        },
        error: function (request, error) {
            console.log(request, error);
        }
    });
});


function loadData(json) {
    const holder = $('#profile-row');
    holder.empty();

    $.each(json, function (i, profile) {
        const string = `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <a href="profile.html?id=${profile["id"]}">
                <div class="card profile-card">
                    <img class="card-img-top img-center-crop" src="../assets/img/${profile["img"]}" alt="Card image cap">
                    <div class="card-body">
                        <p class="text-caption text-secondary-dark">${profile["job"]}</p>
                        <h5 class="text-title text-primary-dark pt-2">${profile["first_name"]} ${profile["last_name"]}</h5>
                        <p class="text-body text-secondary-dark pt-1">${profile["twitter"]}</p>
                    </div>
                </div>
            </a>
        </div>`;
        holder.append(string);
    })
}