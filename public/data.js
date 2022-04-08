$(document).ready(function(){
    alert('application started');

    getdata();

    $('.addbtn').click(function(){
        var task = $("#task").val();
        $.ajax({
            url:'/task/addtask',
            method:'post',
            dataType:'json',
            data:{'task':task},
            success:function(response){
                if(response.msg=='success'){
                //    $("#task").remove();
                alert('task added successfully');
                getdata();
                $('#task').val('')
                }else{
                    alert('some error occurred try again');
                }
            },
            error:function(response){
                alert('server error occured')
            }
        });
    });

    $(document).on('click','button.del',function(){
        var id = $(this).parent().find('button.del').val();
        // alert('edit: ' + id)
        $.ajax({
            url:'/task/removetask',
            method:'delete',
            dataType:'json',
            data:{'id':id},
            success:function(response){
                if(response.msg=='success'){
                    alert('data deleted');
                    getdata();
                }else{
                    alert('data not get deleted');
                }
            },
            error:function(response){
                alert('server error')
            }
        });
    });

    $(document).on('click','button.edit',function(){
        var id = $(this).parent().find('button.edit').val();
        alert('edit: ' + id)
        // $.ajax({
        //     url:'/task/removetask',
        //     method:'delete',
        //     dataType:'json',
        //     data:{'id':id},
        //     success:function(response){
        //         if(response.msg=='success'){
        //             alert('data deleted');
        //             getdata();
        //         }else{
        //             alert('data not get deleted');
        //         }
        //     },
        //     error:function(response){
        //         alert('server error')
        //     }
        // });
    });

    function getdata(){
        $.ajax({
            url:'/task/gettask',
            method:'get',
            dataType:'json',
            success:function(response){
                if(response.msg=='success'){
                    $('tr.taskrow').remove()
                    if(response.data==undefined || response.data==null || response.data==''){
                        $('.tblData').hide();
                    }else{
                        $('.tblData').show();
                        $.each(response.data,function(index,data){
                            var url = url+data._id;
                            index+=1;
                            // console.log("<tr class='taskrow'><td>" + index + "</td><td>" + data.task+ "</td><td>" + "<button class='del' value='" + data._id + "'>delete</button>" + "&nbsp;&nbsp;&nbsp;" + "<button class='edit' value='" + data._id + "'> edit </button>" +"</td></tr>");
                            $('tbody').append("<tr class='taskrow'><td>" + index + "</td><td>" + data.task+ "</td><td>" + "<button class='del' value='" + data._id + "'>delete</button>" + "&nbsp;&nbsp;&nbsp;" + "<button class='edit' value='" + data._id + "'> edit </button>" +"</td></tr>");
                            });
                            // console.log($('tbody').html());
                            $("#div1").html($('tbody').html());
                    }
                }
            },
            error:function(response){
                alert('server error');
            }
        });
    }

    //點選查詢
    $("#search").click(function () {
        table.ajax.reload();
        });
        //初始化datatables
        var table = $('#example').DataTable({
        "searching": false,
        "serverSide": true,
        "bProcessing": true,
        "bPaginate": true, //翻頁功能
        "bLengthChange": true, //改變每頁顯示資料數量
        "bFilter": true, //過濾功能
        "bSort": false, //排序功能
        "sPaginationType": "full_numbers",
        "fnServerData": function (sSource, aoData, fnCallback) {
        var json = {
        "page": {
        "start": aoData[3].value,
        "length": aoData[4].value,
        },
        "search": {
        "xb": $("#searchTitle").val()
        }
        };
        $.ajax({
        "dataType": 'json',
        "type": "POST",
        "url":  "user/queryUser.do",
        "contentType": "application/json; charset=utf-8",
        "data": JSON.stringify(json),
        "success": function (data) {
        data.recordsTotal = data.page.recordsTotal;
        data.recordsFiltered = data.page.recordsTotal;
        fnCallback(data);
        }
        });
        },
        "oLanguage": {
        "sLengthMenu": "每頁顯示 _MENU_ 條記錄",
        "sZeroRecords": "抱歉， 沒有找到",
        "sInfoEmpty": "沒有資料",
        "sInfoFiltered": "(從 _MAX_ 條資料中檢索)",
        "oPaginate": {
        "sFirst": "首頁",
        "sPrevious": "前一頁",
        "sNext": "後一頁",
        "sLast": "尾頁"
        },
        "sZeroRecords": "沒有檢索到資料",
        },
        "aoColumns": [
        {"data": "zy"},
        {"data": "xm"},
        {"data": "xb"},
        {"data": "fov"}
        ]
        });
        ///////////////////////////////////////////////////////////////////////////////
        //增加
        $("#add").click(function () {
        layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上邊框
        area: ['420px', '240px'], //寬高
        btn: ['確定'],
        yes: function (index, layero) {
        var json = {
        "zy": $("#zhiy").val(),
        "xm": $("#name").val(),
        "xb": $("#sex").val(),
        "fov_ck": $("#aihao").val()
        };
        $.ajax({
        type: "POST",
        url: "user/addUser.do",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json),
        dataType: "json",
        success: function (data) {
        if (data.success == true) {
        layer.msg(data.msg);
        } else if (data.success == false) {
        layer.msg(data.msg);
        }
        }
        });
        layer.close(index);
        table.ajax.reload();
        },
        // content: '職業：'   '<input type="text" name="" id="zhiy" value=""/>'   '<br>姓名：'
        // '<input type="text" name="" id="name" value=""/>'   '<br>性別：'
        // '<input type="text" name="" id="sex" value=""/>'   '<br>愛好：'
        // '<input type="text" name="" id="aihao" value=""/>'
        });
        });
        //選中一行觸發
        $('#example tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        adatid = "";
        }
        else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        adatid = table.row(this).data().guid;
        adata = table.row(this).data().zy;
        bdata = table.row(this).data().xm;
        cdata = table.row(this).data().xb;
        ddata = table.row(this).data().fov;
        }
        });
        ////////////////////////////////////////////////////////////////////////////////////////
        //修改
        $("#change").click(function () {
        if (adatid === '') {
        alert("請選中要修改的資料");
        } else {
        layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上邊框
        area: ['420px', '240px'], //寬高
        btn: ['確定'],
        yes: function (index, layero) {
        var json = {
        "guid": adatid,
        "zy": $("#cid").val(),
        "xm": $("#cname").val(),
        "xb": $("#csex").val(),
        "fov_ck": $("#cage").val()
        };
        $.ajax({
        type: "POST",
        url: "user/updateUser.do",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json),
        dataType: "json",
        success: function (data) {
        if (data.success == true) {
        layer.msg(data.msg);
        } else if (data.success == false) {
        layer.msg(data.msg);
        }
        }
        });
        layer.close(index);
        table.ajax.reload();
        },
        // content: '職業：'   '<input type="text" name="" id="cid"/>'   '<br>姓名：'
        // '<input type="text" name="" id="cname"/>'   '<br>性別：'
        // '<input type="text" name="" id="csex"/>'   '<br>愛好：'
        // '<input type="text" name="" id="cage"/>'
        });
        }
        $("#cid").val(adata);
        $("#cname").val(bdata);
        $("#csex").val(cdata);
        $("#cage").val(ddata);
        });
        ////////////////////////////////////////////////////////////////////////////////
        //刪除
        $("#del").click(function () {
        if (adatid === '') {
        alert("請刪除要修改的資料");
        } else {
        var json = {
        "guid": adatid
        };
        $.ajax({
        type: "POST",
        url: "user/deleteUser.do",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json),
        dataType: "json",
        success: function (data) {
        if (data.success == true) {
        layer.msg(data.msg);
        } else if (data.success == false) {
        layer.msg(data.msg);
        }
        }
        });
        table.ajax.reload();
        }
        });

});