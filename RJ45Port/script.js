var apiUrl = "https://localhost:44345/api/";

var Section = {
    Id: 0,
    Name: "",
    Rooms: [{ Room }],
}
var Room = {
    Id: 0,
    Name: "",
    Section: 0,
    Ports: [{ Port }],
    Section1: Section
}
var Port = {
    Id: 0,
    SerialCode: "",
    IsActive: false,
    IsConnected: false,
    AssociatedRoom: 0,
    Room: Room
}

function handleException(request, message, error) {
    $("#errorModal .modal-body").empty().append(`<p>` + message + error + `</p>`);
    $("#errorModal .modal-footer").empty().append(`<button type="button" class="btn btn-primary"  onclick="location.reload();">Reload</button>`);
    $('#errorModal').modal('show');
}

$(document).ready(function () {
    getSectionList();
    PrepareSettings();
});

function getSectionList() {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Sections/',
        type: 'GET',
        dataType: 'json',
        success: function (sections) {
            console.log(sections);
            UpdateDisplaySections(sections);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}



function UpdateDisplaySections(sections) {

    $("#mainSection").empty();
    sections.forEach(section => {
        var row = `<div class='row section ' data-section-id="` + section.Id + `"> 
        <div class='col-md-12'>
            <h2>` + section.Name + `</h2>
        </div>`;
        if (section.Rooms.length != 0) {
            section.Rooms.forEach(room => {
                row += `<div class="col-lg-3 col-md-4 col-sm-6">
        <div class="ccard room" data-room-id="` + room.Id + `">
            <i class="side fad fa-compass"></i>
            <h5>Lokale</h5>
            <h4>` + room.Name + `</h4>
        </div>
    </div>`
            });
        } else {
            row += `
        <div class="col-md-12">
            <h4 class="text-center empty">Der er ingen lokaler i afdelingen!</h4>
    </div>`
        }

        $("#mainSection").append(row);
    });
    $(".loader").addClass("close");
}


function UpdatePortRoomgetRoom(roomId) {
    // Call Web API to get a list of Employees  
    var returnRoom;
    $.ajax({
        url: apiUrl + 'Rooms/' + roomId,
        type: 'GET',
        dataType: 'json',
        success: function (room) {

            PrepareRoomPageCreatePort(room);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
    return returnRoom;
}

function PrepareRoomPageCreatePort(room) {
    $("#port-title").text(room.Name);
    console.log(room);
    var output = "";
    if (room.Ports.length != 0) {
        room.Ports.forEach(port => {

            if (port.IsActive) {
                var status = "connected";
                var statusText = `<i class="fas fa-check"></i> Forbundet`;
            } else {
                var status = "disconnected";
                var statusText = `<i class="fas fa-times"></i> Ikke forbundet`;
            }

            output += `
            <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ccard port ` + status + `" data-port-id="` + port.Id + `">
                <i class="side fad fa-ethernet"></i>
                <h5>Port</h5>
                <h4>` + port.SerialCode + `</h4>
                <div class="status">
                    <p>` + statusText + `</p>
    
                </div>
            </div>
        </div>`
        });
    } else {
        output += `
        <div class="col-md-12">
            <h4 class="text-center empty">Der er ingen porte i lokalet!</h4>
    </div>`
    }

    $("#ports").empty().append(output);
    $(".port-container").addClass("open");
};



$('#mainSection').on('click', '.room', function () {
    UpdatePortRoomgetRoom($(this).data("room-id"));
});

$("#port-close").click(function () {
    $(".port-container").removeClass("open");
});


function PrepareSettings(roomId) {
    // Call Web API to get a list of Employees  
    var returnRoom;
    $.ajax({
        url: apiUrl + 'Sections/',
        type: 'GET',
        dataType: 'json',
        success: function (sections) {

            RenderSettings(sections);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function RenderSettings(sections) {
    var output = "";
    sections.forEach(section => {
        var roomOutput = "";
        section.Rooms.forEach(room => {
            var portOutput = "";
            room.Ports.forEach(port => {
                portOutput += `<a href="#port-` + port.Id + `" data-port-id="` + port.Id + `" class="list-group-item settingsPort"><i class="fas fa-ethernet"></i> ` + port.SerialCode + `</a>`;
            });

            roomOutput += `<a href="#room-` + room.Id + `" data-room-id="` + room.Id + `" class="list-group-item settingsRoom" data-toggle="collapse">
            <i class="glyphicon glyphicon-chevron-right"></i><i class="fas fa-compass"></i> ` + room.Name + `
        </a>
        <div class="list-group collapse " id="room-` + room.Id + `">
            ` + portOutput + `
        </div>`;
        });



        output += `<a href="#section-` + section.Id + `" data-section-id="` + section.Id + `" class="list-group-item settingsSection" data-toggle="collapse">
        <i class="glyphicon glyphicon-chevron-right"></i><i class="fas fa-building"></i> ` + section.Name + `
    </a>
    <div class="list-group collapse " id="section-` + section.Id + `">
    ` + roomOutput + `
    </div>`

    });



    $("#SettingsMaster").empty().append(output);
    $('#settingsModal').modal('show');
}

$('#SettingsMaster').on('click', '.settingsRoom', function () {
    $("#SettingsDetail .title").text("");
    $("#SettingsDetail .form").empty();
    $.ajax({
        url: apiUrl + 'Rooms/' + $(this).data("room-id"),
        type: 'GET',
        dataType: 'json',
        success: function (rooms) {
            $("#SettingsDetail .title").text("Rediger " + rooms.Name);
            $("#SettingsDetail .buttons").empty().append(`<button type="button" id="save" data-id="` + rooms.Id + `" class="btn btn-primary">Opdater</button>`)

            MakeRoomForm(rooms);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
});

$('#SettingsMaster').on('click', '.list-group-item', function () {
    $("#SettingsMaster .active").removeClass("active");
    $(this).addClass("active");
});


function MakeRoomForm(room = Room) {

    $.ajax({
        url: apiUrl + 'Sections/',
        type: 'GET',
        dataType: 'json',
        success: function (section) {

            var sections = section;
            console.log(sections);
            var sectionList = ""
            sections.forEach(section => {
                var selected = "";
                if (section.Id == room.Section) {
                    selected = "selected";
                };
                sectionList += `<option value="` + section.Id + `" ` + selected + `>` + section.Name + `</option>`;
            });



            $("#SettingsDetail .form").append(`
    <div class="form-group">
    <label for="name">Navn</label>
    <input type="text" class="form-control" name="name" value="` + room.Name + `" id="roomName">
    </div>
  <div class="form-group">
    <label for="section">Afdeling</label>
    <select class="form-control" id="section" name="section">
            ` + sectionList + `
    </select>
  </div>
    `);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });

}


$('#SettingsDetail').on('click', '#save', function () {
    $(this).prop("disabled", true);
    $.ajax({
        url: apiUrl + 'Rooms/' + $(this).data("id"),
        type: 'GET',
        dataType: 'json',
        success: function (room) {

            alert("Room" + room.Name);
            room.Name = $("#roomName").val();
            room.Section = $("#section").children("option:selected").val();
            UpdateRoom(room);


        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
    $(this).prop("disabled", false);
});

function UpdateRoom(room) {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Rooms/' + room.Id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(room),
        success: function (sections) {

            alert(room.Name + " blev opdateret");
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}