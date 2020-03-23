var apiUrl = "https://localhost:44345/api/";

var Section = {
    Id: 0,
    Name: "",
    Rooms: [{ Room }],
}

function Room(id = 0, name = "", section = 0, ports = null, section1 = null) {
    this.Id = id;
    this.Name = name;
    this.Section = section;
    this.Ports = ports;
    this.Section1 = section1;
};

function Port(id = 0, SerialCode = "", IsActive = false, IsConnected = false, AssociatedRoom = 0, room = null) {
    this.Id = id;
    this.SerialCode = SerialCode;
    this.IsActive = IsActive;
    this.IsConnected = IsConnected;
    this.AssociatedRoom = AssociatedRoom;
    this.room = room;
};


function handleException(request, message, error) {
    $("#errorModal .modal-body").empty().append(`<p>` + message + error + `</p>`);
    $("#errorModal .modal-footer").empty().append(`<button type="button" class="btn btn-primary"  onclick="location.reload();">Reload</button>`);
    $('#errorModal').modal('show');
}

$(document).ready(function() {
    getSectionList();
});

function openSettings() {
    PrepareSettings();
    $('#settingsModal').modal('show');
}

function getSectionList() {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Sections/',
        type: 'GET',
        dataType: 'json',
        success: function(sections) {
            console.log(sections);
            UpdateDisplaySections(sections);
        },
        error: function(request, message, error) {
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
        success: function(room) {

            PrepareRoomPageCreatePort(room);
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
    return returnRoom;
}

function PrepareRoomPageCreatePort(room) {
    $("#port-title").text(room.Name);
    console.log(room);
    var output = "";
    $("#ports").empty();
    if (room.Ports.length != 0) {
        room.Ports.forEach(port => {

            if (port.IsActive) {
                var status = "connected";
                var statusText = `<i class="fas fa-check"></i> Forbundet til krydsfelt`;
                var IsActiveChecked = "checked";
            } else {
                var status = "disconnected";
                var statusText = `<i class="fas fa-times"></i> Ikke forbundet til krydsfelt`;
                var IsActiveChecked = "";
            }

            if (port.IsConnected) {
                var devicestatus = "device-connected";
                var IsConnectedChecked = "checked";
            } else {
                var devicestatus = "device-disconnected";
                var IsConnectedChecked = "";
            }

            $("#ports").append(`
            <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ccard port ` + status + ` ` + devicestatus + `" data-port-id="` + port.Id + `">
                <i class="side fad fa-ethernet"></i>
                <h5>Port</h5>
                <h4>` + port.SerialCode + `</h4>
                <div class="status">
                    <p class="status-text">` + statusText + `</p>
                    <div class="portbuttons">
                    <div class="row">
                    <div class="col">
                    <div class="row">
                    <div class="col-4">
                    <input type="checkbox" class="PortIsActiveSwitch" data-port-id="` + port.Id + `" ` + IsActiveChecked + ` id="PortIsActiveSwitch` + port.Id + `" data-toggle="toggle" data-size="xs">
                    </div>
                    <div class="col">
                    <p>Krydsfelt</p>
                    </div>
                    </div>
                    </div>
                    <div class="col">
                    <div class="row">
                    <div class="col-4">
                    <input type="checkbox" class="PortIsConnectedSwitch" data-port-id="` + port.Id + `" ` + IsConnectedChecked + ` id="PortIsConnectedSwitch` + port.Id + `" data-toggle="toggle" data-size="xs">
                    </div>
                    <div class="col">
                    <p>Enhed</p>
                    </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>`);
            $('#PortIsConnectedSwitch' + port.Id).bootstrapToggle();
            $('#PortIsActiveSwitch' + port.Id).bootstrapToggle();
        });


    } else {
        $("#ports").append(`
        <div class="col-md-12">
            <h4 class="text-center empty">Der er ingen porte i lokalet!</h4>
    </div>`)
    }



    $(".port-container").addClass("open");
};



$('#mainSection').on('click', '.room', function() {
    UpdatePortRoomgetRoom($(this).data("room-id"));
});





$('.port-container').on('click', '.port', function(e) {

    if ($(this).hasClass("open")) {
        if (e.target.closest(".portbuttons") === null) {
            $(this).removeClass("open");
        }
    } else {
        $(".port.open").removeClass("open");
        $(this).addClass("open");
    }

});

$(document).on('click', '.port-container', function(e) {
    if (e.target.closest(".port") === null) {
        $(".port.open").removeClass("open");
    }
});


$("#port-close").click(function() {
    $(".port-container").removeClass("open");
});



$(".port-container").on('change', '.PortIsActiveSwitch', function(e) {
    var container = $(this);
    $.ajax({
        url: apiUrl + 'Ports/' + $(container).data("port-id"),
        type: 'GET',
        dataType: 'json',
        success: function(port) {
            port.IsActive = $(container).is(":checked");
            $.ajax({
                url: apiUrl + 'Ports/' + port.Id,
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(port),
                success: function(portny) {


                    if ($(container).is(":checked")) {
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "']").addClass("connected").removeClass("disconnected");
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "'] .status-text").html(`<i class="fas fa-check"></i> Forbundet`);
                    } else {
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "']").addClass("disconnected").removeClass("connected");
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "'] .status-text").html(`<i class="fas fa-times"></i> Ikke forbundet`);

                    }
                },
                error: function(request, message, error) {
                    handleException(request, message, error);
                }
            });
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
});

$(".port-container").on('change', '.PortIsConnectedSwitch', function(e) {
    var container = $(this);
    $.ajax({
        url: apiUrl + 'Ports/' + $(container).data("port-id"),
        type: 'GET',
        dataType: 'json',
        success: function(port) {
            port.IsConnected = $(container).is(":checked");
            $.ajax({
                url: apiUrl + 'Ports/' + port.Id,
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(port),
                success: function(portny) {


                    if ($(container).is(":checked")) {
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "']").addClass("device-connected").removeClass("device-disconnected");
                    } else {
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "']").addClass("device-disconnected").removeClass("device-connected");
                    }
                },
                error: function(request, message, error) {
                    handleException(request, message, error);
                }
            });
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });



});


