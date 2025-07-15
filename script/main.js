$(document).ready(function(){
    veri();
})
if (localStorage.getItem("state") == "1") {
    $("#logout-button").css("display","block");
    $("#login-box").css("display","flex");
    $("#logout-box").css("display","none");
} else {
    $("#logout-button").css("display","none");
    $("#login-box").css("display","none");
    $("#logout-box").css("display","flex");
}
$(document).on("click",".href-btn",function(){
    location.href = $(this).data("link")
})
$(document).on("click","#logout-button",function(){
    localStorage.setItem("state","0")
    alert("登出成功")
    location.reload()
})
$(document).on("click","#regenerate-captcha-button",function(){
    veri()
})
$(document).on("click","#login-button",function(){
    let username = $("#username").val()
    let password = $("#password").val()
    let veri = $("#veri").val()
    let captcha = $("#captcha").val()

    if(username == "" && password == "" && veri == ""){
        alert("有表格未填")
        
    }else if(username === "admin" && password === "1234" && veri === captcha ){
        localStorage.setItem("state","1")
        alert("登入成功")
        location.reload()
    }else{
        localStorage.setItem("state","0")
        alert("帳號密碼或驗證碼錯誤")
        location.href = "index.html"
    }
})
function veri(){
    let veri = Math.floor(Math.random() * 9000) + 1000;
    $("#captcha").val(veri)
}
