from flask import Flask,jsonify,request
import mysql.connector as mysql
from cryptography.fernet import Fernet
from flask_cors import CORS
import json
from datetime import datetime
import random

app=Flask(__name__)
db_name = "AJCL"
db_password = "root"
db_user = "root"
db_host = "127.0.0.1"
key=b'i3vVJAiA2-e6JIBoTBwvmQNmTXvVhbr60p5jOYVRVws='

CORS(app)

def database():
    db = mysql.connect(host=db_host, user=db_user, passwd=db_password, database=db_name)
    cursor=db.cursor(buffered=True)
    return db,cursor

@app.route("/api/aviation/",methods=["GET","POST"])
def home():
    return jsonify({"response":"access"})

@app.route("/api/aviation/getAllUsers/",methods=["GET","POST"])
def getAllUsers():
    db,cursor = database()
    query="select * from usersData"
    cursor.execute(query)
    result=cursor.fetchall()
    return jsonify({"response":result})

@app.route("/api/aviation/registerUser/",methods=["GET","POST"])
def registerUser():
    db,cursor = database()
    data=request.form
    if data:
        query1="select * from usersData where email=%s"
        cursor.execute(query1,(data["email"],))
        result1=cursor.fetchone()
        print(result1)
        if result1:return jsonify({"response":"Email Already Exist"})
        else:
            password=data["password"].encode()
            f = Fernet(key)
            encryptedPassword = f.encrypt(password)
            query2="insert into usersData(email,department,password,authKey) values(%s,%s,%s,%s)"
            cursor.execute(query2,(data["email"],data["department"],encryptedPassword,data["authCode"]))
            db.commit()
            return "<script>alert('Employee Registered Successfully');location.reload();</script>"
    else:return jsonify({"response":"Invalid Information"})

@app.route("/api/aviation/login/",methods=["GET","POST"])
def login():
    db,cursor = database()
    data=request.get_data().decode()
    data = json.loads(data)
    print(data["email"])
    if data:
        query1="select * from usersData where email=%s and authKey=%s"
        cursor.execute(query1,(data["email"],data["authCode"]))
        result1=cursor.fetchone()
        if result1:
            password=bytes(result1[3], 'utf-8')
            f = Fernet(key)
            passw = f.decrypt(password)
            passw=passw.decode("utf-8")
            if passw==data["password"]:return jsonify({"response":"success","department":str(result1[2])})
            else:return jsonify({"response":"Incorrect Password"})
        else:return jsonify({"response":"Invalid Email or Password"})
    else:return jsonify({"response":"Invalid Email or Password"})

@app.route("/api/aviation/getUserInfo/<email>",methods=["GET","POST"])
def getUserInfo(email):
    db,cursor = database()
    query1="select email,department,post,name,age,loc from usersData where email=%s"
    cursor.execute(query1,(email,))
    result=cursor.fetchone()
    response={}
    if result:
        response={"email":result[0],"department":result[1],"post":result[2],"name":result[3],"age":result[4],"loc":result[5]}
    for k,v in enumerate(response):
        if response[v]=="":response[v]="--"
    return jsonify({"response":response})

def rfqCodeGenerator(customer):
    db,cursor = database()
    currentMonth = datetime.now().month
    currentYear = datetime.now().year
    temp=list(customer)
    temp2=[ord(i) for i in temp]
    code=""
    for i in temp2:code=code+str(i)
    temp3=random.randint(1000, 9999)
    code=code+str(temp3)+str(currentYear)+str(currentMonth)
    query="select id from rfq where rfqNoSG=%s"
    cursor.execute(query,(code,))
    result=cursor.fetchone()
    if result:rfqCodeGenerator(customer)
    else:return code

