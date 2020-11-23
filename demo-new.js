var url = 'http://localhost:3000/users';
var datatype = 'json'

$(document).ready(function () {
    // alert('abc');
    
    getall();

    //顯示全部
    $("#showall").click( function(){
        getall()
    })

    // 送出新增
    $('#addbtn').click(function (e) {

        var cnname = $("#addcnname").val();
        var enname = $("#addenname").val();
        var sex = $('input:radio:checked[name="addsex"]').val();

        // 驗證欄位
        if(cnname =='' || enname ==''){
            alert('請填入完整資料')
        } else {
            $.ajax({
                url: url,
                method: 'post',
                dataType: datatype,
                data:{
                    cnname: cnname,
                    enname: enname,
                    sex: sex
                }
             }).done(function(response){
                 console.log(response)
                 getall();
                 $("#dialog-addconfirm").modal("hide");
                 $("#addform")[0].reset();
             }).fail(function(err){
                 console.log(err)
             });   
        }

        e.preventDefault();
        
    })


    // 搜尋按鈕
    $('#searchbtn').click(function (e) {
        // var data = $("#searchform").serialize();
        var sec_cnname = $("#secnname").val();
        var sec_enname = $("#seenname").val();
        var sec_sex = $('input:radio:checked[name="sesex"]').val();
        // console.log(cnname+enname+sex)

        $.ajax({
            url: url,
                method: 'get',
                dataType: datatype,
        }).done(function(response){
            // console.log(response)
            secresult = response.filter(function(i){
               return  i.cnname.includes(sec_cnname) && i.enname.includes(sec_enname) && i.sex.includes(sec_sex)              
            })        
            console.log(secresult)
            refreshTable(secresult)
            $("#dialog-searchconfirm").modal("hide");
            $("#searchform")[0].reset();
        }).fail(function(err){
            console.log(err)
        });   
        

        e.preventDefault();
    })


    // 重新填寫
    $('#addrewrite').click(function () {
        // console.log('click')
        $("#addform")[0].reset();
    })

    $('#searchrewrite').click(function () {
        $("#searchform")[0].reset();
    })

    $('#modifyrewrite').click(function () {
        // console.log('click')
        $("#modifyform")[0].reset();
    })


    // 修改
    $("#cardtable").on('click', '.modifybutton', function () {
        var modifyid = $(this).attr('id').substring(12);
        console.log(modifyid)     
        $("#modifysid").val(modifyid);

        $.ajax({
            url: url + "/" + modifyid,
            method: 'get',
            dataType: datatype
         }).done(function(response){
            $("#mocnname").val(response.cnname);
            $("#moenname").val(response.enname);
            if (response.sex == 0) {
                $("#modifyman").prop("checked", true);
                $("#modifywoman").prop("checked", false);
            }
            else {
                $("#modifyman").prop("checked", false);
                $("#modifywoman").prop("checked", true);
            }
         }).fail(function(err){
             console.log(err)
         });

    })

    //送出修改
    $('#modifybtn').click(function (e) {
        var modifyid = $("#modifysid").val()
        var cnname = $("#mocnname").val();
        var enname = $("#moenname").val();
        var sex = $('input:radio:checked[name="mosex"]').val();
        console.log(modifyid)

        //驗證欄位
        if(cnname =='' || enname ==''){
            alert('請填入完整資料')
        } else {
        $.ajax({
            url: url + "/" + modifyid,
            method: 'put',
            dataType: datatype,
            data: {
                cnname: cnname,
                enname: enname,
                sex: sex
            }
         }).done(function(response){
            console.log(response)
            getall();
            $("#dialog-modifyconfirm").modal("hide");

         }).fail(function(err){
             console.log(err)
         })};
    })


    // 刪除
    $("#cardtable").on('click','.deletebutton',function (deleteid){
        // console.log("click")
        var deleteid = $(this).attr('id').substring(12);   
        // console.log(deleteid)
        $("#deletebtn").data("id",deleteid)
    })

    
    // 刪除確認
    $("#deletebtn").click(function(){
        var deleteid = $(this).data("id")
        // console.log(deleteid)
        $.ajax({
            url: url + "/" + deleteid,
            method: 'delete',
            dataType: datatype
         }).done(function(response){
             console.log(response)
             getall();
             $("#dialog-deleteconfirm").modal("hide");
         }).fail(function(err){
             console.log(err)
         });
    })
    
       
});



function refreshTable(data) {
    // var HTML = '';
    $("#cardtable tbody > tr").remove();
    $.each(data, function (key, item) {
        var strsex = '';
        if (item.sex == 0)
            strsex = '男';
        else
            strsex = '女';
        var row = $("<tr></tr>");
        row.append($("<td></td>").html(item.cnname).data('toggle', 'tooltip').attr('title', `${item.cnname}${item.enname}-${strsex}`));
        row.append($("<td></td>").html(item.enname).data('toggle', 'tooltip').attr('title', `${item.cnname}${item.enname}-${strsex}`));
        row.append($("<td></td>").html(strsex));
        row.append("<td></td>");
        row.append("<td></td>");
        row.append($("<td></td>").html('<button id="modifybutton' + item.id + '" class="modifybutton btn btn-info" data-toggle="modal" data-target="#dialog-modifyconfirm">修改 <i class="fas fa-edit"></i></button>'));
        row.append($("<td></td>").html('<button id="deletebutton' + item.id + '" class="deletebutton btn btn-danger" data-toggle="modal" data-target="#dialog-deleteconfirm">刪除 <i class="fas fa-trash-alt"></i></button>'));
        $("#cardtable").append(row);
    });
}




function getall() {
    $.ajax({
        url: url,
        method: 'get',
        dataType: datatype
     }).done(function(response){
         console.log(response)
         refreshTable(response);
     }).fail(function(err){
         console.log(err)
     });
}






