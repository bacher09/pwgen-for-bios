/* May be need add 51,52 and 53 symbol  */
var keyboardDict = {  2: '1',  3: '2',  4: '3',  5: '4',  6: '5',  7: '6',  8: '7',  9: '8', 10: '9', 11: '0',
                 16: 'q', 17: 'w', 18: 'e', 19: 'r', 20: 't', 21: 'y', 22: 'u', 23: 'i', 24: 'o', 25: 'p',
                 30: 'a', 31: 's', 32: 'd', 33: 'f', 34: 'g', 35: 'h', 36: 'j', 37: 'k', 38: 'l', 
                 44: 'z', 45: 'x', 46: 'c', 47: 'v', 48: 'b', 49: 'n', 50: 'm' };

var SONY = 'sony';
var SAMSUNG = 'samsung';
var PHOENIX = 'phoenix';
var HP_COMPAQ = 'hp_compaq_phoenix';
var FSI_PHOENIX = 'fsi_phoenix';
var FSI_L_PHOENIX = 'fsi_l_phoenix';
var FSI_P_PHOENIX = 'fsi_p_phoenix';
var FSI_S_PHOENIX = 'fsi_s_phoenix';
var FSI_X_PHOENIX = 'fsi_x_phoenix';
var INSYDE = 'insyde';
var HP_MINI = 'hp_mini';
var FSI_20_DEC_NEW = 'fsi_20_dec_new';
var FSI_20_DEC_OLD = 'fsi_20_dec_old';
var FSI_HEX = 'fsi_hex';
var DELL_TAG = 'dell_tag';
var DELL_HDD_NEW = 'dell_hdd_new';
var DELL_HDD_OLD = 'dell_hdd_old';


var DELL_SERIES_PREFIX = ['595B','D35B','2A7B','A95B'];


var encscans = [0x05,0x10,0x13,0x09,0x32,0x03,0x25,0x11,0x1F,0x17,0x06,
                0x15,0x30,0x19,0x26,0x22,0x0A,0x02,0x2C,0x2F,0x16,0x14,0x07,
                0x18,0x24,0x23,0x31,0x20,0x1E,0x08,0x2D,0x21,0x04,0x0B,0x12,
                0x2E];


var chartabl2A7B = "012345679abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0";


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
/* Convert signed int to unsined like in C */
function SignedToUnsigned(num){
    return num >>> 0;
}

/* Keys function for hashArray for compability 
 * with browsers witch does't have keys function */
if(typeof(Object.keys) == 'undefined'){
    Object.keys =  function (hash){
        var mkeys = [];
        for(var i in hash) if (hash.hasOwnProperty(i)){
            mkeys.push(i);
        }
        return mkeys;
    };
}
var keys = Object.keys; 

/* values function for hashArray for compability 
 * with browsers witch does't have values function */
if(typeof(values) == 'undefined'){
    values =  function (hash){
        var mvalues = [];
        for(var i in hash) if (hash.hasOwnProperty(i)){
            mvalues.push(hash[i]);
        }
        return mvalues;
    };
}

Array.prototype.swap = function (x,y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
}

Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(this[i] in u){
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}