@app.route("/api/aviation/addRFQ/",methods=["GET","POST"])
def addRFQ():
    db,cursor = database()
    data=request.get_data()
    data = json.loads(data)
    code=rfqCodeGenerator(data["customer"])
    query0="select id from rfq where rEQNumber=%s"
    cursor.execute(query0,(data["rfqNo"],))
    result=cursor.fetchone()
    if result:return jsonify({"response":"exist"})
    else:
        query="insert into rfq(rEQNumber,rEQCategory,rEQType,rEQDate,partNumber,partDescription,substitue,unitOfMeasurement,quantity,rFQStatus,deliveryDate,customer,rfqNoSG) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        values=(data["rfqNo"],data["rfqCategory"],data["rfqType"],data["reqDate"],data["partNo"],"","","",data["qty"],"Not Recieved",data["deliveryDate"],data["customer"],code)
        cursor.execute(query,values)
        db.commit()
        temp=data["partNo"].split(",")
        for i in temp:
            query2="insert into itemStatus(partNo, rfqNo, status) values(%s,%s,%s)"
            values2=(i,data["rfqNo"],"Not Recieved")
            cursor.execute(query2,values2)
            db.commit()
        return jsonify({"response":"sucess","code":str(code)})

@app.route("/api/aviation/getBOM/<customer>",methods=["GET","POST"])
def getBOM(customer):
    db,cursor = database()
    query="select id,partNo,nomenclature,customer from bom where customer=%s"
    cursor.execute(query,(customer,))
    result=cursor.fetchall()
    print(result)
    response=[]
    if result:
        for row in result:
            temp={"id":row[0],"partNo":row[1],"nomanclature":row[2],"customer":row[3]}
            response.append(temp)
    return jsonify({"response":response})

@app.route("/api/aviation/addItemToBOM/",methods=["GET","POST"])
def addItemToBOM():
    db,cursor = database()
    data=request.get_data().decode()
    data = json.loads(data)
    query0="select id from bom where partNo=%s"
    cursor.execute(query0,(data["partNo"],))
    result=cursor.fetchone()
    if result:
        return jsonify({"response":"exist"})
    else:
        query="insert into bom(partNo, nomenclature, unitOfMeasurement, alternatePartNo, unitPrice, currency, customer) values(%s,%s,%s,%s,%s,%s,%s)"
        cursor.execute(query,(data["partNo"],data["nomenclature"],data["uom"],data["alternate"],data["unitPrice"],data["currency"],data["company"]))
        db.commit()
        return jsonify({"response":"success"})
    return jsonify({"response":"success"})

@app.route("/api/aviation/getRFQs/",methods=["GET","POST"])
def getRFQs():
    db,cursor = database()
    query="select * from rfq order by id desc"
    cursor.execute(query)
    result=cursor.fetchall()
    response=[]
    items=[]
    if result:
        for row in result:
            rowtemp={"id":row[0], "rEQNumber":row[1], "rEQCategory":row[2], "rEQType":row[3], "rEQDate":row[4], "partNumber":row[5], "partDescription":row[6], "substitue":row[7], "unitOfMeasurement":row[8], "rFQStatus":row[9], "deliveryDate":row[10], "quantity":row[11],"customer":row[12],"rfqNoSG":row[13]}
            quantities=row[11].split(",")
            temp2=row[5].split(",")
            print(temp2)
            item={}
            temp4=[]
            count=0
            for id in temp2:
                query2="select partNo,nomenclature,id from bom where id=%s"
                cursor.execute(query2,(id,))
                result2=cursor.fetchone()
                temp3=[]
                if result2:
                    temp3.append(result2[0])
                    temp3.append(result2[1])
                    query3="select status from itemStatus where rfqNo=%s and partNo=%s"
                    cursor.execute(query3,(row[1],result2[2]))
                    result3=cursor.fetchone()
                    print(result3)
                    if result3:
                        temp3.append(result3[0])
                    temp3.append(quantities[count])
                    query4="select offerNumber,unitOfMeasure,quantity,price,id from offer where rfqNumber=%s and partNo=%s"
                    cursor.execute(query4,(row[1],result2[0]))
                    result4=cursor.fetchone()
                    if result4:
                        temp={"offerNumber":result4[0],"unitOfMeasure":result4[1],"quantity":result4[2],"price":result4[3],"id":result4[4]}
                        item[result2[0]]=temp
                    else:
                        item[result2[0]]="Not Recieved"
                    temp4.append(result2[0])
                try:item[row[1]].append(temp3)
                except:item[row[1]]=[temp3]
                count+=1
            items.append(item)
            rowtemp["itemSet"]=temp4
            response.append(rowtemp)
    return jsonify({"response":response,"items":items})

