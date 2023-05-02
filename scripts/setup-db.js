//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var db;
var request = window.indexedDB.open("recordsDB", 1);

request.onerror = function(event) {
    console.log("error: ");
};

request.onsuccess = function(event) {
    db = request.result;
    console.log("success: "+ db);
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("records", {keyPath: "id", autoIncrement:true});

}

function add(data) {
    var request = window.indexedDB.open("recordsDB", 1);
    request.onsuccess = function(event) {
        // Use this db variable, not your global one
        var db = event.target.result;
        transaction = db.transaction(["records"], "readwrite")
        .objectStore("records")
        var request = transaction.add(data);
        
        request.onsuccess = function(event) {
        alert("data has been added to your database.");
        };
        
        request.onerror = function(event) {
        alert("Unable to add data");
        }
    }
 }
 
 function remove(id) {
    var request = db.transaction(["records"], "readwrite")
    .objectStore("records")
    .delete(id);
    
    request.onsuccess = function(event) {
       alert("entry has been removed from your database.");
    };
 }

function countObjects(){
    return new Promise (function(resolve) {
        var request = window.indexedDB.open("recordsDB", 1);
        request.onsuccess = function(event) {
            // Use this db variable, not your global one
            var db = event.target.result;
            transaction = db.transaction(["records"], "readonly")
            const objectStore = transaction.objectStore("records");

            const countRequest = objectStore.count();
            countRequest.onsuccess = () => {
            return resolve(countRequest.result);
            };
        }
    });
 }