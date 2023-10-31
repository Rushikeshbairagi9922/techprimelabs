const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const Jwt = require("jsonwebtoken");
const jwtKey = "e-user";
const {verify} = require("jsonwebtoken")
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "techprimelabdb",
});

//APIS  ---------------------------
app.get("/projectli", (req, res) => {
  console.log(" i am get");
  const sql = "SELECT * FROM projectListing";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});
app.get(
  `/projectlist/:page`,verifyToken,
  (req, res) => {
    console.log(" i am get new");
    const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid limit 7 offset ${
      (req.params.page - 1) * 7
    } `;

    db.query(sql, [req.params.page], (err, data) => {
      console.log("page " + req.params.page);
      console.log(sql);
      if (err)
        // {start
        // console.log(err);
        return res.json("Error");

      return res.json(data);
    });
  },
  []
);

app.post("/insertuser",(req, res) => {
  console.log("i am post ...");
  const sql = "INSERT INTO `userinfo` (`useremail`,`userpass`) VALUES (?, ?)";
  console.log(req.body.useremail);
  console.log(req.body.userpass);
  const values = [req.body.useremail, req.body.userpass];
  console.log(values);

  db.query(sql, [req.body.useremail, req.body.userpass], (err, data) => {
    if (err) {
      console.log(err);
      return res.send("error");
    } else {
      return res.json(data);
    }
  });
});

app.post("/createproject", verifyToken,(req, res) => {
  console.log("i am post create project...");

  const sql =
    "INSERT INTO `projectlisting` (`proname`, `prostartdate`, `proenddate`, `proreson`, `protype`, `prodivision`, `procategory`, `proproirity`, `prodept`, `prolocation`, `prostatus`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  console.log(req);
  const values = [
    req.body.proname,
    req.body.startdate,
    req.body.endtdate,
    req.body.resid,
    req.body.typeid,
    req.body.divid,
    req.body.cateid,
    req.body.prioid,
    req.body.deptid,
    req.body.locid,
    61,
  ];

  console.log(values);

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.send("error");
    } else {
      return res.json(data);
    }
  });
});

app.get("/userlist",verifyToken, (req, res) => {
  const sql = "SELECT * FROM userinfo";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.post("/Login", (req, res) => {
  const { useremail, userpass } = req.body;

  const query = "SELECT * FROM `userinfo` WHERE `useremail` = ? ";

  db.query(query, [useremail], (err, results) => {
    if (err) {
      res.send({ message: "Database error" });
      return;
    }
    if (results.length === 1) {
      const user = results[0];
      if (userpass === user.userpass) {
        Jwt.sign({ user }, jwtKey, { expiresIn: "3600000" }, (err, token) => {
          res.send({ message: "Login Successful", user, auth: token });
          
        });
      } else {
        res.send({ message: "Password not match" });
      }
    } else {
      res.send({ message: "Invalid credential" });
    }
  });
});
//---------------------------------DROP---------------------------------
// Middleware for verifying JWT token
function verifyToken(req, res, next) {
  let token = req.get("Authorization");
  // let token = req.header('Authorization');
  token = token.slice(7);
  
console.log(token)
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  verify(token, jwtKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized......." });
    }

    next();
  });
}
     
app.get("/dropreson",verifyToken, (req, res) => {
  const sql = "SELECT * FROM projectreason ";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get("/droptype",verifyToken, (req, res) => {
  const sql = "SELECT * FROM  projecttype ";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get("/dropdiv", verifyToken,(req, res) => {
  const sql = "SELECT * FROM  projectdivison ";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});
app.get("/dropcate",verifyToken, (req, res) => {
  const sql = "SELECT * FROM  projectcategory ";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});
app.get("/dropprio",verifyToken, (req, res) => {
  const sql = "SELECT * FROM  projectpriority ";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});
app.get("/dropdept",verifyToken, (req, res) => {
  const sql = "SELECT * FROM  projectdept ";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});


app.get("/droploc",verifyToken, (req, res) => {
  const sql = "SELECT * FROM  projectlocation ";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

//--------------------sort --------------------------------
app.get(`/sortpriority/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid   order by ppr.proprioid limit 7  offset ${
    (req.params.page - 1) * 7
  } order by desc`;
  db.query(sql, [], (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get(`/sortreson/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid order by pr.reasonid limit 7 offset ${
    (req.params.page - 1) * 7
  }`;
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get(`/sorttype/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid order by pt.protypeid limit 7 offset ${
    (req.params.page - 1) * 7
  }`;
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get(`/sortdivision/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid order by pdiv.prodivid limit 7 offset ${
    (req.params.page - 1) * 7
  }`;
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get(`/sortcategory/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid order by pc.procatid limit 7 offset ${
    (req.params.page - 1) * 7
  }`;
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get(`/sortdept/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid order by pdp.prodeptid limit 7 offset ${
    (req.params.page - 1) * 7
  }`;
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

app.get(`/sortlocation/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid order by plo.prolocid limit 7 offset ${
    (req.params.page - 1) * 7
  }`;
  db.query(sql, (err, data) => {
    if (err) return res.json("Error");

    return res.json(data);
  });
});

app.get(`/sortstatus/:page`,verifyToken, (req, res) => {
  const sql = `select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid order by ps.prostusid limit 7 offset ${
    (req.params.page - 1) * 7
  }`;
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});

//--------------------search--------------------
app.get("/search",verifyToken, (req, res) => {
  const sql =
    "select pl.proid, pl.proname,pl.prostartdate,pl.proenddate,pr.reasonName as Reason, pt.protypename as Type, pdiv.prodivname as Division, pc.procatname as category ,ppr.prodprioname as priority, pdp.prodeptname as Department , plo.prolocname as location ,ps.prostusname as status from projectlisting pl join projectreason pr join projecttype pt  join projectdivison pdiv join projectcategory pc join projectpriority ppr join projectdept pdp join projectlocation plo join projectstatus ps on pl.proreson = pr.reasonid and pl.protype = pt.protypeid and pl.prodivision = pdiv.prodivid and pl.procategory = pc.procatid and pl.proproirity = ppr.proprioid and pl.prodept =pdp.prodeptid and pl.prolocation =plo.prolocid and pl.prostatus = ps.prostusid and proname like ? ";
  let Value = "%" + req.body.proname + "%";
  console.log(Value);
  db.query(sql, [Value], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("error");
    } else {
      console.log(result + " api");
      return res.json(result);
    }
  });
});

//-------------------Update status--------------------

app.put("/uprun",verifyToken, (req, res) => {
  const sql = "UPDATE `projectlisting` SET `prostatus` = 62 WHERE `proid` =  ?";

  let Value = req.body.proid;
  console.log(Value);
  db.query(sql, [Value], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("error");
    } else {
      console.log(result);
      return res.json(result);
    }
  });
});

app.put("/upclose",verifyToken, (req, res) => {
  const sql = "UPDATE `projectlisting` SET `prostatus` = 63 WHERE `proid` =  ?";
  let Value = req.body.proid;
  console.log(Value);
  db.query(sql, [Value], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("error");
    } else {
      console.log(result);
      return res.json(result);
    }
  });
});

app.put("/upcancle",verifyToken, (req, res) => {
  const sql = "UPDATE `projectlisting` SET `prostatus` = 64 WHERE `proid` =  ?";
  let Value = req.body.proid;
  console.log(Value);
  db.query(sql, [Value], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("error");
    } else {
      console.log(result);
      return res.json(result);
    }
  });
});

//--------------------------------count--------------------------------

app.get("/counter",verifyToken, (req, res) => {
  const sql =
    "SELECT COUNT(*) AS totalProject, SUM(CASE WHEN prostatus = 63 THEN 1 ELSE 0 END) AS Closed, SUM(CASE WHEN prostatus = 62 THEN 1 ELSE 0 END) AS Running, SUM(CASE WHEN prostatus = 64 THEN 1 ELSE 0 END) AS Cancelled, (SELECT COUNT(*) FROM projectlisting WHERE DATEDIFF(CURDATE(), proenddate) > 1 AND prostatus = 62) AS Clouser FROM projectlisting";
  db.query(sql, (err, data) => {
    if (err)
      // {start
      // console.log(err);
      return res.json("Error");
    // }
    return res.json(data);
  });
});



//----------------------------chart------------------------

let chartotal;
let charob;
app.get("/chart",verifyToken, (req, res) => {
  const sql =
    "SELECT  COUNT(*) AS charttotal,COUNT(CASE WHEN pl.prostatus = 63 THEN 1 ELSE NULL END) AS chartclose FROM projectlisting pl JOIN projectdept pd ON pl.prodept = pd.prodeptid WHERE pd.prodeptid BETWEEN 51 AND 56 GROUP BY pd.prodeptid ORDER BY pd.prodeptid";
  // console.log(req.data)
  db.query(sql, (err, data) => {
    if (err) return res.json("Error");

    const chartsClosed = data.map((item) => item.chartclose);
    const chartsTotal = data.map((item) => item.charttotal);

    const charobj = {
      charttotal: chartsTotal,
      chartclose: chartsClosed,
    };
    return res.json(charobj);
  });
});

app.listen(8081, () => {
  console.log("listening");
});