@app.route("/api/aviation/addOffer/",methods=["GET","POST"])
def addOffer():
    db,cursor = database()
    data=request.get_data().decode()
    data = json.loads(data)
    query0="select id,unitOfMeasurement from bom where partNo=%s"
    cursor.execute(query0,(data["partNo"],))
    result0=cursor.fetchone()
    if result0:
        if data["rfqType"]=="ro":
            discount=((float(data["offerDiscount"])/100)*float(data["unitPrice"]))
        else:
            discount=((float(data["offerDiscount"])/100)*float(data["unitPrice"]))*int(data["qty"])
        discountPrice=float(data["unitPrice"])-((float(data["offerDiscount"])/100)*float(data["unitPrice"]))
        offerFreightCharges=(float(data["offerFreightCharges"])/100)*discountPrice
        offerFrieghtChargersWithUnitPrice=offerFreightCharges+discountPrice
        query="insert into offer(offerNumber, date, validity, alternate, quantity, unitOfMeasure, price, totalAmount, discount, discountPercentage, offerFrieghtChargers, offerFrieghtChargersPercentage, offerFinalPrice, offerUnitPriceWithFreight, deliveryDateAsPerLHDOffer, status, rfqNumber, partNo) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        values=(data["offerNo"],data["offerDate"],data["validityDate"],data["alternatePart"],data["qty"],result0[1],data["unitPrice"],data["finalPrice"],discount,data["offerDiscount"],offerFreightCharges,data["offerFreightCharges"],data["finalPrice"],offerFrieghtChargersWithUnitPrice,str(data["deliveryDate"]),"Not Recieved",data["rfqNo"],data["partNo"])
        cursor.execute(query,values)
        db.commit()
        query3="update itemStatus set status=%s where partNo=%s and rfqNo=%s"
        cursor.execute(query3,("Recieved",result0[0],data["rfqNo"]))
        db.commit()
    return jsonify({"response":"success"})