if(typeof(String.prototype.trim) === "undefined"){
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function min(x, y){
    if (x < y){
        return x;
    }  
    return y;
}

function CreateHashTable2(mkeys, mvalues){
    var k = min(mkeys.length, mvalues.length); 
    var hash = new Object();
    for(var i=0;i<k;i++){
        hash[mkeys[i]] = mvalues[i];
    }
    return hash;
}

function CreateHashTable3(arr){
    var hash = new Object();
    for(var i=0;i<arr.length;i++){
        hash[arr[i][0]] = arr[i][1];
    }
    return hash;
}

function CreateHashTable(a, b){
    return (typeof(b) =="undefined") ?  CreateHashTable3(a)
        : CreateHashTable2(a,b);
}

function ord(str){
    return str.charCodeAt(0);
}
function chr(ascii_code){
    return String.fromCharCode(ascii_code);
}


/* Integer divide */
function div(a, b){
    return a / b - a % b / b;
}


function copy_array(ar){
    var temp_arr = [];
    for(var i=0;i<ar.length;i++){
        temp_arr[i] = ar[i];
    }
    return temp_arr;
}

function StringToArray(str){
    var arr = [];
    if(typeof(str)=="object"){
        return str;
    }
    for(var i=0;i<str.length;i++){
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}

function ArrayToString(arr){
    var str = "";
    for(var i=0;i<arr.length;i++){
        str += chr(arr[i]);
    }
    return str;
}

function toByte(arr){
    for(var i=0;i<arr.length;i++){
        arr[i] = arr[i] & 0xFF;
    }
    return arr;
}


function isHexNumber(num_str) {
    return /[0-9ABCDEF]/gi.test(num_str);
}


function isDecNumber(num_str) {
    return /[0-9]/gi.test(num_str);
}

// rewrite it in functional style
function filterFalse(arr) {
    var res_arr = [];
    for(var i=0; i<arr.length; i++)
        if(arr[i]) res_arr.push(arr[i]);

    return res_arr;
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
                        ByteArrToIntArr(StringToArray(str));
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

/* Without zero */
var keyboardDictDigits = CreateHashTable(keys(keyboardDict).slice(0,9),
                                         values(keyboardDict).slice(0,9));

var keyboardDictChars = CreateHashTable(keys(keyboardDict).slice(10,36),
                                         values(keyboardDict).slice(10,36));

function keyToAscii(inKey){
    var out= "";
    for(var i=0;i<inKey.length;i++){
        if (inKey[i] == 0) return out;
        if(inKey[i] < 32 || inKey[i] > 127) return undefined;
        out += String.fromCharCode(inKey[i]);	
    }
    return out;
}
 
/* Decode Keyboard code to Ascii symbol */
function keyboardEncToAscii(inKey){
    var out= "";
    for(var i=0;i<inKey.length;i++){
        if (inKey[i] == 0) return out;
        if (inKey[i] in keyboardDict){
            out += keyboardDict[inKey[i]];
        } else {
            return ""
        }
    }
    return out
}



/* The phoenix implementation of the CRC-16 contains a rather severe bug
* quartering the image space of the function: both the first and second MSB
* are always zero regardless of the input.
* For a working implementation, you'd have to change the polynom from 0x2001
* to e.g. 0xA001.*/
function badCRC16(pwd, salt){
    salt = (typeof(salt) == 'undefined') ? 0 : salt;
    var hash = salt;
    var c = 0;
    for(var c=0;c < pwd.length;c++){
        hash ^= pwd[c] ;
        for(var i=8;i--;){
            if(hash & 1){
                hash = (hash >> 1) ^ 0x2001;
            } else {
                hash = (hash >> 1)
            }
        }
    }
    return hash;
}

function bruteForce(hash, salt, digitsOnly, charsOnly, minLen, maxLen){

    salt = (typeof(salt) == 'undefined') ? 0 : salt;
    digitsOnly = (typeof(digitsOnly) == 'undefined') ? false: digitsOnly;
    charsOnly = (typeof(charsOnly) == 'undefined') ? true : charsOnly;
    minLen = (typeof(minLen) == 'undefined') ? 3 : minLen;
    maxLen = (typeof(maxLen) == 'undefined') ? 7 : maxLen;
    
    var encodedPwd = [0,0,0,0,0,0,0];

    if(hash > 0x3FFF){
        return "Bad hash";
    }
    var kk = 0;
    if(charsOnly==true){
        var my_keyboard_dict = keyboardDictChars;
    } else if(digitsOnly==true){
        var my_keyboard_dict = keyboardDictDigits;
    } else {
        var my_keyboard_dict = keyboardDict;
    }
    var my_keyboard_dict_keys = keys(my_keyboard_dict);
    var my_keyboard_dict_len = my_keyboard_dict_keys.length;

    while(true){
        var rndVal = Math.random()*my_keyboard_dict_len;       
        for(var i=0; i<7; i++){
            var value = Math.floor(rndVal % my_keyboard_dict_len);
            encodedPwd[i]= my_keyboard_dict_keys[value];
            rndVal *= 7;
        }
        kk++;
        if(kk > 50000){
            return "No";
        }
        for(var i=minLen;i<=maxLen; i++){
            if( badCRC16(encodedPwd.slice(0,i),salt) == hash){
                encodedPwd = encodedPwd.slice(0,i);
                return keyboardEncToAscii(encodedPwd);
            }
        }
    }
}



        
function calc_in(l_arr){
    return [ (l_arr[1] >> 1),
             ((l_arr[1] >> 6) | (l_arr[0] << 2)), 
             (l_arr[0] >> 3) ];
}

function begin_calc(serial, s_arr){
    var ret_arr = [];
    if(typeof(serial)=="string"){
        serial = StringToArray(serial);
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

function end_calc(serial, calced_arr, s_arr, table){
    var r = 0;
    var ret_arr = [];
    for (var i=0;i<8;i++) {
        r = 0xAA;
        (calced_arr[i] & 1) && (r ^= serial[ s_arr[0] ]);
        (calced_arr[i] & 2) && (r ^= serial[ s_arr[1] ]);
        (calced_arr[i] & 4) && ( r ^= serial[ s_arr[2] ]);
        (calced_arr[i] & 8) && (r ^= serial[1]);
        (calced_arr[i] & 16) && (r ^= serial[0]);
        
        ret_arr[i] = table[r % table.length];
    }
    return ret_arr;
}

function calc_suffix_shortcut(serial, s_arr1, s_arr2){
    var serial_arr = StringToArray(serial);
    var ret_arr = begin_calc(serial_arr,s_arr1);
    if(dell_get_serial_line(serial) == '2A7B'){
        return end_calc(serial_arr,ret_arr,s_arr2,StringToArray(chartabl2A7B)); 
    } 
    return end_calc(serial_arr, ret_arr, s_arr2, encscans); 
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
    var serial_arr = StringToArray(serial);
    ret_arr = ret_arr.concat(calc_in(serial_arr));
    // lower bits then 5 are never change
    for(var i=5;i<8;i++){
        var r = 0xAA;
        (ret_arr[i] & 8) && (r ^= serial_arr[1]);
        (ret_arr[i] & 16) && (r ^= serial_arr[0]);
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

function dell_get_serial_line(serial){
    if(typeof(serial) == 'object'){
        return ArrayToString(serial.slice(serial.length - 4,
                            serial.length)).toUpperCase();
    }
    return serial.substr(serial.length - 4, serial.length).toUpperCase();
}

function dell_get_serial_main(serial){
    return serial.substr(0,serial.length - 4);
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
    var type = dell_get_serial_line(serial);
    if(type == 'D35B'){
        return blockEncode(encBlock, encF1, encF2, encF3, encF4, encF5);
    } else {
        return blockEncode(encBlock, encF1N, encF2N, encF3, encF4N, encF5N);
    }
}

function answerToString(b_arr, serial){
    var r = b_arr[0] % 9;
    var ret_str = "";
    for(var i = 0;i<16;i++){
        if(dell_get_serial_line(serial) == "2A7B"){
            ret_str += chartabl2A7B.charAt( b_arr[i] % chartabl2A7B.length);
        } else if( ( r <= i) && (ret_str.length < 8) ){
            ret_str += scancods.charAt(encscans[b_arr[i] % encscans.length]);
        }
    }
    return ret_str;       
}

function dell_encode(in_str, cnt, serial){
    in_str[cnt] = 0x80;
    var encBlock = StringToIntArr(in_str);
    encBlock = fill_zero(encBlock,6,16);
    encBlock[14] = (cnt << 3); 
    
    return IntArrToByteArr(choseEncode(encBlock, serial));

}

/* 7 symbols + 4 symbols ( 595B, D35B, 2A7B, A95B ) */
function getBiosPwdForDellTag(serial){
    if(dell_get_serial_line(serial) == 'A95B'){ // A95B
        serial = dell_get_serial_main(serial) + '595B';
    }
    var serial_arr = StringToArray(serial);
    serial_arr = serial_arr.concat(calc_suffix_tag(serial_arr));
    return answerToString(dell_encode(serial_arr,23, serial), serial);
}

/* 12 symbols + 4 symbols ( 595B, D35B, 2A7B, A95B ) */
function getBiosPwdForDellHddNew(serial){
    if(dell_get_serial_line(serial) == 'A95B'){ // A95B
        var zero_chars = chr(0) + chr(0) + chr(0);
        serial = serial.slice(3,serial.length - 4) + zero_chars + '595B';
    }
    var serial_arr = StringToArray(serial);
    serial_arr = serial_arr.concat(calc_suffix_hdd_new(serial_arr));
    return answerToString(dell_encode(serial_arr,23, serial), serial);
}

/* Depends only in first two chars
 *  12 symbols                      */
function getBiosPwdForDellHddOld(serial){
    var t_arr = calc_suffix_hdd_old(serial);
    var ret_str = "";
    for(var i=0;i<t_arr.length;i++){
        ret_str += scancods.charAt( t_arr[i]);
    }
    return ret_str;
}

/* Return password for old sony laptops
 * password 7 digit number like 1234567 */
function getBiosPwdForSony(serial){
    if(serial.length != 7){
        return ""
    }
	var table = "0987654321876543210976543210982109876543109876543221098765436543210987";
	var pos = 0;
    var code= "";
    for(var i=0;i<serial.length;i++){
		code += table.charAt(parseInt(serial.charAt(i), 10)+10*pos);
		pos++;
    }
    return code;
}

/* Return password for samsung laptops
 *  12 or 18 hexhecimal digits like 07088120410C0000 */
function getBiosPwdForSamsung(serial){

    var rotationMatrix1 = [7, 1, 5, 3, 0, 6, 2, 5, 2, 3, 0, 6, 1, 7, 6, 1, 5, 2, 7, 1, 0, 3, 7, 6, 1, 0, 5, 2, 1, 5, 7, 3, 2, 0, 6];

    var rotationMatrix2 = [1, 6, 2, 5, 7, 3, 0, 7, 1, 6, 2, 5, 0, 3, 0, 6, 5, 1, 1, 7, 2, 5, 2, 3, 7, 6, 2, 1, 3, 7, 6, 5, 0, 1, 7];


    function decryptHash(hash, key, rotationMatrix){
	    var outhash = [];
        for(var i=0;i<hash.length;i++){
            outhash.push(((hash[i] << (rotationMatrix[7*key+i])) & 0xFF) | (hash[i] >> (8-rotationMatrix[7*key+i])));
        }
        return outhash;
    }

    var hash = [];

    for(var i=1;i<div(serial.length,2);i++){
	    hash.push(parseInt(serial.charAt(2*i)+serial.charAt(2*i+1),16))
    }
    var key = parseInt(serial.substring(0,2), 16) % 5

    var scanCodePassword = keyboardEncToAscii(decryptHash(hash, key, rotationMatrix1))
    if(scanCodePassword == ""){
	    scanCodePassword = keyboardEncToAscii(decryptHash(hash, key, rotationMatrix2))
    }

    var asciiPassword1 = keyToAscii(decryptHash(hash, key, rotationMatrix1));
    var asciiPassword2 = keyToAscii(decryptHash(hash, key, rotationMatrix2));

    return filterFalse([scanCodePassword, asciiPassword1, asciiPassword2]);
}

/* Compute password for phoenix bios. 5 digits */
function getBiosPwdForGenericPhoenix(serial){
    return bruteForce(parseInt(serial,10));
}

/* Compute password for phoenix bios HP/Compaq.5 digits */
function getBiosPwdForHPCompaqPhoenix(serial){
    return bruteForce(parseInt(serial,10),17232);
}

/* Compute password for FSI phoenix bios.  5 digits */
function getBiosPwdForFsiPhoenix(serial){
    return bruteForce(parseInt(serial,10),65,true,false,3,7);
}

/* Compute password for FSI (L model) phoenix bios. 5 digits */
function getBiosPwdForFsiLPhoenix(serial){
    return bruteForce(parseInt(serial,10)+1,ord('L'),true,false,3,7);
}

/* Compute password for FSI (P model) phoenix bios. 5 digits */
function getBiosPwdForFsiPPhoenix(serial){
    return bruteForce(parseInt(serial,10)+1,ord('P'),true,false,3,7);
}

/* Compute password for FSI (S model) phoenix bios. 5 digits */
function getBiosPwdForFsiSPhoenix(serial){
    return bruteForce(parseInt(serial,10)+1,ord('S'),true,false,3,7);
}

/* Compute password for FSI (X model) phoenix bios. 5 digits */
function getBiosPwdForFsiXPhoenix(serial){
    return bruteForce(parseInt(serial,10)+1,ord('X'),true,false,3,7);
}

/* Maybe need fixing for browsers where numbers is 32-bits */
/* Some Acer, HP  laptops. 8 digit */
function getBiosPwdForInsyde(serial){
    var salt = 'Iou|hj&Z';
    var password = '';
    var b = 0;
    var a =0;
    for(var i=0;i<8;i++){
        b = ord(salt.charAt(i)) ^ ord(serial.charAt(i));
        a = b;
        //a = (a * 0x66666667) >> 32;
        a = (a * 0x66666667);
        a = Math.floor(a  / Math.pow(2,32));
        a = (a >> 2) | (a & 0xC0);
        if ( a & 0x80000000 ){
            a++;
        }
        a *= 10;
        password += (b-a).toString();
    }
    return password
}
/* For HP/Compaq Netbooks. 10 chars */
function getBiosPwdForHpmini(serial){
    var table1 = {'1': '3', '0': '1', '3': 'F', '2': '7', '5': 'Q', '4': 'V',
                  '7': 'X', '6': 'G', '9': 'O', '8': 'U', 'a': 'C', 'c': 'E',
                  'b': 'P', 'e': 'M', 'd': 'T', 'g': 'H', 'f': '8', 'i': 'Y',
                  'h': 'Z', 'k': 'S', 'j': 'W', 'm': '4', 'l': 'K', 'o': 'J',
                  'n': '9', 'q': '5', 'p': '2', 's': 'N', 'r': 'B', 'u': 'L',
                  't': 'A', 'w': 'D', 'v': '6', 'y': 'I', 'x': '4', 'z': '0'
                  };
    
    var table2 = {'1': '3', '0': '1', '3': 'F', '2': '7', '5': 'Q', '4': 'V',
                  '7': 'X', '6': 'G', '9': 'O', '8': 'U', 'a': 'C', 'c': 'E',
                  'b': 'P', 'e': 'M', 'd': 'T', 'g': 'H', 'f': '8', 'i': 'Y',
                  'h': 'Z', 'k': 'S', 'j': 'W', 'm': '4', 'l': 'K', 'o': 'J',
                  'n': '9', 'q': '5', 'p': '2', 's': 'N', 'r': 'B', 'u': 'L',
                  't': 'A', 'w': 'D', 'v': '6', 'y': 'I', 'x': 'R', 'z': '0'
                  };
    
    var password1 = "";
    var password2 = "";
    serial = serial.toLowerCase();
    for(var i=0;i<serial.length;i++){
        password1 += table1[serial.charAt(i)]
        password2 += table2[serial.charAt(i)]
    }
    if(password1 == password2){
        return password1.toLowerCase();
    } else {
        return [password1.toLowerCase(), password2.toLowerCase()];
    }
}

/* For Fujinsu-Siemens. 5x4 dicimal digits */
function getBiosPwdForFsi20dec_old(serial){

    function byteToChar(symbol_byte){
        if(symbol_byte > 9 ){
            return chr(ord('a') + symbol_byte - 10);
        } else {
            return chr(ord('0') + symbol_byte);
        }
    }

    function bytesToString(bytes){
        var str= "";
        for(var i=0;i<bytes.length;i++){
            str += byteToChar(bytes[i]);
        }
        return str;
    }

    function codeToBytes(code){
        var numbers = [parseInt(code.slice(0,5), 10), 
                       parseInt(code.slice(5,10), 10), 
                       parseInt(code.slice(10,15), 10),
                       parseInt(code.slice(15,20), 10)
                      ];
        var bytes = [];
        for(var i=0;i<numbers.length;i++){
            bytes.push(numbers[i] % 256);
            bytes.push(Math.floor(numbers[i] / 256));
        }
        return bytes;
    }
    
/* op_arr - array with that operations do, ar1,ar2 - numbers */
    function interleave(op_arr,ar1, ar2 ){
        var arr = copy_array(op_arr);
        arr[ ar1[0]] = ((op_arr[ar2[0]] >> 4) | (op_arr[ar2[3]] << 4)) & 0xFF;
        arr[ ar1[1]] = ((op_arr[ar2[0]] & 0x0F) | (op_arr[ar2[3]] & 0xF0));
        arr[ ar1[2]] = ((op_arr[ar2[1]] >> 4) | (op_arr[ar2[2]] << 4) & 0xFF);
        arr[ ar1[3]] = (op_arr[ar2[1]] & 0x0F) | (op_arr[ar2[2]] & 0xF0);
        return arr;
    }

    function convert_to_remainder(arr){
        var temp_arr = [];
        for(var i=0;i<arr.length;i++){
            temp_arr[i] = arr[i] % 36;
        }
        return temp_arr;
    }

    function decryptCode_old(bytes){
        var XORkey = ":3-v@e4i";
        // apply XOR key
        for(var i=0;i<bytes.length;i++){
            bytes[i] = bytes[i] ^ ord(XORkey.charAt(i));
        }
    
        // swap two bytes
        bytes.swap(2,6);
        bytes.swap(3,7);
        
        bytes = interleave(bytes, [0,1,2,3],[0,1,2,3]);
        bytes = interleave(bytes, [4,5,6,7],[6,7,4,5]);
    
        // final rotations
        bytes[0] = ((bytes[0] << 3) & 0xFF) | (bytes[0] >> 5);
    	bytes[1] = ((bytes[1] << 5) & 0xFF) | (bytes[1] >> 3);
    	bytes[2] = ((bytes[2] << 7) & 0xFF) | (bytes[2] >> 1);
    	bytes[3] = ((bytes[3] << 4) & 0xFF) | (bytes[3] >> 4);
    	bytes[5] = ((bytes[5] << 6) & 0xFF) | (bytes[5] >> 2);
    	bytes[6] = ((bytes[6] << 1) & 0xFF) | (bytes[6] >> 7);
    	bytes[7] = ((bytes[7] << 2) & 0xFF) | (bytes[7] >> 6);
    
        // len(solution space) = 10 + 26
        bytes = convert_to_remainder(bytes);
    
        return bytesToString(bytes);
    }

    return decryptCode_old(codeToBytes(serial));
}

/* For Fujinsu-Siemens. 5x4 dicimal digits. new */
function getBiosPwdForFSI20dec_new(serial){
    var f_keys = ["4798156302", "7201593846", "5412367098", "6587249310", 
            "9137605284", "3974018625", "8052974163"];

    var pwdHash = serial.charAt(0) + serial.charAt(2) + serial.charAt(5) +
                  serial.charAt(11) + serial.charAt(13) + serial.charAt(15) +
                  serial.charAt(16);

    var masterPwd = "";
    var i = 0;
    for(var j=0;j<pwdHash.length;j++){
        masterPwd += f_keys[i].charAt(parseInt(pwdHash.charAt(j), 10));
        i++;
    }
    return masterPwd
}

/* For Fujinsu-Siemens. 5x4 dicimal digits. */
function getBiosPwdForFSI20dec(serial){

    return CreateHashTable([FSI_20_DEC_NEW,FSI_20_DEC_OLD],
        [getBiosPwdForFSI20dec_new(serial),getBiosPwdForFsi20dec_old(serial)]);
               
}

/* For Fujinsu-Siemens. 8 or 5x4 hexadecimal digits. */
function getBiosPwdForFSIhex(serial){

    function generateCRC16Table(){
        var table = [];
        var crc = 0;
        for(var i=0;i<256;i++){
            crc = (i << 8);
            for(var j=0;j<8;j++){
                // Maybe so are batter
                crc = (crc << 1);
                if(crc & 0x10000){
                    crc = crc ^ 0x1021;
                } 
            }
            table.push(crc & 0xFFFF);
        }
        return table;
    }

    function hashToChar(hash,code, num){
        return chr(code + ((hash >> num) % 16) % 10);
    }
    
    function hashToString(hash){
        var a = ord('0')
        return (hashToChar(hash, a, 12) + 
                hashToChar(hash, a, 8)  +
                hashToChar(hash, a, 4)  +
                hashToChar(hash, a, 0)  );
    }
    
    function calculateHash(word, table){
        var hash = 0;
        var d =0;
        for(var i=0;i<word.length;i++){
            d = table[ (ord(word.charAt(i)) ^ (hash >> 8)) % 256 ];
            hash = ((hash << 8) ^ d) & 0xFFFF ;
        }
        return hash
    }
    
    function decryptCode(code){
        var table = generateCRC16Table();
        return (hashToString(calculateHash(code.slice(0,4), table)) +
               hashToString(calculateHash(code.slice(4,8), table)));
    
    }
    if (serial.length == 20){
        serial = serial.slice(12,20);
    }
    return decryptCode(serial);
}

function has_element(element, arr){
    for(var i=0;i<arr.length;i++){
        if(arr[i] == element){
            return true;
        }
    }
    return false;
}

/* Return true of false (valid format and not) */
function numberChecker(serial, len_arr, decimal, hexdecimal){
    decimal = (typeof(decimal) == 'undefined') ? true : decimal;
    hexdecimal = (typeof(decimal) == 'undefined') ? false : hexdecimal;
    var valid = false,
        code_len = serial.length;

    if(decimal)
        valid = isDecNumber(serial);
    else if (hexdecimal)
        valid = isHexNumber(serial);
    else
        return false;

    return ((valid == true) && has_element(code_len, len_arr)) ? true : false;
}

function dellChecker(serial, len_arr, series_arr){
    series_arr = (typeof(series_arr) == 'undefine') ? false : series_arr;
    if(has_element(serial.length, len_arr)){
        if(!series_arr) {
            return true;
        }
        
        for(var i=0;i<series_arr.length;i++){
            if(dell_get_serial_line(serial) == series_arr[i]){
                return true;
            }
        }
    }
    return false;
}


/* Just shortcut */
function autoCheckAndRun(serial, run_func, len_arr, decimal, hexdecimal){
    if(numberChecker(serial, len_arr,decimal,hexdecimal)){
        return run_func(serial);
    } else {
        return false;
    }
}

/* Just shortcut */
function autoCheckAndRunWithKey(serial, run_func,
                                key, len_arr,
                                decimal, hexdecimal){

    var res = autoCheckAndRun(serial, run_func, len_arr, decimal, hexdecimal);
    if(res != false){
        var r_ob = new Object();
        r_ob[key]= res;
        return r_ob;
    } else {
        return false;
    }
}

function dell_serial_normalize(serial){
        return dell_get_serial_main(serial) + dell_get_serial_line(serial);
}

/* Just shortcut */
function dellCheckAndRunWithKey(serial, run_func, key, len_arr, series){
    if(dellChecker(serial, len_arr, series)){
        var r_ob = new Object();
        r_ob[key] = run_func(dell_serial_normalize(serial));
        return r_ob;
    } else {
        return false;
    }
}

/* Auto function return password if serial is valid,
 * or false if it is bad */
function autoGetBiosPwdForSony(serial){
    return autoCheckAndRunWithKey(serial, getBiosPwdForSony,SONY,
                                  [7], true,false);
}


function autoGetBiosPwdForSamsung(serial){
    return autoCheckAndRunWithKey(serial, getBiosPwdForSamsung,SAMSUNG,
                                  [12,16,18],false,true);
}

/* Maybe create one function for Phoenix  */
function autoGetBiosPwdForAllPhoenix(serial){
    if(numberChecker(serial,[5],true)){
        return CreateHashTable( [PHOENIX, HP_COMPAQ, FSI_PHOENIX,
                                FSI_L_PHOENIX,FSI_P_PHOENIX,FSI_S_PHOENIX,
                                FSI_X_PHOENIX
                                ],
                            [getBiosPwdForGenericPhoenix(serial),
                             getBiosPwdForHPCompaqPhoenix(serial),
                             getBiosPwdForFsiPhoenix(serial),
                             getBiosPwdForFsiLPhoenix(serial),
                             getBiosPwdForFsiPPhoenix(serial),
                             getBiosPwdForFsiSPhoenix(serial),
                             getBiosPwdForFsiXPhoenix(serial)
                             ]);
    } else {
        return false;
    }
}

function autoGetBiosPwdForInsyde(serial){
    return autoCheckAndRunWithKey(serial, getBiosPwdForInsyde,INSYDE,
                                 [8], true);
}

function autoGetBiosPwdForHpmini(serial){
    if(serial.length == 10){
        return CreateHashTable([HP_MINI], [getBiosPwdForHpmini(serial)]);
    } else {
        return false;
    }
}

function autoGetBiosPwdForFSI20dec(serial){
    return autoCheckAndRun(serial, getBiosPwdForFSI20dec, [20], true);
}

function autoGetBiosPwdForFSIhex(serial){
    return autoCheckAndRunWithKey(serial, getBiosPwdForFSIhex, FSI_HEX,
                                  [8,20], false, true);
}

function autoGetBiosPwdForDellHddOld(serial){
    return dellCheckAndRunWithKey(serial, getBiosPwdForDellHddOld, 
                                DELL_HDD_OLD, [11], false);
}

/* 7 symbols + 4 symbols ( 595B, D35B, 2A7B, A95B ) */
function autoGetBiosPwdForDellTag(serial){
    return dellCheckAndRunWithKey(serial, getBiosPwdForDellTag, 
                                DELL_TAG, [11],DELL_SERIES_PREFIX);
}


function metaDellManyTag(serial, len, key, func){
    if(serial.length == len){
        var answ_arr = []; 
        for(var i=0;i<DELL_SERIES_PREFIX.length;i++){
            answ_arr[i] = func(serial + DELL_SERIES_PREFIX[i]);
        }
        if(answ_arr.length == 0){
            return false;
        }
        var r_ob = new Object();
        r_ob[key] = answ_arr.getUnique();
        return r_ob;
    } else {
        return false;
    }
}


/* 11 symbols + 4 symbols ( 595B, D35B, 2A7B, A95B ) */
function autoGetBiosPwdForDellHddNew(serial){
    return dellCheckAndRunWithKey(serial, getBiosPwdForDellHddNew, 
                                DELL_HDD_NEW, [15],DELL_SERIES_PREFIX);
}

// 7 symbols
function autoGetBiosPwdForDellTagAll(serial){
    return metaDellManyTag(serial, 7, DELL_TAG, getBiosPwdForDellTag);
}

// 11 symbols
function autoGetBiosPwdForDellHddNewAll(serial){
    return metaDellManyTag(serial,11,DELL_HDD_NEW,getBiosPwdForDellHddNew);
}

var arr_of_bios_pwgen_fun = [autoGetBiosPwdForSony,
                             autoGetBiosPwdForSamsung,
                             autoGetBiosPwdForAllPhoenix,
                             autoGetBiosPwdForInsyde,
                             autoGetBiosPwdForHpmini,
                             autoGetBiosPwdForFSI20dec,
                             autoGetBiosPwdForFSIhex,
                             autoGetBiosPwdForDellHddOld,
                             autoGetBiosPwdForDellTag,
                             autoGetBiosPwdForDellHddNew,
                             autoGetBiosPwdForDellTagAll,
                             autoGetBiosPwdForDellHddNewAll
                            ];

function autoGetBiosPwd(serial){
    var temp = "";
    var ret_arr = new Object();
    serial = serial.trim().replace(/-/gi,'');
    for(var i=0;i< arr_of_bios_pwgen_fun.length; i++){
        temp = arr_of_bios_pwgen_fun[i](serial);
        if(temp != false){
            for(var c in temp){
                ret_arr[c] = temp[c];
            }
        }
    }
    return ret_arr;
}
