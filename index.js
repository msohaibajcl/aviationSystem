url="http://127.0.0.1:7700"
function login(){
    // console.log("access")
    email=document.getElementById("email").value;
    password=document.getElementById("password").value;
    authCode=document.getElementById("authCode").value;
    if(email==""){
        document.getElementById("email").style.borderColor="red";
    }
    else if(password==""){
        document.getElementById("password").style.borderColor="red";
    }
    else if(authCode==""){
        document.getElementById("authCode").style.borderColor="red";
    }
    else{
        document.getElementById("email").style.borderColor="grey";
        document.getElementById("password").style.borderColor="grey";
        document.getElementById("authCode").style.borderColor="grey";
        data={"email":email,"password":password,"authCode":authCode};
        postData=JSON.stringify(data);
        request=url+'/api/aviation/login/';
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            // url : 'http://127.0.0.1:8081/api/allusers/'+'20',
            data:postData,
            success: function(data){
                if(data["response"]=="success"){
                    document.getElementById("error").style.display="none";
                    document.getElementById("error").innerHTML="";
                    localStorage.setItem("email",email);
                    localStorage.setItem("department",data["department"]);
                    window.location.href="employeeDashboard.html";
                }
                else{
                    document.getElementById("error").style.display="block"
                    document.getElementById("error").innerHTML=data["response"]
                }
            }
        });
    }
}
function dashboard(){
    // console.log("access");
    document.getElementById("department").innerHTML=localStorage.getItem("department").toUpperCase();
    const email=localStorage.getItem("email");
    let name=email.split("@");
    document.getElementById("user-name").innerHTML=name[0];
    let width = screen.width;
    if(width<=1600){
        let options=document.getElementById("menubar").innerHTML;
        document.getElementById("menubar").innerHTML="<button onclick='showMenubar()' style='box-shadow: none;border: none;'><img src='images/bars-solid.svg' height='30px'></button>";
        document.getElementById("menubarResponsive").innerHTML=options;
        document.getElementById("menubarResponsive").style.display="none";
        // document.getElementsByClassName("menubar").style.width="100%";
        document.getElementById("customer").style.display="none";
    }else{}
        request=url+'/api/aviation/getUserInfo/'+localStorage.getItem("email");
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            success: function(data){
                document.getElementById("name").innerHTML="Name: "+data["response"]["name"]
                document.getElementById("email").innerHTML="Email: "+data["response"]["email"]
                document.getElementById("profileDepartment").innerHTML="Department: "+data["response"]["department"]
                document.getElementById("post").innerHTML="Post: "+data["response"]["post"]
                document.getElementById("age").innerHTML="Age: "+data["response"]["age"]
                document.getElementById("loc").innerHTML="Location: "+data["response"]["loc"]
            }
        });
}
function showMenubar(){
    if(document.getElementById("menubarResponsive").style.display=="none"){
        document.getElementById("menubarResponsive").style.display="block";
    }
    else{
        document.getElementById("menubarResponsive").style.display="none";
    }
}
function dashboardFilter(){
    // console.log(document.getElementById("dashboardFilter").value);
    if(document.getElementById("dashboardFilter").value=="all"){
        document.getElementById("customer").innerHTML="<img class='customerLogo' src='images/pakArmy.png'><img class='customerLogo' src='images/pakNavy.png'><img class='customerLogo' src='images/pakCD.png'>";
    }
    else if(document.getElementById("dashboardFilter").value=="pakArmy"){
        document.getElementById("customer").innerHTML="<img class='customerLogo' src='images/pakArmy.png'>";
    }
    else if(document.getElementById("dashboardFilter").value=="pakNavy"){
        document.getElementById("customer").innerHTML="<img class='customerLogo' src='images/pakNavy.png'>'";
    }
    else if(document.getElementById("dashboardFilter").value=="dgp"){
        document.getElementById("customer").innerHTML="<img class='customerLogo' src='images/pakArmy.png'>";
    }
    else if(document.getElementById("dashboardFilter").value=="cd"){
        document.getElementById("customer").innerHTML="<img class='customerLogo' src='images/pakCD.png'>";
    }
    else{}
}
function RFQs(){
    // console.log("access");
    document.getElementById("department").innerHTML=localStorage.getItem("department").toUpperCase();
    const email=localStorage.getItem("email");
    let name=email.split("@");
    document.getElementById("user-name").innerHTML=name[0];
    let width = screen.width;
    if(width<=1600){
        let options=document.getElementById("menubar").innerHTML;
        document.getElementById("menubar").innerHTML="<button onclick='showMenubar()' style='box-shadow: none;border: none;'><img src='images/bars-solid.svg' height='30px'></button>";
        document.getElementById("menubarResponsive").innerHTML=options;
        document.getElementById("menubarResponsive").style.display="none";
        // document.getElementsByClassName("menubar").style.width="100%";
        document.getElementById("customer").style.display="none";
    }else{}
    loadRFQs()
}   
function getSelectedItems(){
    try{
        temp01=localStorage.getItem("itemList")
        temp02=JSON.parse(temp01)
        temp03=temp02.items
    }
    catch(e){
        localStorage.setItem("itemList",JSON.stringify({"items":[1]}))
        localStorage.setItem("itemQuantity",1)
        temp01=localStorage.getItem("itemList")
        temp02=JSON.parse(temp01)
        temp03=temp02.items
    }
    item=""
    qty=""
    stat=true
    temp03.forEach(element => {
        var temp=document.getElementById("pn"+String(element)).value;
        var temp2=document.getElementById("qty"+String(element)).value;
        if(temp=="0" || temp2=="0"){stat=false}
        else{}
        if(item!=""){item=item+","+temp;qty=qty+","+temp2}
        else{item=temp;qty=temp2}
    });
    if(stat){  
        document.getElementById("partNo").value=item
        document.getElementById("qty").value=qty
        return stat
    }
    else{
        document.getElementById("partNo").value=""
        document.getElementById("qty").value=""
        return stat
    }
}
function addRFQ(){
    // console.log("access");
    result=getSelectedItems()
    // console.log(result)
    if(result){
    ids=["rfqNo","rfqCategory","rfqType","reqDate","deliveryDate","partNo","qty","customer"]
    const errors=[]
    ids.forEach(element => {
        // console.log(element)
        var temp=document.getElementById(element).value;
        // console.log(temp)
        if(element=="rfqType"){
            if(temp=="select"){
                errors.push(element)
            }
            // else if(temp=="ro" && document.getElementById("serialNo").value==""){
            //     errors.push("serialNo")
            // }
            else{}
        }
        else if(temp && temp!="select"){
            document.getElementById(element).style.borderColor="grey";
        }
        else{
            // console.log("123acess")
            errors.push(element)
        }
    });
    // console.log(errors)
    if (errors.length == 0){
        sendData={}
        count=0
        ids.forEach(element => {
            sendData[element]=document.getElementById(element).value;
        }); 
        // console.log(sendData);
        sendData=JSON.stringify(sendData);
        request=url+'/api/aviation/addRFQ/';
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            // url : 'http://127.0.0.1:8081/api/allusers/'+'20',
            data:sendData,
            success: function(data){ 
                if(data["response"]=="exist"){
                    alert("RFQ Already Exist!");
                    document.getElementById("rfqNo").style.borderColor="red";
                }
                else{
                    alert("RFQ Successfully Added! RFQ No : "+data["code"]);
                    window.location.href="RFQs.html";
                }
            }
        });
    }
    else{
        // console.log(errors)
        errors.forEach(element => {
            document.getElementById(element).style.borderColor="red";
        });
    }
    }
    else{
        // console.log("else")
        document.getElementById("partNos").style.background="#b900002e";
        document.getElementById("partNos").style.borderColor="red";
    }
}
function rfqItemFilter(){
    
}
function loadAddRFQForm(){
    localStorage.removeItem("itemQuantity");
    localStorage.removeItem("itemList");
    if(document.getElementById("customer").value!="select"){
    document.getElementById("loader").style.display="block";
    request=url+'/api/aviation/getBOM/'+document.getElementById("customer").value;
    // console.log("bom");
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            localStorage.setItem("bom",JSON.stringify(data["response"]));
            // console.log(data);
            var $pn=$("#pn1");
            $.each(data, function(i,item) {
                $.each(this, function(i, item){
                    $pn.append("<option value='"+item.id+"'>"+item.partNo+" | "+item.nomanclature+"</option>")
                });
            });
            document.getElementById("loader").style.display="none";
        }
    });}else{}
    // console.log("abc");
}
function addItemInRFQHtml(id){
    var html='<div><select id="pn'+id+'"><option value="0">Select</select></div>'+
    '<div><input id="qty'+id+'" type="text" value="1" name="qty1" placeholder=""/></div>'+
    '<div><button id="btn'+id+'" onclick="removeItemFromRFQ(this)"><img src="images/xmark-solid.svg" height="100px" width="100px"></button></div>'
  return html
}
function rfqType(){
    temp=document.getElementById("rfqType").value;
    if(temp=="ro"){
        document.getElementById("quantity").innerHTML="Serial No";
    }
    else{
        document.getElementById("quantity").innerHTML="Quantity";
    }
}
function addItemInRFQ(){
    // console.log("access")
    tryVar=false
    var $pn="";
    try{
        temp=localStorage.getItem("itemQuantity");
        temp2=localStorage.getItem("itemList");
        localStorage.setItem("itemQuantity",parseInt(temp)+1)
        temp3=JSON.parse(temp2)
        temp4=temp3.items
        temp4.push(parseInt(temp)+1)
        localStorage.setItem("itemList",JSON.stringify({"items":temp4}))
        html=addItemInRFQHtml(String(parseInt(temp)+1));
        $("#partNos").append(html);
        tryVar=true
        $pn=$("#pn"+String(parseInt(temp)+1));
        // console.log("try");
    }
    catch(e){
        if(tryVar){}
        else{
        localStorage.setItem("itemQuantity",2)
        localStorage.setItem("itemList",JSON.stringify({"items":[1,2]}))
        html=addItemInRFQHtml(2);
        $("#partNos").append(html);
        $pn=$("#pn2")
        // console.log("catch")
    }}
    data=localStorage.getItem("bom");
    data=data.replace("[","");
    data=data.replace("]","");
    data=data.split("},");
    // $pn=$("#pn2");
    // console.log(data);
    $.each(data, function(i, item){
        if(item.slice(-1)=="}"){}
        else{item=item+'}'}
        temp=JSON.parse(item)
        $pn.append("<option value='"+temp.id+"'>"+temp.partNo+" | "+temp.nomanclature+"</option>")
    });
    // console.log(localStorage.getItem("itemQuantity"));
}
function removeItemFromRFQ(param){
    id=String(param.id);
    temp=localStorage.getItem("itemList");
    temp2=JSON.parse(temp)
    temp3=temp2.items
    temp4=localStorage.getItem("itemQuantity");
    temp4=parseInt(temp4)
    // console.log(id)
    find=""
    if(temp4 <10){find=id.slice(-1)}
    else if(temp4 >= 10 && temp4 < 100){find=id.slice(-2)}
    else if(temp4 > 100){find=id.slice(-3)}
    else{}
    find=find.replace("n","")
    find=find.replace("n","")
    // console.log(find);
    const index = temp3.indexOf(parseInt(find));
    if (index > -1) { // only splice array when item is found
        temp3.splice(index, 1); // 2nd parameter means remove one item only
    }
    // console.log(temp3);
    localStorage.setItem("itemList",JSON.stringify({"items":temp3}))
    // console.log(localStorage.getItem("itemList"));
    const element = document.getElementById('pn'+find);
    element.remove();
    const element2 = document.getElementById('qty'+find);
    element2.remove();
    const element3 = document.getElementById('btn'+find);
    element3.remove();
}
function addBomItem(){
    ids=["partNo","nomenclature","uom","alternate","unitPrice","currency","company"]
    errors=[]
    itemStatus=false
    $.each(ids, function(i, item){
        temp=document.getElementById(item).value;
        if(temp && temp!="select"){
            document.getElementById(item).style.borderColor="grey";
        }
        else{
            itemStatus=true
            errors.push(item)
        }
    });
    if(itemStatus){
        // console.log(itemStatus);
        $.each(errors, function(i, item){
            document.getElementById(item).style.borderColor="red";
        });
    }
    else{
        data={}
        $.each(ids, function(i, item){
            data[item]=document.getElementById(item).value;
        });
        postData=JSON.stringify(data);
        console.log(postData)
        request=url+'/api/aviation/addItemToBOM/';
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            data:postData,
            success: function(data){
                if(data["response"]=="exist"){
                    alert("Item Already Exist!")
                    document.getElementById("partNo").style.borderColor="red";
                }
                else{
                    alert("Item Added Successfully!");
                    history.back();
                }

            }
        });
    }
}
function rfqItemHTML(rfqNo,item,offerNo,offer,type,id){ 
    console.log(id)
    bg='white'
    revise='<div class="reviseOffer" id="revise'+offer[offerNo]["id"]+'" onclick="reviseOffer(this)">Revise</div>'
    if(item[2]=='PO Recieved'){
        bg='#00800078';
        revise="<div class='lockedOffer'>Locked</div>";
    }
    else if(item[2]=='Not Recieved'){
        bg='#ff000045';
    }
    else if(item[2]=="Recieved"){
        bg="#89560a9e";
    }else{}
    offerHTML=""
    if(offer[offerNo]=="Not Recieved"){
        if(item[2]=='PO Recieved'){
            offerHTML="<div></div>"
        }
        else{
        offerHTML="<div><button id='"+rfqNo+"|"+item[0]+"|"+type+"' class='addOfferButton' onclick='addOffer(this)'>Enter Offer</button></div>"
        }
    }  
    else{
        offerHTML='<div class="offerDetails"><div>'+offer[offerNo]["offerNumber"]+'</div>'+
            '<div>'+offer[offerNo]["unitOfMeasure"]+'</div>'+
            '<div>'+offer[offerNo]["quantity"]+'</div>'+
            '<div>'+offer[offerNo]["price"]+'</div>'+
            revise+
            '</div>'
    }
    html='<tr class="offerDetailsRow">'+
        '<td>'+item[0]+'</td>'+
            '<td>'+item[1]+'</td>'+
            '<td>'+item[3]+'</td>'+
            '<td>'+
                '<div class="offerDetailsSection">'+
                    offerHTML+
                        // '<div>111</div>'+
                        // '<div>CM</div>'+
                        // '<div>5</div>'+
                        // '<div>$999</div>'+
            '  </div>'+
            ' </td>'+
            ' <td style="background:'+bg+'">'+item[2]+'</td>'+
        '</tr>'
    return html
}
function rfqHTML(data,items,offerNo,offer){
    itemsHTML=""
    globalStatus=""
    $.each(items, function(i, item){
        console.log(offer);
        itemsHTML=itemsHTML+rfqItemHTML(data.rEQNumber,item,offerNo[i],offer,data.rEQType,item.id);
        if(globalStatus==""){
            globalStatus=item[2]
        }
        else if(globalStatus==item[2]){}
        else{globalStatus="Partially Received"}
    });
    type=""
    typeAbb=""
    if(data.rEQType=="ro"){type="Serial No";typeAbb="SN";}
    else{type="Req Quantity";typeAbb="Qty";};
    html='<div class="rfq">'+
    '<div class="company">'+
        '<h5>'+data.customer+'</h5>'+
    '</div>'+
    '<div class="rfqTableSection">'+
        '<table class="rfqTable">'+
            '<tr class="header">'+
                '<td>RFQ No</td>'+
               ' <td>Category</td>'+
                '<td>Type</td>'+
                '<td>Date</td>'+
                '<td>Due Date</td>'+
                '<td>RFQ Transaction No</td>'+
                // '<th>666</th>'+
                // '<th>777</th>'+
                // '<th>888</th>'+
                // '<th>999</th>'+
                // '<th>101</th>'+
                // '<th>102</th>'+
            '</tr>'+
            '<tr>'+
               ' <td>'+data.rEQNumber+'</td>'+
                '<td>'+data.rEQCategory.toUpperCase()+'</td>'+
                '<td>'+data.rEQType.toUpperCase()+'</td>'+
                '<td>'+data.rEQDate+'</td>'+
                '<td>'+String(data.deliveryDate).slice(0, 16)+'</td>'+
                 '<td>'+data.rfqNoSG+'</td>'+
                // '<td>666</td>'+
                // '<td>777</td>'+
                // '<td>888</td>'+
                // '<td>999</td>'+
                // '<td>101</td>'+
                // '<td>102</td>'+
            '</tr>'+
        '</table>'+
    '</div>'+
    '<div class="offersTableSection">'+
        '<table class="offersTable">'+
            '<tr style="background:#183A69;color:white;font-weight:700;">'+
                '<th rowspan="2">Part No</th>'+
                '<th rowspan="2">Nomenclature</th>'+
                '<th rowspan="2">'+type+'</th>'+
                '<th>Offers</th>'+
                '<th rowspan="2">Status</th>'+
            '</tr>'+
            '<tr class="offersRow">'+
                '<td>'+
                    '<div class="offerDetailsSection">'+
                        '<div class="offerDetails">'+
                           ' <div>Id</div>'+
                           ' <div>A/U</div>'+
                           ' <div>'+typeAbb+'</div>'+
                            '<div>Price</div>'+
                            '<div>Edit</div>'+
                        '</div>'+
                    '</div>'+
                '</td>'+
            '</tr>'+
            '<tr class="offerDetailsRow">'+itemsHTML+
            //    ' <td>'+item[0]+'</td>'+
            //     '<td>'+item[1]+'</td>'+
            //     '<td>'+
            //         '<div class="offerDetailsSection">'+
            //            ' <div class="offerDetails">'+
            //                 '<div>111</div>'+
            //                 '<div>CM</div>'+
            //                 '<div>5</div>'+
            //                 '<div>$999</div>'+
            //         '    </div>'+
            //       '  </div>'+
            //    ' </td>'+
            //    ' <td>'+item[2]+'</td>'+
            // '</tr>'+
        '</table>'+
    '</div>'+
    '<div class="remarkSection">'+
        '<button class="remarks">Remarks</button>'+
        '<button class="requestStatus">'+globalStatus+'</button>'+
    '</div>'+
'</div>'
return html
}
function loadRFQs(){
    document.getElementById("rfqs").innerHTML="";
    request=url+'/api/aviation/getRFQs/';
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            $rfqs=$("#rfqs")
            items=data["items"]
            $.each(data["response"], function(i, item){
                // console.log(item.itemSet[i]);
                console.log(items[i]);
                html=rfqHTML(item,items[i][item.rEQNumber],item.itemSet,items[i])
                $rfqs.append(html);
            });
        }
    });
}
function addOffer(param){
    temp=param.id.split("|")
    localStorage.setItem("rfqNo",temp[0]);
    localStorage.setItem("partNo",temp[1]);
    localStorage.setItem("rfqType",temp[2])
    window.location.href="addOfferForm.html";
}
function loadOfferForm(){
    document.getElementById("rfqNo").innerHTML="RFQ No: "+localStorage.getItem("rfqNo");
    document.getElementById("partNo").innerHTML="Part No: "+localStorage.getItem("partNo");
    if(localStorage.getItem("rfqType")=="ro"){
        document.getElementById("quantity").innerHTML="RMA";
    }
}
function addOfferSubmit(){
    ids=["offerNo","offerDate","validityDate","alternatePart","qty","unitPrice","offerDiscount","offerFreightCharges","deliveryDate"]
    errors=[]
    itemStatus=true
    $.each(ids, function(i, item){
        temp=document.getElementById(item).value;
        if(temp){
            document.getElementById(item).style.borderColor="grey";
        }
        else{
            errors.push(item)
            itemStatus=false
        }
    });
    if(itemStatus){
        unitPrice=document.getElementById("unitPrice").value;
        offerDiscount=document.getElementById("offerDiscount").value;
        offerFreightCharges =document.getElementById("offerFreightCharges").value;
        qty=document.getElementById("qty").value;
        currentUnitPrice=0
        finalPrice=0
        if(offerDiscount=="0" || offerDiscount==0){
        }
        else{
            temp=(parseFloat(offerDiscount)/100)*parseFloat(unitPrice);
            currentUnitPrice=parseFloat(unitPrice)-temp;
        }
        if(offerFreightCharges =="0" || offerFreightCharges ==0){
            document.getElementById("qty").style.borderColor="red";
        }
        else{
            temp=(parseFloat(offerFreightCharges)/100)*currentUnitPrice
            currentUnitPrice=currentUnitPrice+temp;
        }
        if(qty==0 || qty=="0"){
            document.getElementById("qty").style.borderColor="red";
        }
        else{
            finalPrice=currentUnitPrice*parseInt(qty);
            // console.log(finalPrice);
        }
        data={"finalPrice":finalPrice,"partNo":localStorage.getItem("partNo"),"rfqNo":localStorage.getItem("rfqNo")}
        $.each(ids, function(i, item){
            data[item]=document.getElementById(item).value;
        });
        data["rfqType"]=localStorage.getItem("rfqType");
        postData=JSON.stringify(data);
        request=url+'/api/aviation/addOffer/';
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            data:postData,
            success: function(data){
                alert("Offer Successfully Added!")
                window.location.href="RFQs.html"
            }
        });
    }
    else{
        $.each(errors, function(i, item){
            document.getElementById(item).style.borderColor="red";
        });
    }
}
//SEARCH RFQ