@app.route("/api/aviation/searchRFQ/",methods=["GET","POST"])
def searchRFQ():
    db,cursor = database()
    data=request.get_data().decode()
    data = json.loads(data)
    fields=["rEQNumber","rEQCategory","rEQType","rEQDate","deliveryDate","rfqNoSG","customer",'rfqNoSG']
    query0="select * from rfq where "
    count=0
    for i in fields:
        if(len(fields)==count+1):
            query0=query0+str(i)+" like '%"+data['search']+"%' order by id desc"
        else:
            query0=query0+str(i)+" like '%"+data['search']+"%' or "
        count+=1
    cursor.execute(query0)
    result=cursor.fetchall()
    response=[]
    items=[]
    query1="select id from bom where partNo like '%"+data['search']+"%' or nomenclature like '%"+data['search']+"%'"
    cursor.execute(query1)
    result2=cursor.fetchall()
    if result2:
        for i in result2:
            query3="select * from rfq where partNumber like '%"+str(i[0])+"%' order by id desc"
            cursor.execute(query3)
            result3=cursor.fetchall()
            result=result+result3
    query4="select rfqNo from itemStatus where status like '%"+data['search']+"%'"
    cursor.execute(query4)
    result4=cursor.fetchall()
    if result4:
        for i in result4:
            query5="select * from rfq where rEQNumber=%s order by id desc"
            cursor.execute(query5,(i[0],))
            result5=cursor.fetchall()
            result=result+result5
            print(result4)
    print(type(result))
    if result:
        result=[tuple(i) for i in result]
        result=tuple(result)
        result=tuple(set(result))
        for row in result:
            rowtemp={"id":row[0], "rEQNumber":row[1], "rEQCategory":row[2], "rEQType":row[3], "rEQDate":row[4], "partNumber":row[5], "partDescription":row[6], "substitue":row[7], "unitOfMeasurement":row[8], "rFQStatus":row[9], "deliveryDate":row[10], "quantity":row[11],"customer":row[12],"rfqNoSG":row[13]}
            quantities=row[11].split(",")
            temp2=row[5].split(",")
            print(temp2)
            item={}
            temp4=[]
            count=0
            for id in temp2:
                query2="select partNo,nomenclature,id from bom where id=%s"
                cursor.execute(query2,(id,))
                result2=cursor.fetchone()
                temp3=[]
                if result2:
                    temp3.append(result2[0])
                    temp3.append(result2[1])
                    query3="select status from itemStatus where rfqNo=%s and partNo=%s"
                    cursor.execute(query3,(row[1],result2[2]))
                    result3=cursor.fetchone()
                    print(result3)
                    if result3:
                        temp3.append(result3[0])
                    temp3.append(quantities[count])
                    query4="select offerNumber,unitOfMeasure,quantity,price from offer where rfqNumber=%s and partNo=%s"
                    cursor.execute(query4,(row[1],result2[0]))
                    result4=cursor.fetchone()
                    if result4:
                        temp={"offerNumber":result4[0],"unitOfMeasure":result4[1],"quantity":result4[2],"price":result4[3]}
                        item[result2[0]]=temp
                    else:
                        item[result2[0]]="Not Recieved"
                    temp4.append(result2[0])
                try:item[row[1]].append(temp3)
                except:item[row[1]]=[temp3]
                count+=1
            items.append(item)
            rowtemp["itemSet"]=temp4
            response.append(rowtemp)
    return jsonify({"response":response,"items":items})

@app.route("/api/aviation/getRfqOfferItems/<customer>",methods=["GET","POST"])
def getRfqOfferItems(customer):
    db,cursor = database()
    query="select partNo,status,rfqNo,id from itemStatus where status=%s or status=%s"
    cursor.execute(query,('Recieved','Not Recieved'))
    result=cursor.fetchall()
    response=[]
    if result:
        for row in result:
            query="select id,partNo,nomenclature,customer from bom where id=%s"
            cursor.execute(query,(row[0],))
            result2=cursor.fetchone()
            if result2:
                category=""
                if result2[3]==customer:
                    if row[1]=='Recieved':
                        category='Offer'
                        query3="select quantity from offer where partNo=%s and rfqNumber=%s"
                        cursor.execute(query3,(result2[1],row[2]))
                        result3=cursor.fetchone()
                        if result3:pass
                        else:
                            category='RFQ'
                            result3=[0]
                    else:
                        category='RFQ'
                        result3=[0]
                    print(row)
                    print(result)
                    print(result2)
                    print(result3)
                    temp={"id":row[3],"partNo":result2[1],"nomenclature":result2[2],"category":category,"rfq":row[2],"quantity":result3[0]}
                    response.append(temp)
                else:pass
    return jsonify({"response":response})

@app.route("/api/aviation/getRfqOfferItemsAmended/<customer>/<id>",methods=["GET","POST"])
def getRfqOfferItemsAmended(customer,id):
    db,cursor = database()
    query="select partNo,status,rfqNo,id,poId from itemStatus where poId=%s or poId=0"
    cursor.execute(query,(id,))
    result=cursor.fetchall()
    response=[]
    print(result)
    if result:
        for row in result:
            query="select id,partNo,nomenclature,customer from bom where id=%s"
            cursor.execute(query,(row[0],))
            result2=cursor.fetchone()
            if result2:
                category=""
                if result2[3]==customer:
                    if row[1]=='Recieved':
                        category='Offer'
                        query3="select quantity from offer where partNo=%s and rfqNumber=%s"
                        cursor.execute(query3,(result2[1],row[2]))
                        result3=cursor.fetchone()
                        if result3:pass
                        else:
                            category='RFQ'
                            result3=[0]
                    else:
                        category='RFQ'
                        result3=[0]
                    print(row)
                    print(result)
                    print(result2)
                    print(result3)
                    temp={"id":row[3],"partNo":result2[1],"nomenclature":result2[2],"category":category,"rfq":row[2],"quantity":result3[0],"poId":row[4]}
                    response.append(temp)
                else:pass
    return jsonify({"response":response})

