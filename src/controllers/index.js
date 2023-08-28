

exports.getResultado = (req,res)=>{

    const { fechaInicio, fechaFin, empleado} = req.query;

    req.getConnection((err,conn)=>{
        if (err) return res.send(err);


        conn.query(`     
        SELECT 
        B.Nombre,
        C.descripcion,
        D.clave,
        COUNT(*) AS Cantidad
    FROM servicioreporte A
    INNER JOIN empleado B ON A.responsable_empleado_id = B.Id
    INNER JOIN servicioprioridad C ON A.prioridad = C.id
    INNER JOIN serviciotiporeporte D ON A.serviciotiporeporte_id = D.id 
    WHERE A.fecha BETWEEN ? AND ?
    AND B.Nombre LIKE ? 
    GROUP BY B.Nombre, D.clave, C.descripcion
    ORDER BY B.Nombre, D.clave`, [fechaInicio, fechaFin, empleado], (err,result)=>{
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

