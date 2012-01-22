

var encscans = [0x05,0x10,0x13,0x09,0x32,0x03,0x25,0x11,0x1F,0x17,0x06,
                0x15,0x30,0x19,0x26,0x22,0x0A,0x02,0x2C,0x2F,0x16,0x14,0x07,
                0x18,0x24,0x23,0x31,0x20,0x1E,0x08,0x2D,0x21,0x04,0x0B,0x12,
                0x2E];

var  scancods = "\00\0331234567890-=\010\011qwertyuiop[]\015\377asdfghjkl;'`\377\\zxcvbnm,./";

var encData = [ 0x67452301 | 0, // For bit alignment
                0xEFCDAB89 | 0,
                0x98BADCFE | 0,
                0x10325476 | 0];

var MD5magic_o = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x4881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
            ];

function CorectBits(arr){
    if(typeof(arr) == 'object'){
        for(var i = 0;i<arr.length;i++){
            arr[i] = arr[i] | 0;
        }
        return arr;
    } else {
        return arr | 0;
    }
}

var MD5magic = CorectBits(MD5magic_o);

function ord(str){
    return str.charCodeAt(0);
}

function chr(ascii_code){
    return String.fromCharCode(ascii_code);
}

function SignedToUnsigned(num){
    return num >>> 0;
}

function copy_array(ar){
    var temp_arr = [];
    for(var i=0;i<ar.length;i++){
        temp_arr[i] = ar[i];
    }
    return temp_arr;
}

function StrintToArray(str){
    var arr = [];
    if(typeof(str)=="object"){
        return str;
    }
    for(var i=0;i<str.length;i++){
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}

function toByte(arr){
    for(var i=0;i<arr.length;i++){
        arr[i] = arr[i] & 0xFF;
    }
    return arr;
}


function ByteArrToIntArr(b_arr){
    var k = b_arr.length >> 2;
    var ret_arr = [];
    for(var i=0;i<=k;i++){
        ret_arr[i] = b_arr[i*4] | (b_arr[i*4+1] << 8) |
                     (b_arr[i*4+2] << 16) |
                     (b_arr[i*4+3] << 24);
    }
    return ret_arr;
}

function StringToIntArr(str){
    return (typeof(str)=="object") ? ByteArrToIntArr(str) :
                        ByteArrToIntArr(StrintToArray(str));
}

function IntToByteArr(num){
    var ret_arr = [];
    ret_arr[0] = (num & 0xFF );
    ret_arr[1] = ((num >> 8) & 0xFF );
    ret_arr[2] = ((num >> 16) & 0xFF );
    ret_arr[3] = ((num >> 24) & 0xFF );
    return ret_arr
}

function IntArrToByteArr(int_arr){
    var ret_arr = [];
    for(var i=0;i<int_arr.length;i++){
        ret_arr = ret_arr.concat(IntToByteArr(int_arr[i]));
    }
    return ret_arr;
}

function fill_zero(arr, from, to){
    for(var i=from;i<to;i++){
        arr[i] = 0;
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


function blockEncode(encBlock,f1, f2, f3, f4 ,f5){
    var A = encData[0] | 0; // For bit alignment
    var B = encData[1] | 0;
    var C = encData[2] | 0;
    var D = encData[3] | 0;
    
    function rol(t, bitsrot, num){
        var k = bitsrot[num >> 4][i & 3];
        return  (SignedToUnsigned(t)/ Math.pow(2,32 - k)) | 
                ((SignedToUnsigned(t) << k) | 0 );
    }

    function f_shortcut(func, key, num){
        return (A + f1(func, B, C , D, MD5magic[num] + encBlock[ key ])) | 0;
    }
    
    var S = [ [ 7, 12, 17, 22 ],
              [ 5, 9,  14, 20 ],
              [ 4, 11, 16, 23 ],
              [ 6, 10, 15, 21 ]
            ];
    var t;
    for(i=0;i<64;i++){
        switch(i >> 4){
            case 0: 
                    t = f_shortcut(f2, i & 15, i); // Use half byte
                    break;
            case 1:
                    t = f_shortcut(f3, (i*5 + 1) & 15, i);
                    break;
            case 2:
                    t = f_shortcut(f4, (i*3 + 5) & 15, i);
                    break;
            case 3:
                    t = f_shortcut(f5, (i*7) & 15, i);
                    break;
        }
        A = D, D = C, C = B, B = (rol(t,S,i) + B) | 0; 
    }

    return CorectBits([ A + encData[0],
                        B + encData[1],
                        C + encData[2],
                        D + encData[3]]);

}

function choseEncode(encBlock, serial){

    function encF2(num1, num2, num3) {
        return ((( num3 ^ num2) & num1) ^ num3);
    }
    
    function encF3 (num1, num2, num3) {
        return ((( num1 ^ num2) & num3) ^ num2);
    }
    
    function encF4(num1, num2, num3) {return (( num2 ^ num1) ^ num3); }
    
    function encF5(num1, num2, num3) {return (( num1 | ~num3) ^ num2); }

    function encF1(func, num1,num2, num3, key){
        return (func(num1,num2,num3) + key) | 0; // For bit alignment
    } 
    
    // Negative functions
    function encF1N(func, num1, num2, num3, key) { 
        return encF1(func,num1,num2, num3, -key);
    }
    function encF2N(num1, num2, num3){ return encF2(num1, num2, ~num3); }
    function encF4N(num1, num2, num3){ return encF4(num1, ~num2, num3); }
    function encF5N(num1, num2, num3){ return encF5(~num1, num2, num3); }
    
    /* Main part */
    var type = serial.substr(serial.length - 4, serial.length);
    if(type == 'D35B'){
        return blockEncode(encBlock, encF1, encF2, encF3, encF4, encF5);
    } else {
        return blockEncode(encBlock, encF1N, encF2N, encF3, encF4N, encF5N);
    }
}

function answerToString(b_arr){
    var r = b_arr[0] % 9;
    var ret_str = "";
    for(var i = 0;i<16;i++){
        if( ( r <= i) && (ret_str.length < 8) ){
            ret_str += scancods.charAt(encscans[b_arr[i] % encscans.length]);
        }
    }
    return ret_str;       
}

function encode(in_str, cnt, serial){
    in_str[cnt] = 0x80;
    var encBlock = StringToIntArr(in_str);
    encBlock = fill_zero(encBlock,6,16);
    encBlock[14] = (cnt << 3); 
    
    return IntArrToByteArr(choseEncode(encBlock, serial));

}

function dell_service_tag(serial){
    var serial_arr = StrintToArray(serial);
    serial_arr = serial_arr.concat(calc_suffix_tag(serial_arr));
    return answerToString(encode(serial_arr,23, serial));
}

function dell_service_hdd_new(serial){
    var serial_arr = StrintToArray(serial);
    serial_arr = serial_arr.concat(calc_suffix_hdd_new(serial_arr));
    return answerToString(encode(serial_arr,23, serial));
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