@app.route("/api/aviation/addPO/",methods=["GET","POST"])
def addPO():
    db,cursor = database()
    data=request.get_data().decode()
    data = json.loads(data)
    print(data)
    totalAmount=0
    for i in range(len(data["quantity"])):
        print(data['discounts'][i])
        temp=(float(data['discounts'][i])/100)*float(data["prices"][i])
        totalAmount=totalAmount+(int(data["quantity"][i])*(float(data["prices"][i])-temp))
    query="insert into po(number,date,totalAmount,customer,deliveryPeriod) values(%s,%s,%s,%s,%s)"
    cursor.execute(query,(data['no'],data['date'],totalAmount,data['customer'],data["delivery"]))
    db.commit()
    query0="select id from po order by id desc limit 1"
    cursor.execute(query0)
    result0=cursor.fetchone()
    count=0
    for i in data["items"]:
        query="select partNo,rfqNo from itemStatus where id=%s"
        cursor.execute(query,(int(i),))
        result=cursor.fetchone()
        if result:
            query="select partNo,nomenclature from bom where id=%s"
            cursor.execute(query,(result[0],))
            result2=cursor.fetchone()
            discount=(float(data['discounts'][count])/100)*float(data["prices"][count])
            query="insert into poItems(poNumber, partNo, nomenclature, quantity, reference, price, status, discountAmount,discountPercent) values(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            values=(data["no"],result2[0],result2[1],data['quantity'][count],result[1],float(data['prices'][count])-discount,'Not Recieved',discount,float(data['discounts'][count]))
            cursor.execute(query,values)
            db.commit()
            query="update itemStatus set status=%s,poId=%s where id=%s"
            cursor.execute(query,("PO Recieved",result0[0],i))
            db.commit()
        count+=1
    print(totalAmount)
    return jsonify({"response":data})

@app.route("/api/aviation/getAllPOs/",methods=["GET","POST"])
def getAllPOs():
    db,cursor = database()
    query="select * from po"
    cursor.execute(query)
    result=cursor.fetchall()
    po=[]
    items=[]
    if result:
        for row in result:
            temp={"id":row[0], "number":row[1], "date":row[2], "totalAmount":row[3],"customer":row[4],"status":row[5]}
            po.append(temp)
    query2="select * from poItems"
    cursor.execute(query2)
    result2=cursor.fetchall()
    if result2:
        count=0
        for row2 in result2:
            temp2={"id":row2[0], "poNumber":row2[1], "partNo":row2[2], "nomenclature":row2[3], "quantity":row2[4], "reference":row2[5], "price":row2[6], "status":row2[7]}
            items.append(temp2)
            count+=1
    return jsonify({"pos":po,"items":items})

