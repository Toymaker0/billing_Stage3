import mysql from "mysql";
import cors from "cors";
import express from "express";
import cookie from "cookie-parser"
import path from "path"
const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookie());

// const db = mysql.createConnection({
//   host: "172.16.44.6",
//   user: "root",
//   password: "swift",
//   port: 3307,
//   database: "crud",
// });
const db = mysql.createConnection({
  host: "bomdd7gnh3ss46mfemdz-mysql.services.clever-cloud.com",
  user: "uff5hrylvhqsgfev",
  password: "REiYBESPpwJDKkI3fSyj",
  port: 3306,
  database: "bomdd7gnh3ss46mfemdz",
});


app.get('/AllUsers',async(req,res)=>{
  try {
      const sql="SELECT * FROM users_login where isblock=0";
      db.query(sql,(err,result)=>{
          if(err){
           return  res.json({message :'error inside server'})
          }
          else{
              return res.json(result)
          }
      })
  } catch (error) {
return res.json({error:error,locate:"/AllUsers"}) 
 }
})


app.post("/getUser", async (req, res) => {
  try {
    const sql = "SELECT * FROM users_login a,user_rights b where a.id=b.userId AND (a.id)=? AND a.isblock=0";

    db.query(sql, [req.body.id], (err, result) => {
      if (err) {
        return res.json({ message: "error inside server" });
      } else {
        return res.json(result);
      }
    });
  } catch (error) {
  return  res.json({error:error,locate:"/getUser"}) 

  }
});
app.post("/login", async (req, res) => {
  // const sql="INSERT INTO users_login (uName,pass) VALUES (?)"
  const sql = "SELECT * FROM users_login WHERE (uName)=(?)";
  try {
    db.query(sql, [req.body.username], (err, result) => {
      if (err) {
        return res.json({ message: "erron in login" });
      } else {
        if (result[0]) {
          if (result[0].pass == req.body.password) {
            const userId = result[0].id
            const sqltime = "INSERT INTO `timeing_table` (date,time,uid) VALUES(CURRENT_DATE,CURRENT_TIME,?)"
            const sqluser = "INSERT INTO `login_timing` (userId,timeId) VALUES(?,?)"
            db.query(sqltime, userId, (err1, result1) => {
              if (err) {

              }
              else if (result) {
                const val = [
                  userId, result1.insertId
                ]
                db.query(sqluser, val, (err2, result2) => {
                  if (err2) {

                  }
                  else if (result2) {

                  }
                })
              }
            })

            return res.json({ message: "Authurized", result });
          } else {
            return res.json({ message: "incorrect passsword" });
          }
        } else {
          return res.json({ message: "user not exist" });
        }
      }
    });
  } catch (error) {
    return  res.json({error:error,locate:"/login"}) 

  }
});
app.post('/createUser', async (req, res) => {
  try {
    const sqlUser = "INSERT INTO users_login (uName,pass) values (?,?)"
    const sqlRight = "INSERT INTO user_rights (userId,billingR,duplicateBillR,reportR,userManagementR,passwordR) values (?,?,?,?,?,?)"
    const value1 = [
      req.body.uName,
      req.body.pass
    ]
  
    db.query(sqlUser, value1, async (err, result) => {
      if (err) {
        return res.json({ message: "error", err });
      }
      else if (result) {
        const val2 = [
          result.insertId,
          req.body.billingR,
          req.body.duplicateBillR,
          req.body.reportR,
          req.body.userManagementR,
          req.body.passwordR,
        ]
        db.query(sqlRight, val2, async (err, result) => {
          if (err) {
  
          }
          else {
  
          }
        })
        return res.json({ message: 'User Added' })
      }
    })
  } catch (error) {
    return  res.json({error:error,locate:"/createUser"}) 

  }
 
})
app.post('/updateUser', (req, res) => {
  try {
    const sqlUser = "UPDATE users_login SET uName=? WHERE id=?"
  const sqlRight = "UPDATE `user_rights` SET billingR=?,duplicateBillR=?,reportR=?,userManagementR=?,passwordR=? WHERE userId=?"
  const val1 = [
    req.body.userDetails.uName,
    req.body.userDetails.userId
  ]
  const val2 = [
    req.body.userDetails.billingR,
    req.body.userDetails.duplicateBillR,
    req.body.userDetails.reportR,
    req.body.userDetails.userManagementR,
    req.body.userDetails.passwordR,
    req.body.userDetails.userId
  ]
  db.query(sqlUser, val1, (err, result) => {
    if (err) {
      //console.log(err);
    }
    else if (result) {
      if (result) {
        db.query(sqlRight, val2, (err, result1) => {
          if (err) {
            // console.log(err);            
          }
          else if (result1) {
            //console.log(result1);
          }
        })
      }
      res.json({ message: 'user updated', result })
    }
  })
  } catch (error) {
    return  res.json({error:error,locate:"/updateUser"}) 

  }
})
app.post('/checkblock', (req, res) => {
  try {
    const sql = "UPDATE `users_login` SET  isblock=? WHERE id=?;"
  const val = [
    req.body.block,
    req.body.id
  ]
  db.query(sql, val, (err, result) => {
    if (err) {
    }
    else if (result) {
      res.json({ message: 'success' })
    }
  })
  } catch (error) {
    return  res.json({error:error,locate:"/checkblock"}) 
  }
})
app.post('/addUnit', (req, res) => {
  try {
    const userId = req.body.userId;
  const unit = req.body.unit
  const sql = "INSERT INTO units (unit_name,timeId) values (?,?)"
  const sqltime = "INSERT INTO `timeing_table` (date,time,uid) VALUES(CURRENT_DATE,CURRENT_TIME,?)"
  db.query(sqltime, userId, (err, resultT) => {
    if (err) {
      console.log(err);
    }
    else if (resultT) {
      const timeId = resultT.insertId
      const val = [
        unit, timeId
      ]
      db.query(sql, val, (errD, result1) => {
        if (errD) {
          return res.json({ message: 'error', errD })
        }
        else {
          return res.json({ message: 'success', result1 })
        }
      })
    }
  })
  } catch (error) {
    return  res.json({error:error,locate:"/addUnit"}) 

  }

})
app.get('/FetchUnits', (req, res) => {
  try {
    const sql = "SELECT * FROM units WHERE isblock=0"
  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: 'error' })
    }
    else if (result) {
      return res.json({ message: 'success', result })
    }
  })
  } catch (error) {
    return  res.json({error:error,locate:"/FetchUnits"}) 

  }
})
app.get('/FetchProd', (req, res) => {
 try {
  const sql = " SELECT a.`id` AS prodId ,a.`prodName` AS prodName ,a.`unitId`,b.`Amt` ,C.`unit_name` FROM `prods`a,`prod_amt`b ,`units` C WHERE a.isValid=1 AND A.`unitId`=C.`id` AND b.isValid=1 AND a.`id`=b.`prodsId`"
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ message: "err", err })
    }
    else if (result) {
      res.json({ message: "success", result })
    }
  })
 } catch (error) {
  return  res.json({error:error,locate:"/FetchProd"}) 

 }
})
app.post('/blockUnit', (req, res) => {
 try {
  const userId = req.body.userId;
  const sqltime = "INSERT INTO `timeing_table` (date,time,uid) VALUES(CURRENT_DATE,CURRENT_TIME,?)"
  const sql = "UPDATE `units` SET  isblock=? , timeId=?  WHERE id=?;"
  db.query(sqltime,[userId], (errT, resultT) => {
    if (errT) {
      console.log(errT);
    }
    else if (resultT) {
      const timeId = resultT.insertId
      const val = [
        1, timeId, req.body.id
      ]
      db.query(sql, val, (err, result) => {
        if (err) {
          return res.json({ message: 'error', err })
        }
        else if (result) {
          return res.json({ message: "success", result })
        }
      })
    }
  })
 } catch (error) {
  return  res.json({error:error,locate:"/blockUnit"}) 
 }
}
)
app.post('/addprod', (req, res) => {
 try {
  const userId = req.body.userId
  const prodName = req.body.prodName
  const prodAmt = req.body.prodAmt
  const unitId = req.body.ProdUnitId
  const sql = "INSERT INTO `prods` (prodName,unitId,timeId) VALUES(?,?,?)"
  const sqltime = "INSERT INTO `timeing_table` (date,time,uid) VALUES(CURRENT_DATE,CURRENT_TIME,?)"
  const Amtsql = "INSERT INTO `prod_amt` (prodsId,Amt,timeId,isValid) VALUES(?,?,?,?)"
  db.query(sqltime, userId, (errI, resultI) => {
    if (errI) {
      console.log(errI);
    }
    else if (resultI) {
      const val = [
        prodName, unitId, resultI.insertId
      ]
      db.query(sql, val, (errP, resultP) => {
        if (errP) {
          res.json({ message: "err", errP })
        }
        else if (resultP) {
          const prodsId = resultP.insertId
          const valA = [
            prodsId, prodAmt, resultI.insertId, 1
          ]
          db.query(Amtsql, valA, (errA, resultA) => {
            if (errA) {
              return res.json({ message: "err", errA })
            }
            else if (resultA) {
              return res.json({ message: "success", resultA })
            }

          })
        }
      })
    }
  })
 } catch (error) {
  return  res.json({error:error,locate:"/addprod"}) 

 }
})
app.post('/EditProduct', (req, res) => {
 try {
  const prodId = req.body.prodId
  const prodName = req.body.prodName
  const unitId = req.body.unitId
  const userId = req.body.userId
  const Amt = req.body.Amt
  const sqlfetchAmt = "UPDATE `prod_amt` SET isValid=0 WHERE prodsId=?"
  const sqltime = "INSERT INTO `timeing_table` (date,time,uid) VALUES(CURRENT_DATE,CURRENT_TIME,?)"
  const Amtsql = "INSERT INTO `prod_amt` (prodsId,Amt,timeId,isValid) VALUES(?,?,?,?)"
  const prodSql = "UPDATE `prods` SET prodName=?,unitId=? WHERE id=?"

  db.query(sqlfetchAmt, [prodId], (err, resultAmt) => {
    if (err) {
      console.log(err);
    }
    else if (resultAmt) {
      db.query(sqltime, [userId], (errT, resultT) => {
        if (errT) {
          console.log(errT);
        }
        else if (resultT) {
          const insertTime = resultT.insertId
          const val = [
            prodId, Amt, insertTime, 1
          ]
          db.query(Amtsql, val, (errA, resultA) => {
            if (errA) {
              console.log(errA);
            }
            else if (resultA) {
              const valProd = [
                prodName, unitId, prodId
              ]
              db.query(prodSql, valProd, (errP, resultP) => {
                if (errP) {
                  res.json({ error: errP })
                }
                else if (resultP) {
                  res.json({ message: 'success' })
                }
              })
            }
          })
        }
      })
    }
  })
 } catch (error) {
  return  res.json({error:error,locate:"/EditProduct"}) 
 }
})
app.post('/searchProd', (req, res) => {
  try {
    const val = [`%${req.body.query}%`]
  const sql = " SELECT * FROM `prods` WHERE prodName LIKE ?"
  db.query(sql, val, (err, result) => {
    if (err) {
      return res.json({ status: "error", err })
    }
    else if (result) {
      return res.json({ status: "success", result })
    }
    console.log(result);

  })
  } catch (error) {
    return  res.json({error:error,locate:"/EditProduct"}) 

  }
})
app.post('/BillProd', (req, res) => {
  try {
    const prodId = req.body.prodId
  const sql = "SELECT a.id as prodId, a.`prodName`,a.`unitId`,b.`Amt` FROM `prods`a,`prod_amt`b WHERE a.id=b.`prodsId` AND b.`isValid`=1 AND a.id=?"
  const val = [prodId]
  db.query(sql,val,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      return res.json({ status: "success", result })
    }
  })
  } catch (error) {
    return  res.json({error:error,locate:"/BillProd"}) 

  }
})
app.post('/saveBill',(req,res)=>{
  console.log();
  
 try {
  const uid=req.body.userId
  const product=req.body.prod
  const total=req.body.tempBill.total
  const balance=req.body.tempBill.balance
  const paidAmt=req.body.tempBill.paidAmt
  const payType=req.body.tempBill.PaymentType
  
  const sql="INSERT INTO `ph_bills` (prodTotal,balance,paid,payType,uid,cDate,cTime) VALUES(?,?,?,?,?,CURRENT_DATE,CURRENT_TIME)"
  const sqlProds="INSERT INTO `ph_bill_details` (billId,prodId,Rate,qty,unitId) VALUES(?,?,?,?,?)"
  let val=[Number(total),Number(balance),Number(paidAmt),Number(payType),Number(uid)]
  db.query(sql,val,(err,result)=>{
    if(err){
     return res.json({error:err})
    }
    else{
      const insertId=result.insertId
      product.forEach(element => {
        const valProds=[result.insertId,element.prodId,element.Amt,element.qty,element.unitId]
        db.query(sqlProds,valProds,(errProd,resultProd)=>{
          if(err){
            return res.json({error:errProd})
          }
          else{
            
          }
        })
      });
      return res.json({success:"success",id:insertId})
    }
  })
 } catch (error) {
  return  res.json({error:error,locate:"/saveBill"}) 

 }
})

app.use(express.static(path.join(__dirname, 'build')));
app.get('*',(req,res)=>{
    res.sendFile(require('path').resolve(__dirname,"build","index.html"))
})

app.listen(6060, () => {
  console.log("server running 6060");
});