function searchRFQ(){
    search=document.getElementById("search").value;
    if(search.length==0){
        loadRFQs();
    }
    else if(search.length>=2){
    document.getElementById("rfqs").innerHTML="";
    data={"search":search}
    postData=JSON.stringify(data)
    request=url+'/api/aviation/searchRFQ/';
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'POST',
        url: request,
        data:postData,
        success: function(data){
            // console.log(data);
            $rfqs=$("#rfqs")
            items=data["items"]
            $.each(data["response"], function(i, item){
                // console.log(item.itemSet[i]);
                // console.log(items[i]);
                html=rfqHTML(item,items[i][item.rEQNumber],item.itemSet,items[i])
                $rfqs.append(html);
            });
        }
    });
    }
    else{}
}
function loadPos(){
    // console.log("access");
    document.getElementById("department").innerHTML=localStorage.getItem("department").toUpperCase();
    const email=localStorage.getItem("email");
    let name=email.split("@");
    document.getElementById("user-name").innerHTML=name[0];
    let width = screen.width;
    if(width<=1600){
        let options=document.getElementById("menubar").innerHTML;
        document.getElementById("menubar").innerHTML="<button onclick='showMenubar()' style='box-shadow: none;border: none;'><img src='images/bars-solid.svg' height='30px'></button>";
        document.getElementById("menubarResponsive").innerHTML=options;
        document.getElementById("menubarResponsive").style.display="none";
        // document.getElementsByClassName("menubar").style.width="100%";
        document.getElementById("customer").style.display="none";
    }else{}
}
function generateFields(){
    total=document.getElementById("totalItem").value;
}
itemSet=""
function loadPosForm(){
    customer=document.getElementById("customer").value;
    customer=customer.toLowerCase();
    console.log(customer);
    request=url+"/api/aviation/getRfqOfferItems/"+customer;
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            // console.log(data);
            itemSet=data["response"];
        }
    });
}
function loadPosAmendedForm(){
    customer=document.getElementById("customer").value;
    customer=customer.toLowerCase();
    console.log(customer);
    request=url+"/api/aviation/getRfqOfferItemsAmended/"+customer+"/"+localStorage.getItem("poId");
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            // console.log(data);
            itemSet=data["response"];
            console.log(itemSet);
            addSelectedPOItemsAmended();
        }
    });
}
function itemHtml(item){
    html='<button id="item'+item.id+'rfq'+item.rfq+'" onclick="addPOItemToList(this)" class="item">'+
    '<strong>Part No: </strong>'+item.partNo+' <br> '+
    '<strong>Nomenclature: </strong>'+item.nomenclature+"  <br> "+
    '<strong>RFQ: </strong>'+item.rfq+ "<br>"+
    '<strong>Quantity: </strong>'+item.quantity+
    '</button>'
    
    return html
}
selectedItems=[]
function searchRfqOfferPartNo(){
    search=document.getElementById("search").value;
    document.getElementById("rfqs").innerHTML="";
    document.getElementById("offers").innerHTML="";
    if(search){
    console.log(itemSet);
    filtered=[]
    $rfqs=$("#rfqs");
    $offers=$("#offers");
    $.each(itemSet, function(i, item){
        if(String(item.partNo).search(search)!=-1){
            // console.log(String(item.partNo).search(search))
            if(String(item.category)=='RFQ'){
                html=itemHtml(item);
                $rfqs.append(html);
                // console.log(item);
            }
            else if(String(item.category)=='Offer'){
                temp='item'+item.id+'rfq'+item.rfq;
                temp2=selectedItems.includes(temp);
                if(temp2){}
                else{
                    html=itemHtml(item);
                    $offers.append(html);
                }
                // console.log(item);
            }
            else{}
        }
        else{}
    });
}
}
function poItemHTML(item){
    html='<li class="poListItem" id="listItem'+item.id+'rfq'+item.rfq+'">'+
    '<strong>Part No: </strong>'+item.partNo+'<br>'+
    '<strong>Nomenclature: </strong>'+item.nomenclature+'<br>'+
    '<strong>Reference: </strong>'+item.category+'<br>'+
    '<strong>Quantity: </strong>'+item.quantity+'<br>'+
    '<button class="removePOListItem" onclick="removeItemFromSelected(this)" id="removeItem'+item.id+'rfq'+item.rfq+'">Remove</button></li>'
    return html
}
function addPOItemToList(param){
    //console.log(param);
    id=param.id;
    temp=id.split("rfq");
    itemId=temp[0].replace("item","");
    rfqId=temp[1];
    $list=$("#poItems");
    console.log(id);
    $.each(itemSet, function(i, item){
        if(String(item.id)==itemId && String(item.rfq)==rfqId){
            console.log("macthed",id);
            html=poItemHTML(item);
            $list.append(html);
            document.getElementById(param.id).style.display="none";
            selectedItems.push(param.id);
        }
        else{}
    });
}
function removeItemFromSelected(param){
    id=param.id;
    item=id.replace("removeItem","item");
    const index = selectedItems.indexOf(item);
    if (index > -1) { // only splice array when item is found
        selectedItems.splice(index, 1); // 2nd parameter means remove one item only
    }
    listItem=id.replace("removeItem","listItem");
    document.getElementById(listItem).style.display="none";
    console.log(selectedItems);
    searchRfqOfferPartNo();
}
function addSelectedPOItemsHTML(partNo,category,id,quantity,priceId,discountId){
    html='<div><p>'+partNo+'</p></div>'+
    '<div><p>'+category+'</p></div>'+
    "<div><input type='text' id='"+id+"' placeholder='Enter Quantity' value='"+quantity+"'></div>"+
    "<div><input type='text' id='"+priceId+"' placeholder='Enter Quantity'></div>"+
    "<div><input type='text' id='"+discountId+"' placeholder='Enter Discount'></div>"
    return html
}
function addSelectedPOItemsAmendedHTML(partNo,category,id,quantity,priceId,discountId){
    html='<div><p>'+partNo+'</p></div>'+
    '<div><p>'+category+'</p></div>'+
    "<div><input type='text' id='"+id+"' placeholder='Enter Quantity' value='"+quantity+"'></div>"+
    "<div><input type='text' id='"+priceId+"' placeholder='Enter Quantity'></div>"+
    "<div><input type='text' id='"+discountId+"' placeholder='Enter Discount'></div>"
    return html
}
function addSelectedPOItems(){
    document.getElementById("addedPOItems").innerHTML="";
    document.getElementById("myModal").style.display="none";
    $addedPOItems=$("#addedPOItems");
    console.log(selectedItems);
    $.each(selectedItems, function(i, item){
        id=item;
        temp=id.split("rfq");
        itemId=temp[0].replace("item","");
        rfqId=temp[1];
        category="";
        partNo="";
        quantity=0;
        console.log(itemSet);
        $.each(itemSet, function(i, data){
            if(String(data.id)==itemId && String(data.rfq)==rfqId){
                category=data.category;
                partNo=data.partNo;
                quantity=data.quantity;
            }
            else{}
        });
        tempId=item+'value'
        tempId2=item+'price'
        tempId3=item+'discount'
        html=addSelectedPOItemsHTML(partNo,category,tempId,quantity,tempId2,tempId3);
        $addedPOItems.append(html);
    });
}
function addSelectedPOItemsAmended(){
    document.getElementById("addedPOItems").innerHTML="";
    document.getElementById("myModal").style.display="none";
    $addedPOItems=$("#addedPOItems");
    console.log(selectedItems);
    $.each(selectedItems, function(i, item){
        id=item;
        temp=id.split("rfq");
        itemId=temp[0].replace("item","");
        rfqId=temp[1];
        category="";
        partNo="";
        quantity=0;
        price=0
        console.log(itemSet);
        $.each(itemSet, function(i, data){
            if(String(data.rfq)==rfqId && String(data.poId)==String(localStorage.getItem("poId"))){
                category=data.category;
                partNo=data.partNo;
                quantity=data.quantity;
            }
            else{}
        });
        tempId=item+'value'
        tempId2=item+'price'
        tempId3=item+'discount'
        html=addSelectedPOItemsAmendedHTML(partNo,category,tempId,quantity,tempId2,tempId3);
        //html=addSelectedPOItemsHTML(partNo,category,tempId,quantity,tempId2,tempId3);
        $addedPOItems.append(html);
    });
}
function addPO(){
    console.log("access")
    ids=['no','date','delivery','customer']
    priceIds=[]
    valuesIds=[]
    discounts=[]
    $.each(selectedItems, function(i, item){
        ids.push(item+'value');
        ids.push(item+'price');
        ids.push(item+'discount');
        valuesIds.push(item+'value');
        priceIds.push(item+'price');
        discounts.push(item+'discount');
    });
    errors=[]
    $.each(ids, function(i, id){
        if(document.getElementById(id).value && document.getElementById(id).value!="select"){
            document.getElementById(id).style.borderColor="grey";
        }
        else{errors.push(id)}
    });
    if(errors.length == 0){
        data={}
        tempIds=['no','date','delivery','customer']
        tempIds2=ids;
        console.log(tempIds2)
        $.each(tempIds, function(i, id){
            data[id]=document.getElementById(id).value;
        });
        quantity=[]
        itemIds=[]
        itemPrices=[]
        itemDiscounts=[]
        console.log(valuesIds)
        $.each(valuesIds, function(i, id){
            quantity.push(document.getElementById(id).value);
            itemPrices.push(document.getElementById(priceIds[i]).value);
            itemDiscounts.push(document.getElementById(discounts[i]).value);
            temp=id.split("rfq");
            itemId=temp[0].replace("item","");
            itemIds.push(itemId);
        });
        data["quantity"]=quantity;
        data["items"]=itemIds;
        data["prices"]=itemPrices;
        data["discounts"]=itemDiscounts;
        postData=JSON.stringify(data)
        request=url+"/api/aviation/addPO/"
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            // url : 'http://127.0.0.1:8081/api/allusers/'+'20',
            data:postData,
            success: function(data){
                console.log(data);
                alert("PO Added Successfully!");
                window.location.href="pos.html";
            }
        });
    }
    else{
        $.each(errors, function(i, id){document.getElementById(id).style.borderColor="red"});
    }
}
function posHTML(item){
    if(item.status=='amended'){tag="#5c5b5b"}
    else{tag="#467c46"}
    html='<div class="poTag" style="background:'+tag+';"><div id="card'+item.id+'" onclick="showPODetails(this)" class="basic-card basic-card-aqua">'+
    '<div class="card-content">'+
        '<span class="card-title">'+item.customer+'</span>'+
        '<p class="card-text">'+
            '<ul>'+
                '<li>Customer PO No: '+item.number+'<span id="poNumber"></span></li>'+
                '<li>Customer PO Date: '+item.date+'<span id="poNumber"></span></li>'+
                '<li>Total Items:<span id="poNumber'+item.id+'"></span></li>'+
                '<li>PO Total Amount: '+item.totalAmount+'<span id="poNumber"></span></li>'+
                '<li>PO Status: '+item.status.toUpperCase()+'<span id="poNumber"></span></li>'+
            '</ul>'+
        '</p>'+
    '</div>'+
    '<div class="card-link">'+
    '<div class="partsDescription">'+
        '<table class="parts" id="poItems'+item.id+'">'+
        '<tr>'+
        '<th>Part No</th>'+
        '<th>Nomenclature</th>'+
        '<th>Reference</th>'+
        '<th>Qty</th>'+
        '<th>Unit Price</th>'+
        '<th>OC Status</th>'+
        '</tr>'+     
        '</table>'+
    '</div>'+
    '</div>'+
    '</div></div>'
    return html
}
function poItemsTableHTML(item){
    html='<tr>'+
    '<td>'+item.partNo+'</td>'+
    '<td>'+item.nomenclature+'</td>'+
    '<td>'+item.reference+'</td>'+
    '<td>'+item.quantity+'</td>'+
    '<td>'+item.price+'</td>'+
    '<td>'+item.status+'</td>'+
    '</tr>'
    return html
}
function poItemsDetailTableHTML(item){
    html='<tr>'+
    '<td>'+item.partNo+'</td>'+
    '<td>'+item.nomenclature+'</td>'+
    '<td>'+item.reference+'</td>'+
    '<td>'+item.quantity+'</td>'+
    '<td>'+item.price+'</td>'+
    '<td>'+item.status+'</td>'+
    '<td>'+item.discountPercent+'</td>'+
    '<td>'+item.discountAmount+'</td>'+
    '</tr>'
    return html
}
function loadPOs(){
    // console.log("access");
    document.getElementById("department").innerHTML=localStorage.getItem("department").toUpperCase();
    const email=localStorage.getItem("email");
    let name=email.split("@");
    document.getElementById("user-name").innerHTML=name[0];
    let width = screen.width;
    if(width<=1600){
        let options=document.getElementById("menubar").innerHTML;
        document.getElementById("menubar").innerHTML="<button onclick='showMenubar()' style='box-shadow: none;border: none;'><img src='images/bars-solid.svg' height='30px'></button>";
        document.getElementById("menubarResponsive").innerHTML=options;
        document.getElementById("menubarResponsive").style.display="none";
        // document.getElementsByClassName("menubar").style.width="100%";
        document.getElementById("customer").style.display="none";
    }else{}
    request=url+'/api/aviation/getAllPOs/';
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            $pos=$("#pos");
            $.each(data["pos"], function(i, item){
                html=posHTML(item);
                $pos.append(html);
                $items=$('#poItems'+item.id)
                count=0;
                $.each(data["items"], function(j, item2){
                    if(item.number==item2.poNumber){
                        console.log("item")
                        html2=poItemsTableHTML(item2);
                        $items.append(html2);
                        count+=1;
                    }else{}
                });
                document.getElementById("poNumber"+item.id).innerHTML=count;
            });
        }
    });
}
function goToSignIn(){
    window.location.href="signInForm.html";
}
function signOut(){
    localStorage.clear();
    window.location.href="landingPage.html";
}
function searchPO(){
    search=document.getElementById("search").value;
    if(search.length==0){
        document.getElementById("pos").innerHTML="";
        loadPOs();
    }
    else if(search.length>=2){
        document.getElementById("pos").innerHTML="";
        request=url+'/api/aviation/searchPO/'+search;
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'GET',
            url: request,
            success: function(data){
                $pos=$("#pos");
                $.each(data["pos"], function(i, item){
                    html=posHTML(item);
                    $pos.append(html);
                    $items=$('#poItems'+item.id)
                    count=0;
                    $.each(data["items"], function(j, item2){
                        if(item.number==item2.poNumber){
                            console.log("item")
                            html2=poItemsTableHTML(item2);
                            $items.append(html2);
                            count+=1;
                        }else{}
                    });
                    document.getElementById("poNumber"+item.id).innerHTML=count;
                });
            }
        });
    }
    else{
    }
}
function showPODetails(param){
    document.getElementById("myModal").style.display="block";
    id=param.id;
    id=id.replace("card","");
    request=url+'/api/aviation/getPODetail/'+id;
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            document.getElementById("poDetailsNo").innerHTML=data["po"]["number"];
            document.getElementById("poDetailsDate").innerHTML=data["po"]["date"];  
            document.getElementById("poDetailsDelivery").innerHTML=data["po"]["delivery"];    
            document.getElementById("poDetailsItemAmount").innerHTML=data["po"]["totalAmount"];
            document.getElementById("poDetailsCustomer").innerHTML=data["po"]["customer"];
            $table=$("#poDetailsItem");
            document.getElementById("poDetailsItem").innerHTML="";
            html="<tr><th>Part No</th><th>Nomenclature</th><th>Reference</th><th>Qty</th><th>Unit Price</th><th>OC Status</th><th>Discount Percent</th><th>Discount Amount</th></tr> "
            $table.append(html);
            count=0
            $.each(data["items"], function(j, item){
                html=poItemsDetailTableHTML(item);
                $table.append(html);
                count+=1;
            });
            document.getElementById("poDetailsTotal").innerHTML=count;
            document.getElementById("amendPODiv").innerHTML="";
            $('#amendPODiv').append('<button id="amend'+data["po"]["id"]+'" onclick="amendPOForm(this)" class="amendPO">AMEND</button>');
            console.log(data);
        }
    });
}
function closePODetail(){
    document.getElementById("myModal").style.display="none";
}
function reviseOffer(param){
    id=param.id;
    id=id.replace("revise","");
    localStorage.setItem("offerId",id);
    window.location.href="editOfferForm.html";
}
function loadEditOfferForm(){
    id=localStorage.getItem("offerId");
    request=url+'/api/aviation/getOffer/'+id;
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            console.log(data);
            document.getElementById("offerNo").value=data["response"]["offerNumber"];
            document.getElementById("offerDate").value=data["response"]["date"];
            document.getElementById("validityDate").value=data["response"]["validity"];
            document.getElementById("alternatePart").value=data["response"]["alternate"];
            document.getElementById("qty").value=data["response"]["quantity"];
            document.getElementById("unitPrice").value=data["response"]["price"];
            document.getElementById("offerDiscount").value=data["response"]["discount"];
            document.getElementById("offerFreightCharges").value=data["response"]["offerFrieghtChargersPercentage"];
            document.getElementById("deliveryDate").value=data["response"]["deliveryDateAsPerLHDOffer"];
        }
    });
}
function reviseOfferSubmit(){
    ids=["offerNo","offerDate","validityDate","alternatePart","qty","unitPrice","offerDiscount","offerFreightCharges","deliveryDate"]
    errors=[]
    itemStatus=true
    $.each(ids, function(i, item){
        temp=document.getElementById(item).value;
        if(temp){
            document.getElementById(item).style.borderColor="grey";
        }
        else{
            errors.push(item)
            itemStatus=false
        }
    });
    if(itemStatus){
        unitPrice=document.getElementById("unitPrice").value;
        offerDiscount=document.getElementById("offerDiscount").value;
        offerFreightCharges =document.getElementById("offerFreightCharges").value;
        qty=document.getElementById("qty").value;
        currentUnitPrice=0
        finalPrice=0
        if(offerDiscount=="0" || offerDiscount==0){
        }
        else{
            temp=(parseFloat(offerDiscount)/100)*parseFloat(unitPrice);
            currentUnitPrice=parseFloat(unitPrice)-temp;
        }
        if(offerFreightCharges =="0" || offerFreightCharges ==0){
            document.getElementById("qty").style.borderColor="red";
        }
        else{
            temp=(parseFloat(offerFreightCharges)/100)*currentUnitPrice
            currentUnitPrice=currentUnitPrice+temp;
        }
        if(qty==0 || qty=="0"){
            document.getElementById("qty").style.borderColor="red";
        }
        else{
            finalPrice=currentUnitPrice*parseInt(qty);
            // console.log(finalPrice);
        }
        data={"id":localStorage.getItem("offerId"),"finalPrice":finalPrice}
        //data={"finalPrice":finalPrice,"partNo":localStorage.getItem("partNo"),"rfqNo":localStorage.getItem("rfqNo")}
        $.each(ids, function(i, item){
            data[item]=document.getElementById(item).value;
        });
        // data["rfqType"]=localStorage.getItem("rfqType");
        postData=JSON.stringify(data);
        request=url+'/api/aviation/reviseOffer/';
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            data:postData,
            success: function(data){
                alert("Offer Successfully Updated!")
                window.location.href="RFQs.html"
            }
        });
    }
    else{
        $.each(errors, function(i, item){
            document.getElementById(item).style.borderColor="red";
        });
    }
}
function amendPOForm(param){
    id=param.id;
    id=id.replace("amend","");
    localStorage.setItem("poId",id);
    window.location.href="amendPOForm.html";
}
function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].text== valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}
function loadAmendPOForm(){
    id=localStorage.getItem("poId");
    console.log(id);
    request=url+'/api/aviation/getPO/'+id;
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        type: 'GET',
        url: request,
        success: function(data){
            console.log(data);
            objSelect=document.getElementById("customer");
            setSelectedValue(objSelect, data["po"]["customer"]);
            document.getElementById("no").value=data["po"]["number"];
            document.getElementById("date").value=data["po"]["date"];
            document.getElementById("delivery").value=data["po"]["deliveryPeriod"];
            selectedItems=data["items"];
            loadPosAmendedForm();
        }
    });
}
function amendPO(){
    console.log("access")
    ids=['no','date','delivery','customer']
    priceIds=[]
    valuesIds=[]
    discounts=[]
    $.each(selectedItems, function(i, item){
        ids.push(item+'value');
        ids.push(item+'price');
        ids.push(item+'discount');
        valuesIds.push(item+'value');
        priceIds.push(item+'price');
        discounts.push(item+'discount');
    });
    errors=[]
    $.each(ids, function(i, id){
        if(document.getElementById(id).value && document.getElementById(id).value!="select"){
            document.getElementById(id).style.borderColor="grey";
        }
        else{errors.push(id)}
    });
    if(errors.length == 0){
        data={}
        tempIds=['no','date','delivery','customer']
        tempIds2=ids;
        console.log(tempIds2)
        $.each(tempIds, function(i, id){
            data[id]=document.getElementById(id).value;
        });
        quantity=[]
        itemIds=[]
        itemPrices=[]
        itemDiscounts=[]
        console.log(valuesIds)
        $.each(valuesIds, function(i, id){
            quantity.push(document.getElementById(id).value);
            itemPrices.push(document.getElementById(priceIds[i]).value);
            itemDiscounts.push(document.getElementById(discounts[i]).value);
            temp=id.split("rfq");
            itemId=temp[0].replace("item","");
            itemIds.push(itemId);
        });
        data["quantity"]=quantity;
        data["items"]=itemIds;
        data["prices"]=itemPrices;
        data["discounts"]=itemDiscounts;
        data["poId"]=localStorage.getItem("poId");
        postData=JSON.stringify(data)
        request=url+"/api/aviation/amendPO/"
        $.ajax({
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: request,
            // url : 'http://127.0.0.1:8081/api/allusers/'+'20',
            data:postData,
            success: function(data){
                console.log(data);
                alert("PO Amended Successfully!");
                window.location.href="pos.html";
            }
        });
    }
    else{
        $.each(errors, function(i, id){document.getElementById(id).style.borderColor="red"});
    }
}