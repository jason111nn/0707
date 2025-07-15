$(document).ready(function () {
    $.get("./api/get.php?mode=route", function (routes) {
        let html = routes.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        $("#route-select").html(html);
        if (routes.length > 0) updateMap();
    }, 'json');
    $("#route-select").on("change", updateMap);

    setInterval(() => {
        $.post("./api/update_runtime.php");
        updateMap();
    }, 60000);
});''

function updateMap() {
    let routeId = $("#route-select").val();
    if (!routeId) return;

    $.get(`./api/get.php?mode=routestation&item=routeid&id=${routeId}`, function (routeStations) {
        if (!routeStations || routeStations.length === 0) {
            $("#route-map").html("<text x='50%' y='50%' text-anchor='middle' fill='gray'>無站點資料</text>");
            return;
        }

        routeStations.sort((a, b) => parseInt(a.seq) - parseInt(b.seq));

        let stationIds = routeStations.map(rs => rs.stationId);
        let stationNames = {};

        Promise.all(stationIds.map(id =>
            $.get(`./api/get.php?mode=station&id=${id}`,function(data){
                if (Array.isArray(data) && data.length > 0 && data[0].name) {
                    stationNames[id] = data[0].name;
                } else {
                    stationNames[id] = "未知站名";
                    console.warn("站點資料異常", id, data);
                }
            },'json')
        )).then(() => {
            $.get("./api/get.php?mode=bus", function (allBuses) {
                let buses = allBuses.filter(bus => bus.routeid == routeId);
                drawRouteMap(routeStations, stationNames, buses);
            }, 'json');
        });
    }, 'json');
}

function drawRouteMap(routeStations, stationNames, buses) {
    let svg = '';
    let perRow = 3;
    let spacingX = 200;
    let spacingY = 120;

    let positions = [];
    for (let i = 0; i < routeStations.length; i++) {
        let row = Math.floor(i / perRow);
        let col = i % perRow;

        let reversed = row % 2 === 1;
        let x = 180 + (reversed ? (perRow - 1 - col) : col) * spacingX;
        let y = 100 + row * spacingY;

        positions.push({ x, y, row, col, reversed });
    }

    for (let i = 1; i < positions.length; i++) {
        let prev = positions[i - 1];
        let curr = positions[i];


        if (prev.row !== curr.row) {
            let direction = prev.row % 2 === 0 ? 1 : -1;
            let midX = prev.x + direction * 100;

            svg += `<path d="M${prev.x},${prev.y} L${midX},${prev.y} L${midX},${curr.y} L${curr.x},${curr.y}" 
                         stroke="#22d3ee" stroke-width="2" fill="none"/>`;
        } else {
            svg += `<path d="M${prev.x},${prev.y} L${curr.x},${curr.y}" 
                         stroke="#22d3ee" stroke-width="2" fill="none"/>`;
        }
    }

    for (let i = 0; i < routeStations.length; i++) {
        let pos = positions[i];
        let stationId = routeStations[i].stationId;
        let stationName = stationNames[stationId];

        let stationInfo = calculateStationInfo(routeStations, buses, i);

        svg += `
            <text x="${pos.x}" y="${pos.y - 35}" text-anchor="middle" fill="black" font-size="12">${stationInfo.busName}</text>
            <text x="${pos.x}" y="${pos.y - 20}" text-anchor="middle" fill="black" font-size="12">${stationInfo.status}</text>
            <circle cx="${pos.x}" cy="${pos.y}" r="8" fill="#22d3ee"/>
            <text x="${pos.x}" y="${pos.y + 35}" text-anchor="middle" fill="gray" font-size="14">${stationName}</text>
        `;
    }

    $("#route-map").html(svg);

}

function calculateStationInfo(routeStations, buses, stationIndex) {
    if (buses.length === 0) {
        return { busName: "無車輛", status: "無車輛服務" };
    }

    let totalTime = routeStations.reduce((sum, rs) => sum + parseInt(rs.arriving) + parseInt(rs.staying), 0);
    let bestBus = null;
    let bestTime = Infinity;

    buses.forEach(bus => {
        let runtime = parseInt(bus.runtime) % totalTime;
        let timeToStation = calculateTimeToStation(runtime, stationIndex, routeStations, totalTime);

        if (timeToStation < bestTime) {
            bestTime = timeToStation;
            bestBus = bus;
        }
    });
    let busName = bestBus ? bestBus.name : "無車輛";
    let status = "";

    if (bestTime <= 0) {
        status = "已進站";
    } else {
        status = `約${Math.ceil(bestTime)}分鐘進站`;
    }

    return { busName, status };
}

function calculateTimeToStation(runtime, targetIndex, routeStations, totalTime) {
    let currentIndex = 0;
    let currentTime = 0;
    for (let i = 0; i < routeStations.length; i++) {
        let segmentTime = parseInt(routeStations[i].arriving) + parseInt(routeStations[i].staying);
        if (runtime <= currentTime + segmentTime) {
            currentIndex = i;
            break;
        }
        currentTime += segmentTime;
    }

    if (currentIndex === targetIndex) {
        let station = routeStations[currentIndex];
        let remainingTime = parseInt(station.arriving) + parseInt(station.staying) - (runtime - currentTime);
        return Math.max(0, remainingTime);
    }

    let time = 0;
    let i = currentIndex;

    do {
        let station = routeStations[i];
        if (i === currentIndex) {
            time += parseInt(station.arriving) + parseInt(station.staying) - (runtime - currentTime);
        } else {
            time += parseInt(station.arriving) + parseInt(station.staying);
        }
        i = (i + 1) % routeStations.length;
    } while (i !== targetIndex);

    time += parseInt(routeStations[targetIndex].arriving);
    
    return time;
} 