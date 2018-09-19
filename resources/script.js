var url, prefix,connectionType;
initialize()
run()


function initialize(){
  url = $( "#url" ).val();
  prefix = $( "#prefix" ).val();
  connectionType = "ws"
  if ($('#isSecure').is(":checked")){
    connectionType = "wss"
  }

  $( "#url,#app,#prefix, #isSecure" ).change(function() {
    url = $( "#url" ).val();
    prefix = $( "#prefix" ).val();
    connectionType = "ws"
    if ($('#isSecure').is(":checked")){
      connectionType = "wss"
    }
    run();
  });
}

var connectFlag = false
var getAppFlag = false
var openAppFlag = false
var getAppFlag = false
var createAppFlag = false
var deleteAppFlag = false
var sessionAppFlag = false

function run(){
  connectFlag = false
  getAppFlag = false
  openAppFlag = false
  getAppFlag = false
  createAppFlag = false
  deleteAppFlag = false
  sessionAppFlag = false

  var qix
  console.log("Connecting to "+connectionType+":"+url+"/"+prefix)
  $.get('https://unpkg.com/enigma.js@2.2.0/schemas/12.34.11.json')
    .then(schema => {
      const session = enigma.create({
        schema,
        url: connectionType+'://'+url+'/'+prefix+'/',
        createSocket: url => new WebSocket(url)
      });
      session.open()
        .then(global => {
          console.log("connection")
          console.log(global)
          qix = global
          connectFlag = true
          return global.getDocList()
        })
        .then(apps => {
          getAppFlag = true
          console.log("get apps")
          console.log(apps)
          if (apps.length > 0){
            console.log(apps[0].qDocName)
            qix.openDoc({qDocName : apps[0].qDocName,qNoData:true})
              .then(tempapp =>{
                console.log("open")
                console.log(tempapp)
                openAppFlag = true;
                update();
              })
          }
          // listDocs(apps)

          qix.createApp({qAppName:"core-healtCheck-tempapp"}).then(app=>{
            console.log("create")
            console.log(app)
            createAppFlag = true
            update();
          })
          qix.deleteApp({qAppId:"core-healtCheck-tempapp"}).then(app=>{
            console.log("delete")
            console.log(app)
            deleteAppFlag = true
            update();
          })
          qix.createSessionApp().then(app=>{
            sessionAppFlag = true
            update();
            qix.close();
          })
        })
  })
  update()
}

function update(){
  if (connectFlag){
    $("#tb1").text("Pass")
  }else{
    $("#tb1").text("Fail")
  }
  if (getAppFlag){
    $("#tb2").text("Pass")
  }else{
    $("#tb2").text("Fail")
  }
  if (openAppFlag){
    $("#tb3").text("Pass")
  }else{
    $("#tb3").text("Fail")
  }
  if (createAppFlag){
    $("#tb4").text("Pass")
  }else{
    $("#tb4").text("Fail")
  }
  if (deleteAppFlag){
    $("#tb5").text("Pass")
  }else{
    $("#tb5").text("Fail")
  }
  if (sessionAppFlag){
    $("#tb6").text("Pass")
  }else{
    $("#tb6").text("Fail")
  }
}

function listDocs(data)
{
  var tableText = "<table>"
  tableText += "<tr>"
  tableText+="<th>ID</th>"
  tableText+="<th>Doc name</th>"
  tableText+="<th>App title</th>"
  tableText+="<th>App size</th>"
  tableText+="<th>Last reload time</th>"
  tableText+="</tr>"
  data.forEach(function(elem){
    tableText += "<tr>"
    tableText +="<td>"+elem.qDocId+"</td>"
    tableText +="<td>"+elem.qDocName+"</td>"
    tableText +="<td>"+elem.qTitle+"</td>"
    tableText +="<td>"+elem.qFileSize+"</td>"
    tableText +="<td>"+elem.qLastReloadTime+"</td>"
    tableText += "</tr>"      
  })
  tableText += "</table>"
  $("#chart1").append(tableText);
}