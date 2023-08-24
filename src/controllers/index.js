exports.get = (req,res)=>{
    req.getConnection((err,conn)=>{
        if (err) return res.send(err);


        conn.query(`SELECT 
        Nombre,
        COUNT(*) AS TotalRegistros
        FROM empleado
        INNER JOI`, (err,result)=>{
            if (err) return res.send(err);
            res.send(result);

        })
    }
  
    )
}

exports.getResultado = (req,res)=>{
    req.getConnection((err,conn)=>{
        if (err) return res.send(err);


        conn.query(`     SELECT 
        B.Nombre,
        C.clave,
        COUNT(*) AS Cantidad
    FROM servicioreporte A
    INNER JOIN empleado B ON A.responsable_empleado_id = B.Id
    INNER JOIN serviciotiporeporte C ON A.serviciotiporeporte_id = C.id 
    WHERE A.fecha BETWEEN '2023-04-01' AND '2023-08-05'
    AND B.Nombre LIKE 'Angel Israel'
    AND C.clave LIKE 'M'
    GROUP BY B.Nombre, C.clave
    ORDER BY B.Nombre, C.clave`, (err,result)=>{
            if (err) return res.send(err);
            res.send(result);

        })
    }
  
    )
}

exports.getTabla = (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    req.getConnection((err, conn) => {
        if (err) return res.send(err);

        conn.query(`
            SELECT 
                B.Nombre,
                C.clave,
                COUNT(*) AS Cantidad
            FROM servicioreporte A
            INNER JOIN empleado B ON A.responsable_empleado_id = B.Id
            INNER JOIN serviciotiporeporte C ON A.serviciotiporeporte_id = C.id 
            WHERE A.fecha BETWEEN ? AND ?
            GROUP BY B.Nombre, C.clave
            ORDER BY B.Nombre, C.clave`, [fechaInicio, fechaFin], (err, result) => {
            if (err) return res.send(err);
            res.send(result);
        });
    });
};
