
var sDescription = CreateHashTable([[SONY,"Old Sony"],
                    [SAMSUNG,"Samsung"],
                    [PHOENIX,"Generic Phoenix"],
                    [HP_COMPAQ,"HP/Compaq Phoenix BIOS"],
                    [FSI_PHOENIX,"Fujitsu-Siemens Phoenix"],
            [FSI_L_PHOENIX,"Fujitsu-Siemens (model L) Phoenix "],
            [FSI_P_PHOENIX,"Fujitsu-Siemens (model P) Phoenix "],
            [FSI_S_PHOENIX,"Fujitsu-Siemens (model S) Phoenix "],
            [FSI_X_PHOENIX,"Fujitsu-Siemens (model X) Phoenix "],
            [INSYDE,"InsydeH2O BIOS (Acer, HP)"],
            [HP_MINI,"HP/Compaq Mini Netbooks"],
            [FSI_20_DEC_NEW,"Fujitsu-Siemens new"],
            [FSI_20_DEC_OLD,"Fujitsu-Siemens old"],
            [FSI_HEX,"Fujitsu-Siemens"],
            [DELL_TAG,"Dell from serial number"],
            [DELL_HDD_OLD,"Dell from hdd serial number (old)"],
            [DELL_HDD_NEW,"Dell from hdd serial number (new)"]
            ]);


function converToTable(answ){
    var str ='<table class="answer_table">';
    for(var i=0; i<answ.length; i++){
        str += "<tr>";
        for(var j=0; j< answ[i].length; j++){
            str += '<td>' ;
            if(typeof(answ[i][j])=='object'){
                for(var k=0;k<answ[i][j].length;k++){
                    str += answ[i][j][k] + '<br />';
                }
            } else {
                str +=    answ[i][j] ;
            }
            str += '</td>' ;
        }
        str += "</tr>";
    }
    str += "</table>";
    return str;
}

function toArray(obj){
    var ret = [];
    for(var i in obj){
        ret.push([i,obj[i]]);
    }
    return ret;
}

function toDescription(arr){
    for(var i=0;i<arr.length;i++){
        arr[i][0] = sDescription[arr[i][0]];
    }
    return arr;
}

function enterPress(e){
    var keynum=0;
    if(e.which){
        keynum = e.which;
    }else if(window.event){
        keynum = e.keyCode ;
    }
    if(keynum == 13){
        if(e.preventDefault){
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        calcPass();
    }
}

function calcPass(){
    var serial =  document.getElementById('serial_id').value;
    var answ = toDescription(toArray(autoGetBiosPwd(serial)));
    var k = answ.length;
    var str = converToTable(answ) ;
    var th = document.getElementById('try_this');
    th.style.display = (k>0) ?  "" :"none";
    var an = document.getElementById("answer");
    var th2 = document.getElementById('dell_note');
    th2.style.display = (k>0) ?  "" :"none";
    an.innerHTML = str;
}
