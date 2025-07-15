let managebox = $("#manage-box")
let html = ""
$(document).ready(function () {
    getmanage("route");
})
$(document).on("click", ".manage-btn", function () {
    let mode = $(this).data("mode")
    getmanage(mode)
})
function getmanage(manage) {
    $.get('./api/get.php', { mode: manage }, (data) => {
        switch (manage) {
            case 'route':
                html = `
                    <div id="manage-text">
                        <h3>路線管理</h3>
                        <button data-mode="route" class="add-item btn btn-outline-secondary">新增</button>
                    </div>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>站點名稱</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                data.forEach(element => {
                    html += `
                                <tr>
                                    <td>${element.name}</td>
                                    <td>
                                        <button class="edit-item" data-mode="route" data-id="${element.id}">編輯</button>
                                        <button class="del-item" data-mode="route" data-id="${element.id}">刪除</button>
                                    </td>
                                </tr>
                            `;
                });

                html += `
                            </tbody>
                            </table>
                        `;
                break;

            case 'bus':
                html = `
                            <div id="manage-text">
                                <h3>車輛管理</h3>
                                <button data-mode="bus" class="add-item btn btn-outline-secondary">新增</button>
                            </div>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>路線</th>
                                        <th>車牌</th>
                                        <th>已行駛時間</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;
                data.forEach(async element => {
                    let data = await fetch("./get.php", { mode: "route", id: element.id })
                    let reponse = await data.json()
                    html += `
                        <tr>
                        <td>${reponse[0].name}</td>
                        <td>${element.name}</td>
                        <td>${element.runtime}</td>
                        <td>
                        <button class="edit-item" data-mode="bus" data-id="${element.id}">編輯</button>
                        <button class="del-item" data-mode="bus" data-id="${element.id}">刪除</button>
                        </td>
                        </tr>
                        `;
                });

                html += `
                            </tbody>
                            </table>
                        `;
                break;

            case 'station':
                html = `
                            <div id="manage-text">
                                <h3>站點管理</h3>
                                <button data-mode="station" class="add-item btn btn-outline-secondary">新增</button>
                            </div>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>站點名稱</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;
                data.forEach(element => {
                    html += `
                                <tr>
                                    <td>${element.name}</td>
                                    <td>
                                        <button class="edit-item" data-mode="station" data-id="${element.id}">編輯</button>
                                        <button class="del-item" data-mode="station" data-id="${element.id}">刪除</button>
                                    </td>
                                </tr>
                            `;
                });

                html += `
                            </tbody>
                            </table>
                        `;
                break;

            case 'form':
                html = `
                            <div id="manage-text">
                                <h3>表單管理</h3>
                            </div>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>名字</th>
                                        <th>信箱</th>
                                        <th>路線</th>
                                        <th>意見</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;
                data.forEach(element => {
                    html += `
                        <tr>
                            <td>${element.id}</td>
                            <td>${element.name}</td>
                            <td>${element.email}</td>
                            <td>${element.route}</td>
                            <td>${element.note}</td>
                            <td>
                                <button class="del-item" data-mode="form" data-id="${element.id}">刪除</button>
                            </td>
                        </tr>
                    `;
                });

                html += `
                            </tbody>
                            </table>
                        `;
                break;

            default:
                alert("沒有此指令");
                break;
        }
        managebox.html(html)
    });
}

$(document).on("click", ".del-item", function () {
    let mode = $(this).data("mode");
    let id = $(this).data("id");

    if (!confirm('是否確認刪除?')) {
        return
    }
    switch (mode) {
        case "route":
            let name = $(this).data("name");
            $.post("./api/del.php", { id: id, mode: mode }, (data) => {
                console.log(data)
                if (data == "1") {
                    alert(`刪除成功！`);
                } else {
                    alert(`刪除失敗！`);
                }
                getmanage("route");
            });
            break;
        case "bus":
            $.post("./api/del.php", { id: id, mode: mode }, (data) => {
                console.log(data)
                if (data == "1") {
                    alert(`刪除成功！`);
                } else {
                    alert(`刪除失敗！`);
                }
                getmanage("bus");
            });
            break;
        case "station":
            $.post("./api/del.php", { id: id, mode: mode }, (data) => {
                console.log(data)
                if (data == "1") {
                    alert(`刪除成功！`);
                } else {
                    alert(`刪除失敗！`);
                }
                getmanage("station");
            });
            break;
        case "form":
            $.post("./api/del.php", { id: id, mode: mode }, (data) => {
                console.log(data)
                if (data == "1") {
                    alert(`刪除成功！`);
                } else {
                    alert(`刪除失敗！`);
                }
                getmanage("form");
            });
            break;

        default:
            break;
    }
})


