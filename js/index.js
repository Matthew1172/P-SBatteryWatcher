/*
Get transactions from a topic
*/
$('#get-msgs-from-topic').submit(function (event) {
    event.preventDefault();

    //clear the list
    $("#msgList").empty();

    var tid = $("#tid").val();
    var url = "https://testnet.mirrornode.hedera.com/api/v1/topics/"+tid+"/messages/";
    $.get(url, function(data, status){
        $("#tpList").show();
        var msgs = data.messages;
        msgs.forEach((m) => {
            /*
            "chunk_info": {
                "initial_transaction_id": {
                    "account_id": "0.0.30808133",
                    "nonce": 0,
                    "scheduled": false,
                    "transaction_valid_start": "1645919518.811314011"
                },
                "number": 1,
                "total": 1
            },
            "consensus_timestamp": "1645919528.158203163",
            "message": "OGQzZGNkZGQ1NjJlYmZhMTUwNGZkYzg2YjZlNzc5MTA2MjhiMDhkZjg2NTJiOGMwNmYyOGY2NjIzNzdkOTlhZmRiYjJkNjIyYmQyZTNjMzI0M2YyZTgzY2YzYTVhMDNl",
            "payer_account_id": "0.0.30808133",
            "running_hash": "kCOKjLPB9sd7F3BI0UtjDSSctb94RqKKi/ZLH35ZnzL+dIwPA3Wvh6tY4zMfjU8s",
            "running_hash_version": 3,
            "sequence_number": 3,
            "topic_id": "0.0.30812478"
            */
            var p_acc = m.payer_account_id;
            var seq = m.sequence_number;
            var topic = m.topic_id
            var msg = m.message;
            var consensus_timestamp = m.consensus_timestamp;
            
            var acc_id = m.chunk_info.initial_transaction_id.account_id
            var transaction_valid_start = m.chunk_info.initial_transaction_id.transaction_valid_start;
            transaction_valid_start = transaction_valid_start.replace(".", "-");
            var trans_id = acc_id+'-'+transaction_valid_start;

            var html = '<li><div class="messageBox"><p><b>Payer account: </b>'+p_acc+'</p><p><b>Seq. #: </b>'+seq+'</p><p><b>Topic ID: </b>'+topic+'</p><p><b>Message: </b>'+msg+'</p><p><b>Consensus time: </b>'+consensus_timestamp+'</p><p><b>Transaction id: </b>'+trans_id+'</p><button class="verifyTrans btn btn-warning" id='+trans_id+'>Verify</button></div></li>';
            $("#msgList").append(html);
        })
    });
});

/*
Verify transaction
*/
$(document).on('click', '.verifyTrans', function () {
    var trans_id = $(this).attr('id');
    var trans_id_api;
    trans_id_api = trans_id.replace("-", "@");
    trans_id_api = trans_id_api.replace("-", ".");
    //GET http://172.16.26.77:8080/v1/action/?transactionId=0.0.1035@1587742118.141000000
    var url = "http://172.16.26.77:8080/v1/action/?transactionId="+trans_id_api;
    $.get(url, function(data, status){
        if(status == "success"){
            //$("#"+trans_id).addClass('verifiedTrue');
            //$(this).parent().hide();
            alert("This is a verified battery.");
            console.log(data);
        }else{
            alert("This is not a verified battery.");
            console.log(data);
        }
    });
});


/*
* insert a transaction
*/
$('#insert-transaction').submit(function (event) {
    event.preventDefault();
    var from = $('#fromArea').val();
    var to = $('#toArea').val();
    
    var pl = from+to;
    var s = "hash"

    var transaction = {
        payload: pl,
        submit: s
    }
    
    $.ajax({
        url: "http://172.16.26.77:8080/v1/action",
        type: "POST",
        dataType: 'JSON',
        data: JSON.stringify(transaction),
        beforeSend: function () {
            $('#loading').show()
        },
        success: function (response) {
            $("#submittedMsgs").show();
            var html = '<li>'+response.transactionId+'</li>';
            $("#submsgList").append(html);
        }
    }).done(function() {
        $('#loading').hide();
    });
});

/*
function success() {
	alert("Success.");
	document.location.reload(true);
}

function fail(m) {
    var msg = (typeof m === 'string' || m instanceof String) ? m : "Something went wrong.";
	alert(msg);
	//document.location.reload(true);
}
*/