function PrepareSettings(roomId) {
    // Call Web API to get a list of Employees  
    var returnRoom;
    $.ajax({
        url: apiUrl + 'Sections/',
        type: 'GET',
        dataType: 'json',
        success: function(sections) {

            RenderSettings(sections);
        },
        error: function(request, message, error) {
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
    cleanSettingsDetail();

}

function cleanSettingsDetail() {
    $("#SettingsDetail").empty().append(`
                            <h2 class="title"></h2>
                            <div class="form">
                            </div>
                            <div class="buttons">
                            </div>

    `);
}



$('#SettingsMaster').on('click', '.list-group-item', function() {
    $("#SettingsMaster .active").removeClass("active");
    $(this).addClass("active");
});

$('#SettingsMaster').on('click', '.settingsRoom', function() {
    editRoomSetup($(this).data("room-id"));
});

function editRoomSetup(roomId) {
    $("#SettingsDetail .title").text("");
    $("#SettingsDetail .form").empty();
    $.ajax({
        url: apiUrl + 'Rooms/' + roomId,
        type: 'GET',
        dataType: 'json',
        success: function(rooms) {
            $("#SettingsDetail .title").text("Rediger " + rooms.Name);
            $("#SettingsDetail .buttons").empty().append(`<button type="button" id="saveRoom" data-id="` + rooms.Id + `" class="btn btn-primary">Opdater</button><button type="button" id="deleteRoom" data-id="` + rooms.Id + `" class="btn btn-danger">Slet</button>`)

            MakeRoomForm(rooms);
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
}

$('#SettingsMaster').on('click', '.settingsPort', function() {
    editPortSetup($(this).data("port-id"));
});

function editPortSetup(portId) {
    $("#SettingsDetail .title").text("");
    $("#SettingsDetail .form").empty();
    $.ajax({
        url: apiUrl + 'Ports/' + portId,
        type: 'GET',
        dataType: 'json',
        success: function(port) {
            $("#SettingsDetail .title").text("Rediger " + port.SerialCode);
            $("#SettingsDetail .buttons").empty().append(`<button type="button" id="savePort" data-id="` + port.Id + `" class="btn btn-primary">Opdater</button><button type="button" id="deletePort" data-id="` + port.Id + `" class="btn btn-danger">Slet</button>`)

            MakePortForm(port);
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
}

function MakeRoomForm(room = new Room(0, "")) {

    $.ajax({
        url: apiUrl + 'Sections/',
        type: 'GET',
        dataType: 'json',
        success: function(section) {

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
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });

}

function MakePortForm(port = new Port()) {

    $.ajax({
        url: apiUrl + 'Sections/',
        type: 'GET',
        dataType: 'json',
        success: function(section) {

            var sections = section;
            console.log(sections);
            var roomList = ""
            sections.forEach(section => {
                roomList += `<optgroup label="` + section.Name + `">`
                section.Rooms.forEach(room => {
                    var selected = "";
                    if (room.Id == port.AssociatedRoom) {
                        selected = "selected";
                    };
                    roomList += `<option value="` + room.Id + `" ` + selected + `>` + room.Name + `</option>`;
                });
                roomList += `</optgroup ">`;
            });

            var PortIsActiveChecked = "";
            if (port.IsActive) {
                PortIsActiveChecked = "checked";
            }

            var PortIsConnectedChecked = "";
            if (port.IsConnected) {
                PortIsConnectedChecked = "checked";
            }


            $("#SettingsDetail .form").empty().append(`
    <div class="form-group">
    <label for="name">Serienummer</label>
    <input type="text" class="form-control" name="portSerialCode" value="` + port.SerialCode + `" id="portSerialCode">
    </div>
  <div class="form-check">
    <input type="checkbox" class="form-check-input"  id="PortIsActive" ` + PortIsActiveChecked + `>
    <label class="form-check-label"  for="PortIsActive" >Forbundet til krydsfeltet</label>
  </div>
  <br>
  <div class="form-check">
    <input type="checkbox" class="form-check-input" id="PortIsConnected" ` + PortIsConnectedChecked + `>
    <label class="form-check-label" for="PortIsConnected" >Forbundet til enhed</label>
  </div>
  <div class="form-group">
    <label for="section">Lokale</label>
    <select class="form-control" id="PortAssociatedRoom" name="PortAssociatedRoom">
            ` + roomList + `
    </select>
  </div>
    `);
            $('#PortIsConnected').bootstrapToggle({
                size: 'sm',
            });
            $('#PortIsActive').bootstrapToggle({
                size: 'sm',
            });
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });

}


$('#SettingsDetail').on('click', '#saveRoom', function() {
    $(this).prop("disabled", true);
    $.ajax({
        url: apiUrl + 'Rooms/' + $(this).data("id"),
        type: 'GET',
        dataType: 'json',
        success: function(room) {
            updatedRoom = new Room;
            updatedRoom.Id = room.Id;
            updatedRoom.Name = $("#roomName").val();
            updatedRoom.Section = $("#section").children("option:selected").val();

            UpdateRoom(updatedRoom);
            //console.log(updatedRoom);
            getSectionList();
            PrepareSettings();
            SettingsMasterSelectRoom(room);

        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
    $(this).prop("disabled", false);
});

$('#SettingsDetail').on('click', '#deleteRoom', function() {
    $(this).prop("disabled", true);
    if (confirm("Vil du virkelig slette dette rum?")) {
        $.ajax({
            url: apiUrl + 'Rooms/' + $(this).data("id"),
            type: 'Delete',
            dataType: 'json',
            success: function(room) {
                getSectionList();
                PrepareSettings();
            },
            error: function(request, message, error) {
                handleException(request, message, error);
            }

        });
    }
    $(this).prop("disabled", false);
});

$('#SettingsDetail').on('click', '#savePort', function() {
    $(this).prop("disabled", true);
    $.ajax({
        url: apiUrl + 'Ports/' + $(this).data("id"),
        type: 'GET',
        dataType: 'json',
        success: function(port) {
            updatedPort = new Port;
            updatedPort.Id = port.Id;
            updatedPort.SerialCode = $("#portSerialCode").val();
            updatedPort.IsActive = $('#PortIsActive').is(":checked");
            updatedPort.IsConnected = $('#PortIsConnected').is(":checked");
            updatedPort.AssociatedRoom = $("#PortAssociatedRoom optgroup").children("option:selected").val();

            UpdatePort(updatedPort);
            //console.log(updatedPort);
            getSectionList();
            PrepareSettings();


        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
    $(this).prop("disabled", false);
});

$('#SettingsDetail').on('click', '#deletePort', function() {
    $(this).prop("disabled", true);
    if (confirm("Vil du virkelig slette denne port?")) {
        $.ajax({
            url: apiUrl + 'Ports/' + $(this).data("id"),
            type: 'Delete',
            dataType: 'json',
            success: function(room) {
                getSectionList();
                PrepareSettings();
            },
            error: function(request, message, error) {
                handleException(request, message, error);
            }

        });
    }
    $(this).prop("disabled", false);
});

$('#CreateRoomPage').click(function() {
    cleanSettingsDetail();
    MakeRoomForm();
    $("#SettingsDetail .title").text("Opret lokale");
    $("#SettingsDetail .buttons").append(`<button type="button" id="createRoom" class="btn btn-primary">Opret</button>`);
});

$('#CreatePortPage').click(function() {
    cleanSettingsDetail();
    MakePortForm();
    $("#SettingsDetail .title").text("Opret port");
    $("#SettingsDetail .buttons").append(`<button type="button" id="createPort" class="btn btn-primary">Opret</button>`);
});

$('#SettingsDetail').on('click', '#createPort', function() {
    var port = new Port;
    port.Id = port.Id;
    port.SerialCode = $("#portSerialCode").val();
    port.IsActive = $('#PortIsActive').is(":checked");
    port.IsConnected = $('#PortIsConnected').is(":checked");
    port.AssociatedRoom = $("#PortAssociatedRoom optgroup").children("option:selected").val();
    CreatePort(port);
    PrepareSettings();
});

$('#SettingsDetail').on('click', '#createRoom', function() {
    room = new Room();
    room.Name = $("#roomName").val();
    room.Section = $("#section").children("option:selected").val();
    CreateRoom(room);
    getSectionList();
    PrepareSettings();
});

function CreateRoom(room) {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Rooms',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        data: JSON.stringify(room),
        success: function(sections) {

            $.jGrowl(room.Name + " blev oprettet");
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
}

function CreatePort(port) {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Ports',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        data: JSON.stringify(port),
        success: function(sections) {

            $.jGrowl(port.SerialCode + " blev oprettet");
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
}

function UpdateRoom(room) {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Rooms/' + room.Id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(room),
        success: function(sections) {

            $.jGrowl(room.Name + " blev opdateret");
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
}

function UpdatePort(port) {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Ports/' + port.Id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(port),
        success: function(sections) {

            $.jGrowl(port.SerialCode + " blev opdateret");
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
}