$(document).on("click", ".add-item", function () {
    let mode = $(this).data("mode");
    let html
    switch (mode) {
        case "route":
            html = `
                <div id="manage-text">
                    <h3>路線新增</h3>
                </div>
                <div>
                    <label for="route-name">路線名稱</label>
                    <input type="text" name="name" id="route-name" class="form-control mb-3">
                    <hr>
            `;

            $.get('./api/get.php', { mode: "station" }, (data) => {
                data.forEach((element, index) => {
                    html += `
                        <div class="route-item mb-2" data-id="${element.id}">
                            <input type="checkbox" data-id="${element.id}" class="route-id">
                            <label class="station-name">${element.name}</label>
                            <input type="number" class="arring" name="arring" placeholder="抵達時間">
                            <input type="number" class="staying" name="staying" placeholder="停留時間">
                            <input type="number" class="seq" name="seq" placeholder="站點順序">
                        </div>
                    `;
                });

                html += `
                    </div>
                    <button class="back-to" data-mode="bus">回上頁</button>
                    <button class="submit-add" data-mode="route">送出</button>
                `;
                $("#manage-box").html(html);
            });

            break;

        case "bus":
            html = `
                        <div id="manage-text">
                            <h3>新增車輛</h3>
                        </div>
                        <label for="routeName">路線</label>
                        <select name="routeName" id="routeName">
                    `;

            $.get('./api/get.php', { mode: 'route' }, (routes) => {
                routes.forEach(route => {
                    html += `
                        <option value="${route.id}">${route.name}</option>  
                    `;
                });

                html += `            
                            </select>
                            <label for="name">車牌</label>
                            <input type="text" class="name" name="name">
                            <label for="runtime">以行駛時間(分鐘)</label>
                            <input type="number" class="runtime" name="runtime">
                            <button class="back-to" data-mode="bus">回上頁</button>
                            <button class="submit-add" data-mode="bus">送出</button>
                        `;
                $("#manage-box").html(html);

            });

            break;

        case "station":
            html = `
                        <div id="manage-text">
                            <h3>新增站點</h3>
                        </div>  
                        <label for="routeName">站點名稱</label>
                        <input type-"text" class="station-name" name="station-name">
                        <button class="back-to" data-mode="station">回上頁</button>
                        <button class="submit-add" data-mode="station">送出</button>
                    `;
            $("#manage-box").html(html);

            break;
            3




        default:
            alert("沒有新增指令");
            break;
    }
});

$(document).on("click", ".edit-item", function () {
    let mode = $(this).data("mode");
    let id = $(this).data("id");
    let html
    switch (mode) {
        case "route":
            html = `
                        <div id="manage-text">
                            <h3>路線編輯</h3>
                        </div>
                        <div>   
                            <label for="route-name">路線名稱</label>
                    `;
            $.get('./api/get.php', { mode: "route", id: id }, (routeData) => {
                let route = routeData[0];

                html += `
                            <input type="text" name="name" id="route-name" class="form-control mb-3" value="${route.name}">
                            <hr>
                        `;

                $.get('./api/get.php', { mode: "station" }, (stationData) => {
                    stationData.forEach((element) => {
                        html += `
                                <div class="route-item mb-2" data-id="${element.id}">
                                    <input type="checkbox" data-id="${element.id}" class="route-id">
                                    <label class="station-name">${element.name}</label>
                                    <input type="number" class="arring" name="arring" placeholder="抵達時間">
                                    <input type="number" class="staying" name="staying" placeholder="停留時間">
                                    <input type="number" class="seq" name="seq" placeholder="站點順序">
                                    <input type="hidden" class="routeid" name="routeid" value="${id}">
                                </div>
                            `;
                    });

                    html += `
                                </div>
                                <button class="back-to">回上頁</button>
                                <button class="submit-edit" data-mode="route" data-id="${id}">送出</button>
                            `;
                    $("#manage-box").html(html);
                });
            });
            break;
        case "bus":
            let route = $(this).data("route")
            $.get('./api/get.php', { mode: "route", id: route }, function (routedata) {
                $.get('./api/get.php', { mode: "bus", id: id }, function (busData) {
                    let bus = busData[0];
                    console.log(bus)
                    html = `
                        <div id="manage-text">
                            <h3>修改 ${routedata[0].name} 路線「 ${bus.name} 」</h3>
                        </div>
                        <div>   
                            <label for="bus-name">已行駛時間(分鐘)</label>
                            <input type="text" name="runtime" id="runtime" class="form-control mb-3" value="${bus.runtime}">
                            <button class="back-to" data-mode="bus">回上頁</button>
                            <button class="submit-edit"  data-id="${bus.id}" data-mode="bus">送出</button>
                        </div>
                        `;
                    $("#manage-box").html(html);
                });
            })
            break;
        case "station":
            $.get('./api/get.php', { mode: "station", id: id }, (stationData) => {
                let station = stationData[0];
                console.log(station)
                html = `
                        <div id="manage-text">
                            <h3>修改「 ${station.name} 」</h3>
                        </div>
                        <div>   
                            <label for="station-name">站點名稱</label>
                            <input type="text" name="station-name" id="station-name" class="form-control mb-3" value="${station.name}">
                            <button class="back-to" data-mode="station">回上頁</button>
                            <button class="submit-edit"  data-id="${station.id}" data-mode="station">送出</button>
                        </div>
                        `;
                $("#manage-box").html(html);

            });
            break;
        default:
            break;
    }
})

