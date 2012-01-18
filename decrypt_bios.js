/* May be need add 51,52 and 53 symbol  */
var keyboardDict = {  2: '1',  3: '2',  4: '3',  5: '4',  6: '5',  7: '6',  8: '7',  9: '8', 10: '9', 11: '0',
                 16: 'q', 17: 'w', 18: 'e', 19: 'r', 20: 't', 21: 'y', 22: 'u', 23: 'i', 24: 'o', 25: 'p',
                 30: 'a', 31: 's', 32: 'd', 33: 'f', 34: 'g', 35: 'h', 36: 'j', 37: 'k', 38: 'l', 
                 44: 'z', 45: 'x', 46: 'c', 47: 'v', 48: 'b', 49: 'n', 50: 'm' };

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

function min(x, y){
    if (x < y){
        return x;
    }  
    return y;
}

function CreateHashTable(mkeys, mvalues){
    var k = min(mkeys.length, mvalues.length); 
    var hash = new Object();
    for(var i=0;i<k;i++){
        hash[mkeys[i]] = mvalues[i];
    }
    return hash;
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


/* Without zero */
var keyboardDictDigits = CreateHashTable(keys(keyboardDict).slice(0,9),
                                         values(keyboardDict).slice(0,9));

var keyboardDictChars = CreateHashTable(keys(keyboardDict).slice(10,36),
                                         values(keyboardDict).slice(10,36));


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
    for(c in pwd){
        hash ^= pwd[c] ;
        for(var i=0;i<8;i++){
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
    var my_keyboard_dict_len = keys(my_keyboard_dict).length;

    while(true){
        var rndVal = Math.random()*my_keyboard_dict_len;       
        for(var i=0; i<7; i++){
            var value = Math.floor(rndVal % my_keyboard_dict_len);
            encodedPwd[i]= keys(my_keyboard_dict)[value];
            rndVal *= 7;
        }
        kk++;
        if(kk > 60000){
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
		code += table.charAt(parseInt(serial.charAt(i))+10*pos);
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

    var password = keyboardEncToAscii(decryptHash(hash, key, rotationMatrix1))
    if(password == ""){
	    password = keyboardEncToAscii(decryptHash(hash, key, rotationMatrix2))
    }

    return password
}

/* Compute password for phoenix bios. 5 digits */
function getBiosPwdForGenericPhoenix(serial){
    return bruteForce(parseInt(serial));
}

/* Compute password for phoenix bios HP/Compaq.5 digits */
function getBiosPwdForHPCompaqPhoenix(serial){
    return bruteForce(parseInt(serial),17232);
}

/* Compute password for FSI phoenix bios.  5 digits */
function getBiosPwdForFsiPhoenix(serial){
    return bruteForce(parseInt(serial),65,true,false,3,7);
}

/* Compute password for FSI (L model) phoenix bios. 5 digits */
function getBiosPwdForFsiLPhoenix(serial){
    return bruteForce(parseInt(serial)+1,ord('L'),true,false,3,7);
}

/* Compute password for FSI (P model) phoenix bios. 5 digits */
function getBiosPwdForFsiPPhoenix(serial){
    return bruteForce(parseInt(serial)+1,ord('P'),true,false,3,7);
}

/* Compute password for FSI (S model) phoenix bios. 5 digits */
function getBiosPwdForFsiSPhoenix(serial){
    return bruteForce(parseInt(serial)+1,ord('S'),true,false,3,7);
}

/* Compute password for FSI (X model) phoenix bios. 5 digits */
function getBiosPwdForFsiXPhoenix(serial){
    return bruteForce(parseInt(serial)+1,ord('X'),true,false,3,7);
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
    for(var i=0;i<serial.length;i++){
        password1 += table1[serial.charAt(i).toLowerCase()]
        password2 += table2[serial.charAt(i).toLowerCase()]
    }
    if(password1 == password2){
        return password1.toLowerCase();
    } else {
        return password1.toLowerCase() + " OR " + password2.toLowerCase();
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
        var numbers = [parseInt(code.slice(0,5)), 
                       parseInt(code.slice(5,10)), 
                       parseInt(code.slice(10,15)),
                       parseInt(code.slice(15,20))
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
        masterPwd += f_keys[i].charAt(parseInt(pwdHash.charAt(j)));
        i++;
    }
    return masterPwd
}

/* For Fujinsu-Siemens. 5x4 dicimal digits. */
function getBiosPwdForFSI20dec(serial){

    return getBiosPwdForFSI20dec_new(serial) + " OR "+ 
           getBiosPwdForFsi20dec_old(serial);
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
    var i =0;
    if(decimal){
        var code = parseInt(serial,10);
        var code_len = code.toString(10).length;
    } else if (hexdecimal){
        var code = parseInt(serial,16);
        var code_len = code.toString(16).length;
    } else {
        return false;
    }
    while(serial.charAt(i++)=='0'){
        code_len++;
    }

    if((code != NaN) && has_element(code_len, len_arr)){
        return true;
    } else {
        return false;
    }
}
/* Just shortcut */
function autoCheckAndRun(serial, run_func, len_arr, decimal, hexdecimal){
    if(numberChecker(serial, len_arr,decimal,hexdecimal)){
        return run_func(serial);
    } else {
        return false;
    }
}

/* Auto function return password if serial is valid,
 * or false if it is bad */
function autoGetBiosPwdForSony(serial){
    return autoCheckAndRun(serial, getBiosPwdForSony, [7], true,false);
}


function autoGetBiosPwdForSamsung(serial){
    return autoCheckAndRun(serial, getBiosPwdForSamsung, [12,16,18],false,true);
}

/* Maybe create one function for Phoenix  */
function autoGetBiosPwdForGenericPhoenix(serial){
    return autoCheckAndRun(serial, getBiosPwdForGenericPhoenix, [5], true);
}

function autoGetBiosPwdForInsyde(serial){
    return autoCheckAndRun(serial, getBiosPwdForInsyde, [8], true);
}

function autoGetBiosPwdForHpmini(serial){
    if(serial.length == 10){
        return getBiosPwdForHpmini(serial);
    } else {
        return false;
    }
}

function autoGetBiosPwdForFSI20dec(serial){
    return autoCheckAndRun(serial, getBiosPwdForFSI20dec, [20], true);
}

function autoGetBiosPwdForFSIhex(serial){
    return autoCheckAndRun(serial, getBiosPwdForFSIhex, [8,20], false, true);
}
