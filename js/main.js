// Helpers
function hasClass(el, className) {
  if (!el) return false;
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}
function addClass(el, className) {
  if (!el) return false;
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
  return true;
}
function removeClass(el, className) {
  if (!el) return false;
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
  return false;
}
function toggleClass(el, className) {
  if ( hasClass(el, className) )
    return removeClass(el, className);
  else 
    return addClass(el, className);
}
function getParentWithClass(el, className) {
  var parent = el.parentElement;
  while(parent != null && !parent.classList.contains(className))
    parent = parent.parentElement;
  return parent;
}
function getSiblingWithClass(el, className) {
  var sibling = el.nextElementSibling;
  while(sibling != null && !sibling.classList.contains(className))
    sibling = sibling.nextElementSibling;
  return sibling;
}
function getChildWithClass(el, className) {
  var children = el.childNodes;
  for(var i=0; i<children.length; i++)
    if(children[i].classList && children[i].classList.contains(className)) return children[i];
}


var isMobile = (window.innerWidth < 640);

var openQuestion = function(group, question, answer, tween){
  return function(e){
    var isOpen = toggleClass(group, 'is-open');
    var transitions = {};
    if(isOpen){
      transitions.height = answer.getAttribute('data-height');
      transitions.ease = Power2.easeOut;
    } else {
      transitions.height = 0;
      transitions.ease = Power2.easeOut;
    }
    console.log('tween', TweenMax.to);
    TweenMax.to(answer, 0.5, transitions);
  }
}
var questions = document.querySelectorAll('.question-group .question');
for(var i=0; i<questions.length; i++){
  var group = getParentWithClass(questions[i], 'question-group');
  var answer = getSiblingWithClass(questions[i], 'answer');
  answer.setAttribute("data-height", answer.clientHeight);
  answer.style.height = "0";
  group.addEventListener("click", openQuestion(group, questions[i], answer))
}

function initializeMap() {
  var hacktjStyle = new google.maps.StyledMapType(window.hacktjMapStyles, {name: "HackTJ Website"});
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: isMobile ? {lat: 38.819, lng: -77.189} : {lat: 38.819, lng: -77.209},
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
  });
  map.mapTypes.set('hacktj', hacktjStyle);
  map.setMapTypeId('hacktj');

  var marker = new google.maps.Marker({
    position: {lat: 38.818086, lng: -77.168323},
    map: map
  });
}
google.maps.event.addDomListener(window, 'load', initializeMap);

// ScrollMagic Code
if(!isMobile){
  var scrollController = new ScrollMagic.Controller();
  var segments = document.querySelectorAll('.animation-container');
  var scrollDistance = 0;
  var animations = [];
  for (i = 0; i < segments.length; ++i) {
    if(hasClass(segments[i], 'vertical')){
      scrollDistance += segments[i].clientHeight;
    } else if(hasClass(segments[i], 'horizontal')){
      scrollDistance += segments[i].clientWidth;
    }
    animations.push(segments[i]);
  }
  var totalHeight = ((document.height !== undefined) ? document.height : document.body.offsetHeight) - window.innerHeight;
  var scrollFactor = totalHeight / scrollDistance;

  var y = window.innerHeight/2.5;
  animations.forEach(function(segment){
    if( segment.childNodes[0] && !hasClass(segment, 'line-schedule')) {
      var child = segment.childNodes[0];
      var animateDuration = 0;
      var animations = {ease: Linear.easeNone};
      if(hasClass(segment, 'vertical')){ 
        animations.height = "100%"; 
        animateDuration = segment.clientHeight * 1.2;
      }
      if(hasClass(segment, 'horizontal')){ 
        animations.width = "100%"; 
        animateDuration = segment.clientWidth / 2.0;
      }
      animateDuration = animateDuration * scrollFactor;
      
      var scene = new ScrollMagic.Scene({offset: y, duration: animateDuration})
        .setTween(segment.childNodes[0], animations)
        .addTo(scrollController);

      y = y + animateDuration;
    } else if(hasClass(segment, 'line-schedule')) {
      var scene = new ScrollMagic.Scene({triggerElement: segment, offset: -segment.clientWidth/2, duration: segment.clientWidth})
        .setTween(segment.childNodes[0], {width: "100%"})
        // .addIndicators({name: "Y: "+segment.offsetY+" Duration: "+segment.clientWidth})
        .addTo(scrollController);

    }
  });
  var scene = new ScrollMagic.Scene({offset: y, duration: totalHeight-y})
        .setTween('#map-info', {transform: "scale(1)"})
        .addTo(scrollController)
        .on('end', function(){
          scrollController.destroy();
        });
}

// Temporary registration form code
function buildForm(id){
  console.log('#'+id+' input.contact')
  var input = document.querySelector(id+' input.contact');
  var button = document.querySelector(id+' button.submit');
  var icon = document.querySelector(id+' button.submit .icon');
  var confirmation = document.querySelector(id+' .confirmation-text');

  // Regular Expressions
  var phoneNumber = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  var emailAddress = /^[^@\s]*@[a-z\-._]{1,}\.[a-z]{2,}$/i;

  // Event Listeners
  var validate = function(e){
    if ( hasClass(button, 'is-disabled') && input.value ) {
      removeClass(button, 'is-disabled');
    } else if( !hasClass(button, 'is-disabled') && !input.value && !hasClass(button, 'is-done') ) {
      addClass(button, 'is-disabled');
    }

    if ( hasClass(button, 'is-done') ) {
      removeClass(button, 'is-done');
      removeClass(icon, 'icon-check');
    }
    if ( hasClass(confirmation, 'is-shown') ) {
      removeClass(confirmation, 'is-shown');
    }

    // Do nothing if the user presses 
    if(event.keyCode === 13){
      submit({});
    }
  }

  input.addEventListener('keyup', validate);
  input.addEventListener('focus', validate);
  input.addEventListener('blur', validate);

  var submit = function(e){
    console.log('submit');
    addClass(button, 'is-done');

    var type = "invalid";

    var value = input.value.trim();


    if( value.match(phoneNumber) ) {
      type = "phone"
    }else if( value.match(emailAddress) ) {
      type = "email";
    }

    if(type !== "email" && type !== "phone"){
      confirmation.innerHTML = "Uh oh - that doesn't look like a phone number or email address.";
      addClass(confirmation, 'is-shown');

      addClass(icon, 'icon-close-circle');
    } else {
      addClass(icon, 'icon-config');
      addClass(icon, 'icon-spin');
      
      // Universal Callback
      var cb = function(err, message) {
        removeClass(icon, 'icon-spin');
        removeClass(icon, 'icon-config');
        
        if(err) {
          addClass(icon, 'icon-close-circle');
        } else {
          addClass(icon, 'icon-check');
        }

        confirmation.innerHTML = message;
        addClass(confirmation, 'is-shown');
      }
      apiRequest(value, type, cb);
    }
    return false;
  }

  function apiRequest(value, type, callback){
    var request = new XMLHttpRequest();
    request.open("POST", "https://api.hacktj.org/interest/"+type);
    request.onreadystatechange = function() {
      if (this.readyState == 4) {
        return callback(this.status!==200, this.responseText);
      }
    }
    var data = {};
    data[type] = value;
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
  }

  button.addEventListener('click', submit);
}
buildForm('#form1');
buildForm('#form2');