//submit-add
$(document).on("click", ".submit-add", function () {
    let mode = $(this).data("mode");

    switch (mode) {
        case "route":
            let pushArray = [];
            let routeName = $("#route-name").val();
            let state
            let quantity = 0
            if (routeName === "") {
                alert("路線名稱未填")
                return
            }
            $(".route-id:checked").each(function () {
                let id = $(this).data("id");
                let parent = $(this).closest(".route-item");
                let state = false
                let arring = parent.find(".arring").val();
                let staying = parent.find(".staying").val();
                let seq = parent.find(".seq").val();

                if (arring === "" || staying === "" || seq === "") {
                    state = true
                }
                quantity += 1
                pushArray.push({
                    stationId: id,
                    arring: arring,
                    staying: staying,
                    seq: seq
                });
            });
            if (quantity < 2) {
                alert("至少選兩站")
                return
            }
            if (state) {
                alert("有站點的表格未填")
                return
            }
            $.post('./api/add.php', {
                mode: "route",
                name: routeName,
                stations: JSON.stringify(pushArray)
            }, (res) => {
                console.log(res)
                if (res == "1") {
                    alert(`新增成功！`);
                } else {
                    alert(`新增失敗！`);
                }
                getmanage("route");
            });
            break;
        case "bus":
            let route = $("#routeName").val();
            let name = $(".name").val();
            let runtime = $(".runtime").val();

            if (route === '' || name === '' || runtime === '') {
                alert("有欄位未填寫！");
                return;
            }

            $.post("./api/add.php", {
                mode: "bus",
                route: route,
                name: name,
                runtime: runtime
            }, (res) => {
                console.log(res)
                if (res == "1") {
                    alert(`新增成功！`);
                } else {
                    alert(`新增失敗！`);
                }
                getmanage("bus");
            });

            break;
        case "station":
            stationName = $(".station-name").val();


            if (stationName === '') {
                alert("欄位未填寫！");
                return;
            }

            $.post("./api/add.php", {
                mode: "station",
                name: stationName
            }, (res) => {
                console.log(res)
                if (res == "1") {
                    alert(`新增成功！`);
                } else {
                    alert(`新增失敗！`);
                }
                getmanage("station");
            });

            break;

        default:
            break;
    }
});
//submit-edit
$(document).on("click", ".submit-edit", function () {
    let mode = $(this).data("mode");
    let id = $(this).data("id");

    switch (mode) {
        case "route":
            let pushArray = [];
            let state
            let quantity = 0
            let routeName = $("#route-name").val();
            if (routeName === "") {
                alert("路線名稱未填")
                return
            }
            $(".route-id:checked").each(function () {
                let id = $(this).data("id");
                let parent = $(this).closest(".route-item");
                let state = false
                let arring = parent.find(".arring").val();
                let staying = parent.find(".staying").val();
                let seq = parent.find(".seq").val();

                if (arring === "" || staying === "" || seq === "") {
                    state = true
                }
                quantity += 1
                pushArray.push({
                    stationId: id,
                    arring: arring,
                    staying: staying,
                    seq: seq
                });
            });
            if (quantity < 2) {
                alert("至少選兩站")
                return
            }
            if (state) {
                alert("有站點的表格未填")
                return
            }
            $.post('./api/edit.php', {
                mode: "route",
                id: id,
                name: routeName,
                stations: JSON.stringify(pushArray)
            }, (res) => {
                console.log(res)
                if (res == "1") {
                    alert(`編輯成功！`);
                } else {
                    alert(`編輯失敗！`);
                }
                getmanage("route");
            });

            break;
        case "bus":
            let runtime = $("#runtime").val();
            if (runtime === "") {
                alert("有表格未填");
                return false;
            }
            $.post('./api/edit.php', {
                mode: "bus",
                id: id,
                runtime: runtime,
            }, (res) => {
                console.log(res)
                if (res == "1") {
                    alert(`編輯成功！`);
                } else {
                    alert(`編輯失敗！`);
                }
                getmanage("bus");
            });
            break;
        case "station":
            let station = $("#station-name").val();
            if (station === "") {
                alert("有表格未填");
                return false;
            }
            $.post('./api/edit.php', {
                mode: "station",
                id: id,
                name: station,
            }, (res) => {
                console.log(res)
                if (res == "1") {
                    alert(`編輯成功！`);
                } else {
                    alert(`編輯失敗！`);
                }
                getmanage("station");
            });
            break;
        default:
            break;
    }
});
//back-to
$(document).on("click", ".back-to", function () {
    let mode = $(this).data("mode");
    getmanage(mode);
})