//var apiUrl = "https://localhost:44345/api/";
var apiUrl = "/api/";

function Section(id = 0, name = "", icon = null, cover = null, logo = null) {
    this.Id = id;
    this.Name = name;
    this.Icon = icon;
    this.Cover = cover;
    this.Logo = logo;
};

function Room(id = 0, name = "", AssociatedSection = 0, icon = null, cover = null, logo = null, ports = null, section = null) {
    this.Id = id;
    this.Name = name;
    this.AssociatedSection = AssociatedSection;
    this.Ports = ports;
    this.section = section;
    this.Icon = icon;
    this.Cover = cover;
    this.Logo = logo;
};

function Port(id = 0, SerialCode = "", IsActive = false, IsConnected = false, AssociatedRoom = 0, description = null, room = null) {
    this.Id = id;
    this.SerialCode = SerialCode;
    this.IsActive = IsActive;
    this.IsConnected = IsConnected;
    this.AssociatedRoom = AssociatedRoom;
    this.room = room;
    this.Description = description;
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
        var logoThing = "";
        if (section.Logo) {
            logoThing = `<div class="logo"><img class="img-fluid" src="` + section.Logo + `"></img></div>`;
        } else if (section.Icon) {
            logoThing = `<div class="icon"><i class="fad fa-` + section.Icon + `"></i></div>`;
        }

        var roomCoverHasImage = "";
        var roomCoverStyle = "";
        if (section.Cover) {
            var roomCoverHasImage = "hasImg";
            var roomCoverStyle = `style="background-image: url(` + section.Cover + `)"`;
        }

        var row = `<div class=' section ' data-section-id="` + section.Id + `"> 
        <div class="row">
        <div class="roomcover ` + roomCoverHasImage + `" ` + roomCoverStyle + ` >
        
        <div class="info">
        <div class="container">
        ` + logoThing + `
        <div class="name">
            <h2>` + section.Name + `</h2>
            </div>
        </div>
        </div>
        </div>
        </div>
        <div class="container drag-up">
        <div class="row">
`;
        if (section.Rooms.length != 0) {
            section.Rooms.forEach(room => {
                var logoIcon = "";
                if (room.Logo) {
                    logoIcon = `<div class="sidelogo" style="background-image: url(` + room.Logo + `)"></div>`;
                } else if (room.Icon) {
                    logoIcon = ` <i class="side fad fa-` + room.Icon + `"></i>`;
                }

                row += `<div class="col-lg-3 col-md-4 col-sm-6">
        <div class="ccard room" data-room-id="` + room.Id + `">
        ` + logoIcon + `
           
            <h5>Lokale</h5>
            <h4>` + room.Name + `</h4>
        </div>
        </div>
    `
            });
        } else {
            row += `
        <div class="col-md-12">
            <h4 class="text-center empty">Der er ingen lokaler i ` + section.Name + `!</h4>
    </div>`
        }
        row += ` </div> `;

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
var statusTextIsActiveEnabled = `<i class="fas fa-check"></i> Forbundet til krydsfelt`;
var statusTextIsActiveDisabled = `<i class="fas fa-times"></i> Ikke forbundet til krydsfelt`;

function PrepareRoomPageCreatePort(room) {
    if (room.Cover) {
        $(".port-container .title-row").addClass("hasCover").css(`background-image`, `url(` + room.Cover + `)`);
    } else {
        $(".port-container .title-row").removeClass("hasCover").css(`background-image`, ``);
    }

    $("#port-title").text(room.Name);
    console.log(room);
    var output = "";
    $("#ports").empty();
    if (room.Ports.length != 0) {
        room.Ports.forEach(port => {

            if (port.IsActive) {
                var status = "connected";
                var statusText = statusTextIsActiveEnabled;
                var IsActiveChecked = "checked";
            } else {
                var status = "disconnected";
                var statusText = statusTextIsActiveDisabled;
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
                <!--<h6>` + (port.Description || '') + `</h6>-->
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
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "'] .status-text").html(statusTextIsActiveEnabled);
                    } else {
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "']").addClass("disconnected").removeClass("connected");
                        $(".ccard.port[data-port-id='" + $(container).data("port-id") + "'] .status-text").html(statusTextIsActiveDisabled);

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

$('#SettingsMaster').on('click', '.settingsSection', function() {
    editSectionSetup($(this).data("section-id"));
});

function editSectionSetup(sectionId) {
    $("#SettingsDetail .title").text("");
    $("#SettingsDetail .form").empty();
    $.ajax({
        url: apiUrl + 'Sections/' + sectionId,
        type: 'GET',
        dataType: 'json',
        success: function(section) {
            $("#SettingsDetail .title").text("Rediger " + section.Name);
            $("#SettingsDetail .buttons").empty().append(`<button type="button" id="saveSection" data-id="` + section.Id + `" class="btn btn-primary">Opdater</button>`)

            MakeSectionForm(section);
        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
}

function MakeSectionForm(section = new Section(0, "")) {

    $("#SettingsDetail .form").append(`
    <div class="form-group">
    <label for="name">Navn</label>
    <input type="text" class="form-control" name="name" value="` + section.Name + `" id="sectionName">
    </div>
  <div class="form-group">
  <label for="sectionIcon">Ikon</label>
  <input type="text" class="form-control" name="Icon" value="` + (section.Icon || '') + `" id="sectionIcon">
  </div>
  <div class="form-group">
  <label for="sectionLogo">Logo</label>
  <input type="text" class="form-control" name="Logo" value="` + (section.Logo || '') + `" id="sectionLogo">
  </div>
  <div class="form-group">
  <label for="sectionCover">Cover</label>
  <input type="text" class="form-control" name="Cover" value="` + (section.Cover || '') + `" id="sectionCover">
  </div>
    `);

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
  <div class="form-group">
  <label for="roomIcon">Ikon</label>
  <input type="text" class="form-control" name="Icon" value="` + (room.Icon || '') + `" id="roomIcon">
  </div>
  <div class="form-group">
  <label for="roomLogo">Logo</label>
  <input type="text" class="form-control" name="Logo" value="` + (room.Logo || '') + `" id="roomLogo">
  </div>
  <div class="form-group">
  <label for="roomCover">Cover</label>
  <input type="text" class="form-control" name="Cover" value="` + (room.Cover || '') + `" id="roomCover">
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
            console.log(port);

            $("#SettingsDetail .form").empty().append(`
    <div class="form-group">
    <label for="name">Serienummer</label>
    <input type="text" class="form-control" name="portSerialCode" value="` + port.SerialCode + `" id="portSerialCode">
    </div>
    <div class="form-group">
    <label for="portDescription">Beskrivelse</label>
    <input type="text" class="form-control" name="description" value="` + (port.Description || '') + `" id="portDescription">
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
            updatedRoom.AssociatedSection = $("#section").children("option:selected").val();
            updatedRoom.Logo = $("#roomLogo").val();
            updatedRoom.Icon = $("#roomIcon").val();
            updatedRoom.Cover = $("#roomCover").val();


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

$('#SettingsDetail').on('click', '#saveSection', function() {
    $(this).prop("disabled", true);
    $.ajax({
        url: apiUrl + 'Sections/' + $(this).data("id"),
        type: 'GET',
        dataType: 'json',
        success: function(section) {
            updatedSection = new Section;
            updatedSection.Id = section.Id;
            updatedSection.Name = $("#sectionName").val();
            updatedSection.Logo = $("#sectionLogo").val();
            updatedSection.Icon = $("#sectionIcon").val();
            updatedSection.Cover = $("#sectionCover").val();


            UpdateSection(updatedSection);
            //console.log(updatedRoom);
            getSectionList();
            PrepareSettings();

        },
        error: function(request, message, error) {
            handleException(request, message, error);
        }
    });
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
            updatedPort.Description = $("#portDescription").val();

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
    port.Description = $("#portDescription").val();
    CreatePort(port);
    PrepareSettings();
});

$('#SettingsDetail').on('click', '#createRoom', function() {
    room = new Room();
    room.Name = $("#roomName").val();
    room.AssociatedSection = $("#section").children("option:selected").val();
    room.Logo = $("#roomLogo").val();
    room.Icon = $("#roomIcon").val();
    room.Cover = $("#roomCover").val();
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

function UpdateSection(section) {
    // Call Web API to get a list of Employees  
    $.ajax({
        url: apiUrl + 'Sections/' + section.Id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(section),
        success: function(sections) {

            $.jGrowl(section.Name + " blev opdateret");
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