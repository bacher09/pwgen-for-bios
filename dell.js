
function ord(str){
    return str.charCodeAt(0);
}

function StrintToArray(str){
    var arr = [];
    for(var i=0;i<str.length;i++){
        arr[i] = ord(str.charAt(i));
    }
    return arr;
}

function toByte(arr){
    for(var i=0;i<arr.length;i++){
        arr[i] = arr[i] & 0xFF;
    }
    return arr;
}
        

function begin_calc(serial, s_arr){
    var ret_arr = [];
    if(typeof(serial)=="string"){
        serial = StrintToArray(serial);
    }
    
    ret_arr[0] = serial[ s_arr[3] ];
    ret_arr[1] = ( serial[ s_arr[3] ] >> 5) |
                 (( (serial[ s_arr[2] ] >> 5) | (serial[ s_arr[2] ] << 3))
                & 0xF1);
    ret_arr[2] = (serial[ s_arr[2] ] >> 2);
    ret_arr[3] = (serial[ s_arr[2] ] >> 7) | (serial[ s_arr[1] ] << 1);
    ret_arr[4] = (serial[ s_arr[1] ] >> 4) | (serial[ s_arr[0] ] << 4);


    ret_arr[5] = (serial[1] >> 1);
    ret_arr[6] = (serial[1] >> 6) | (serial[0] << 2);
    ret_arr[7] = (serial[0] >> 3);
    

    return toByte(ret_arr);
}


function calc_suffix_tag(serial){
    var ret_arr = begin_calc(serial,[1,2,3,4]);





}

function dell_service_tag(serial){



}