@app.route("/api/aviation/searchPO/<search>",methods=["GET","POST"])
def searchPO(search):
    db,cursor = database()
    query="select DISTINCT(number) from po where number like %s or date like %s or customer like %s or number in (select poNumber from poItems where partNo like %s or status like %s or reference like %s or nomenclature like %s);"
    values=("%"+search+"%","%"+search+"%","%"+search+"%","%"+search+"%","%"+search+"%","%"+search+"%","%"+search+"%")
    cursor.execute(query,values)
    result=cursor.fetchall()
    print(result)
    po=[]
    items=[]
    if result:
        for row0 in result:
            print(row0)
            query="select * from po where number=%s"
            cursor.execute(query,(row0[0],))
            result=cursor.fetchall()
            if result:
                for row in result:
                    temp={"id":row[0], "number":row[1], "date":row[2], "totalAmount":row[3],"customer":row[4],"status":row[5]}
                    po.append(temp)
            query2="select * from poItems where poNumber=%s"
            cursor.execute(query2,(row0[0],))
            result2=cursor.fetchall()
            if result2:
                count=0
                for row2 in result2:
                    temp2={"id":row2[0], "poNumber":row2[1], "partNo":row2[2], "nomenclature":row2[3], "quantity":row2[4], "reference":row2[5], "price":row2[6], "status":row2[7]}
                    items.append(temp2)
                    count+=1
    return jsonify({"pos":po,"items":items})

@app.route("/api/aviation/getPODetail/<id>",methods=["GET","POST"])
def getPODetails(id):
    db,cursor = database()
    query="select * from po where id=%s"
    cursor.execute(query,(id,))
    result=cursor.fetchone()
    po={"id":result[0], "number":result[1], "date":result[2], "totalAmount":result[3], "customer":result[4],"delivery":result[6]}
    query="select * from poItems where poNumber=%s"
    cursor.execute(query,(result[1],))
    result2=cursor.fetchall()
    items=[]
    if result2:
        for row in result2:
            temp2={"id":row[0], "poNumber":row[1], "partNo":row[2], "nomenclature":row[3], "quantity":row[4], "reference":row[5], "price":row[6], "status":row[7],"discountPercent":row[8],"discountAmount":row[9]}
            items.append(temp2)
    return jsonify({"po":po,"items":items})

@app.route("/api/aviation/getPO/<id>",methods=["GET","POST"])
def getPO(id):
    db,cursor = database()
    query="select * from po where id=%s"
    cursor.execute(query,(id,))
    result=cursor.fetchone()
    print(result)
    po={"id":result[0], "number":result[1], "date":str(result[2]), "totalAmount":result[3], "customer":result[4],"deliveryPeriod":str(result[6])}
    query2="select partNo,reference from poItems where poNumber=%s"
    cursor.execute(query2,(result[1],))
    result2=cursor.fetchall()
    items=[]
    if result2:
        for row in result2:
            print(row)
            query3="select id from itemStatus where partNo in (select id from bom where partNo=%s);"
            cursor.execute(query3,(row[0],))
            result3=cursor.fetchone()
            if result3:
                items.append("item"+str(result3[0])+"rfq"+str(row[1]))
    return jsonify({"po":po,"items":items})

@app.route("/api/aviation/getOffer/<id>",methods=["GET","POST"])
def getOffer(id):
    db,cursor = database()
    query="select * from offer where id=%s"
    cursor.execute(query,(id,))
    result=cursor.fetchone()
    if result:
        response={"id":result[0], "offerNumber":result[1], "date":result[2], "validity":result[3], "alternate":result[4], "quantity":result[5], "unitOfMeasure":result[6], "price":result[7], "totalAmount":result[8], "discountPercentage":result[9], "discount":result[10], "offerFrieghtChargers":result[11], "offerFrieghtChargersPercentage":result[12], "offerFinalPrice":result[13], "offerUnitPriceWithFreight":result[14], "deliveryDateAsPerLHDOffer":result[15], "status":result[16], "rfqNumber":result[17], "partNo":result[18]}
        return jsonify({"response":response})
    else:jsonify({"response":""})

