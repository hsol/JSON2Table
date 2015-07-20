/**
 * Created by Hsol on 2015-07-20.
 */
function JSON2Table(id, data, dataType, attr){
    switch(dataType){
        case 'url':
            tInterface.insertTable(id, tInterface.makeTable(tFunction.get.json(data), attr.id, attr.classList));
            break;
        case 'json':
        default:
            tInterface.insertTable(id, tInterface.makeTable(data, attr.id, attr.classList));
            break;
    }
}

tFunction = {
    get : {
        keys : function(object){
            /**
             * JSON 형태의 object 의 key 값을 배열로 반환한다.
             * @method get.keys
             * @param {object} object (key 값을 얻어 낼 JSON 형태의 object)
             * @returns {object}
             */

            if((typeof object) == 'object'){
                var keys = [];
                for(var k in object) keys.push(k);
                return keys;
            }
            else if((typeof object) == 'string'){
                try{
                    object = JSON.parse(object);
                    return tFunction.get.keys(object);
                }
                catch(error){
                    console.error("[tFunction.get.keys] " + error.message);
                }
            }
            else{
                console.error("[tFunction.get.keys] please insert data typeof 'object' or 'JSON'");
            }
        },
        json : function(url){
            /**
             * jQuery 의 $.getJSON 구현, 해당하는 url 에서 JSON 타입 response 를 읽어 JSON object 로 반환한다.
             * @method get.json
             * @param {String} url (호출할 api url)
             * @returns {object}
             */

            var object = null;
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', url, true);
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    object = JSON.parse(xmlHttp.responseText);
                }
                return object;
            };
            xmlHttp.send(null);
        }
    },
    set : {
        table : function(dataSet){
            /**
             * JSON object 형태로 받은 dataSet 을 table element 와 유사한 형태로 '보기좋게' 만들어준다.
             * @method set.table
             * @param {object} dataSet (형태를 변환 할 JSON 형태의 object)
             * @returns {object}
             */

            var table = {
                thead : {
                    tr : []
                },
                tbody : {
                    tr : []
                }
            };

            table.thead.tr = tFunction.get.keys(dataSet[0]);
            for(var i in dataSet){
                table.tbody.tr[i] = Object.keys(dataSet[i]).map(function (key) {return dataSet[i][key]});
            };

            return table;
        }
    }
};

tInterface = {
    makeTable : function(dataSet, id, classList, isHead){
        /**
         * JSON 형태로 받은 dataSet 을 table element 로 만들어준다.
         * @class makeTable
         * @constructor
         * @type html table element
         * @param {boolean} isHead (head 출력여부 false:출력 true:출력하지않음)
         * @param {object} dataSet (json 형태로 이루어진 데이터셋, not null)
         * @param {String} id (table 에 부여될 id attribute)
         * @param {object, String} classList (table 에 부여될 class attribute)
         * @returns {element}
         */

        var index = 0, tr = null, th = null, td = null;
        var tableData = tFunction.set.table(dataSet);
        var table = document.createElement("TABLE");
        var tableHead = table.createTHead().insertRow(0);
        var tableBody = table.appendChild(document.createElement("TBODY"));

        if(!isHead || isHead == undefined) {
            for (index in tableData.thead.tr) {
                th = document.createElement("TH");
                th.innerHTML = tableData.thead.tr[index];
                tableHead.appendChild(th);
            }
        }

        for(index in tableData.tbody.tr){
            tr = tableBody.insertRow(index);
            for(var idx in tableData.tbody.tr[index]){
                td = tr.insertCell(idx);
                td.innerHTML = tableData.tbody.tr[index][idx];
            }
        }

        if(id != undefined && id != '' && typeof id == 'string')
            table.setAttribute('id', id);
        else if(typeof id == 'object')
            classList = id;

        if(classList != undefined){
            if(typeof classList == 'object') {
                for (index in classList) {
                    if (table.className != "") {
                        table.className += " ";
                    }
                    table.className += classList[index];
                }
            }
            else
                table.className += classList;
        }

        return table;
    },
    insertTable : function(id, table){
        if(id != undefined) {
            if(document.getElementById(id) != null) {
                var placeOfElement = document.getElementById(id);
                document.body.insertBefore(table, placeOfElement);
                placeOfElement.remove();
            }
            else{
                console.error("[tInterface.insertTable] can't find id in document");
            }
        }
        else{
            console.error("[tInterface.insertTable] please insert parameter 'id'");
        }
    }
};