function hasClass(e,s){return e?e.classList?e.classList.contains(s):!!e.className.match(new RegExp("(\\s|^)"+s+"(\\s|$)")):!1}function addClass(e,s){return e?(e.classList?e.classList.add(s):hasClass(e,s)||(e.className+=" "+s),!0):!1}function removeClass(e,s){if(!e)return!1;if(e.classList)e.classList.remove(s);else if(hasClass(e,s)){var t=new RegExp("(\\s|^)"+s+"(\\s|$)");e.className=e.className.replace(t," ")}return!1}function toggleClass(e,s){return hasClass(e,s)?removeClass(e,s):addClass(e,s)}function getParentWithClass(e,s){for(var t=e.parentElement;null!=t&&!t.classList.contains(s);)t=t.parentElement;return t}function getSiblingWithClass(e,s){for(var t=e.nextElementSibling;null!=t&&!t.classList.contains(s);)t=t.nextElementSibling;return t}function getChildWithClass(e,s){for(var t=e.childNodes,a=0;a<t.length;a++)if(t[a].classList&&t[a].classList.contains(s))return t[a]}function queryParam(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var s=new RegExp("[\\?&]"+e+"=([^&#]*)"),t=s.exec(location.search);return null===t?"":decodeURIComponent(t[1].replace(/\+/g," "))}function updateClasses(){userStatus.ecc?(addClass(eccItem,"completed"),document.querySelector(".filename.ecc").textContent=userStatus.ecc):removeClass(eccItem,"completed"),userStatus.fieldtrip?(addClass(fieldtripItem,"completed"),document.querySelector(".filename.fieldtrip").textContent=userStatus.fieldtrip):removeClass(fieldtripItem,"completed"),userStatus.ecc&&userStatus.fieldtrip?addClass(statusMessage,"completed"):removeClass(statusMessage,"completed")}function upload(e){filepicker.pickAndStore({mimetypes:["image/","application/pdf"],maxsize:20971520,services:["COMPUTER","GOOGLE_DRIVE","DROPBOX","EVERNOTE","SKYDRIVE","CLOUDDRIVE","GMAIL","FTP","CLOUDAPP","BOX"]},{},function(s){userStatus[e]=s[0].filename;var t=new XMLHttpRequest;t.open("POST",HOST+"/forms/"+userId,!0),t.setRequestHeader("Content-Type","application/json; charset=UTF-8"),t.send(JSON.stringify(userStatus)),updateClasses()})}var HOST="https://api.hacktj.org",mainBox=document.querySelector(".centered-box"),eccItem=document.querySelector("li.ecc"),fieldtripItem=document.querySelector("li.fieldtrip"),statusMessage=document.querySelector(".status-container"),userId=queryParam("id")||"null",userStatus={};filepicker.setKey("AcFwfLxwuTgOlZqJ5bWGez");var request=new XMLHttpRequest;request.open("GET",HOST+"/forms/"+userId,!0),request.onload=function(){request.status>=200&&request.status<400?(userStatus=JSON.parse(request.responseText),updateClasses()):404==request.status&&addClass(mainBox,"not-found")},request.send();