@app.route("/api/aviation/reviseOffer/",methods=["GET","POST"])
def reviseOffer():
    db,cursor = database()
    data=request.get_data().decode()
    data = json.loads(data)
    query4="select partNo,rfqNumber from offer where id=%s"
    cursor.execute(query4,(data["id"],))
    result4=cursor.fetchone()
    query5="select rEQType from rfq where rEQNumber=%s"
    cursor.execute(query5,(result4[1],))
    result5=cursor.fetchone()
    query0="select id,unitOfMeasurement from bom where partNo=%s"
    cursor.execute(query0,(result4[0],))
    result0=cursor.fetchone()
    if result0:
        if result5[0]=="ro":
            discount=((float(data["offerDiscount"])/100)*float(data["unitPrice"]))
        else:
            discount=((float(data["offerDiscount"])/100)*float(data["unitPrice"]))*int(data["qty"])
        discountPrice=float(data["unitPrice"])-((float(data["offerDiscount"])/100)*float(data["unitPrice"]))
        offerFreightCharges=(float(data["offerFreightCharges"])/100)*discountPrice
        offerFrieghtChargersWithUnitPrice=offerFreightCharges+discountPrice
        columns=["offerNumber", "date", "validity", "alternate", "quantity", "unitOfMeasure", "price", "totalAmount", "discount", "discountPercentage", "offerFrieghtChargers", "offerFrieghtChargersPercentage", "offerFinalPrice", "offerUnitPriceWithFreight", "deliveryDateAsPerLHDOffer", "status", "rfqNumber", "partNo"]
        query="update offer set "
        for i in columns:
            if i=="partNo":
                query=query+i+"=%s "
            else:
                query=query+i+"=%s,"
        query=query+"where id=%s"
        print(query)
        values=(data["offerNo"],data["offerDate"],data["validityDate"],data["alternatePart"],data["qty"],result0[1],data["unitPrice"],data["finalPrice"],discount,data["offerDiscount"],offerFreightCharges,data["offerFreightCharges"],data["finalPrice"],offerFrieghtChargersWithUnitPrice,str(data["deliveryDate"]),"Not Recieved",result4[1],result4[0],data["id"])
        cursor.execute(query,values)
        db.commit()
        # query3="update itemStatus set status=%s where partNo=%s and rfqNo=%s"
        # cursor.execute(query3,("Recieved",result0[0],data["rfqNo"]))
        # db.commit()
    return jsonify({"response":"success"})

@app.route("/api/aviation/amendPO/",methods=["GET","POST"])
def amendPO():
    db,cursor = database()
    data=request.get_data().decode()
    data = json.loads(data)
    print(data)
    totalAmount=0
    for i in range(len(data["quantity"])):
        print(data['discounts'][i])
        temp=(float(data['discounts'][i])/100)*float(data["prices"][i])
        totalAmount=totalAmount+(int(data["quantity"][i])*(float(data["prices"][i])-temp))
    query="update po set number=%s,date=%s,totalAmount=%s,customer=%s,status=%s,deliveryPeriod=%s where id=%s"
    cursor.execute(query,(data['no'],data['date'],totalAmount,data['customer'],"amended",data['delivery'],data['poId']))
    db.commit()
    count=0
    for i in data["items"]:
        query="select partNo,rfqNo from itemStatus where id=%s"
        cursor.execute(query,(int(i),))
        result=cursor.fetchone()
        if result:
            query="select partNo,nomenclature from bom where id=%s"
            cursor.execute(query,(result[0],))
            result2=cursor.fetchone()
            discount=(float(data['discounts'][count])/100)*float(data["prices"][count])
            query0="delete from poItems where partNo=%s and poNumber = (select poNumber from po where id=%s) "
            cursor.execute(query0,(result2[0],data["poId"]))
            db.commit()
            query="insert into poItems(poNumber, partNo, nomenclature, quantity, reference, price, status, discountAmount,discountPercent) values(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            values=(data["no"],result2[0],result2[1],data['quantity'][count],result[1],float(data['prices'][count])-discount,'Not Recieved',discount,float(data['discounts'][count]))
            cursor.execute(query,values)
            db.commit()
            query="update itemStatus set status=%s,poId=%s where id=%s"
            cursor.execute(query,("PO Recieved",data['poId'],i))
            db.commit()
        count+=1
    print(totalAmount)
    return jsonify({"response":data})
    

if __name__=="__main__":
    app.run(port=7700,debug=True)
