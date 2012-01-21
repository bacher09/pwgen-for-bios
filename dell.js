

var encscans = [0x05,0x10,0x13,0x09,0x32,0x03,0x25,0x11,0x1F,0x17,0x06,
                0x15,0x30,0x19,0x26,0x22,0x0A,0x02,0x2C,0x2F,0x16,0x14,0x07,
                0x18,0x24,0x23,0x31,0x20,0x1E,0x08,0x2D,0x21,0x04,0x0B,0x12,
                0x2E];

var  scancods = "\00\0331234567890-=\010\011qwertyuiop[]\015\377asdfghjkl;'`\377\\zxcvbnm,./";



function ord(str){
    return str.charCodeAt(0);
}

function chr(ascii_code){
    return String.fromCharCode(ascii_code);
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
        
function calc_in(l_arr){
    return [ (l_arr[1] >> 1),
             ((l_arr[1] >> 6) | (l_arr[0] << 2)), 
             (l_arr[0] >> 3) ];
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

   ret_arr = ret_arr.concat(calc_in(serial)); 

    return toByte(ret_arr);
}

function end_calc(serial, calced_arr, s_arr){
    var r = 0;
    var ret_arr = [];
    for (var i=0;i<8;i++) {
        r = 0xAA;
        (calced_arr[i] & 1) && (r ^= serial[ s_arr[0] ]);
        (calced_arr[i] & 2) && (r ^= serial[ s_arr[1] ]);
        (calced_arr[i] & 4) && ( r ^= serial[ s_arr[2] ]);
        (calced_arr[i] & 8) && (r ^= serial[1]);
        (calced_arr[i] & 16) && (r ^= serial[0]);
        
        ret_arr[i] = encscans[r % encscans.length];
    }
    return ret_arr;
}

function calc_suffix_shortcut(serial, s_arr1, s_arr2){
    var serial_arr = StrintToArray(serial);
    var ret_arr = begin_calc(serial_arr,s_arr1);
    return end_calc(serial_arr, ret_arr, s_arr2); 
}

function calc_suffix_tag(serial){
    return calc_suffix_shortcut(serial, [1,2,3,4],[4,3,2]);
}

function calc_suffix_hdd_new(serial){
    return calc_suffix_shortcut(serial, [1,10,9,8], [8,9,10]);
}

/* Depends only in first two chars */
function calc_suffix_hdd_old(serial){
    // encscans[26], enscans[0xAA % enscans.length]
    var ret_arr = [49,49,49,49,49]; 
    var serial_arr = StrintToArray(serial);
    ret_arr = ret_arr.concat(calc_in(serial_arr));
    // lower bits then 5 are never change
    for(var i=5;i<8;i++){
        var r = 0xAA;
        (ret_arr[i] & 8) && (r ^= serial[1]);
        (ret_arr[i] & 16) && (r ^= serial[0]);
        ret_arr[i] = encscans[ r % encscans.length];
    }
    return ret_arr;
}

function dell_service_tag(serial){



}

/* Depends only in first two chars */
function dell_service_hdd_old(serial){
    var t_arr = calc_suffix_hdd_old(serial);
    var ret_str = "";
    for(var i=0;i<t_arr.length;i++){
        ret_str += scancods.charAt( t_arr[i]);
    }
    return ret_str;
}
