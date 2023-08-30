

exports.getResultado = (req, res) => {

    const { fechaInicio, fechaFin, empleado } = req.query;

    req.getConnection((err, conn) => {
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
    ORDER BY B.Nombre, D.clave`, [fechaInicio, fechaFin, empleado], (err, result) => {
            if (err) return res.send(err);
            res.send(result);

        })
    }

    )
}

exports.getTotalPri = (req, res) => {

    const { fechaInicio, fechaFin } = req.query;

    req.getConnection((err, conn) => {
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
     
    GROUP BY B.Nombre, D.clave, C.descripcion
    ORDER BY B.Nombre, D.clave`, [fechaInicio, fechaFin], (err, result) => {
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


exports.getGrafica = (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    req.getConnection((err, conn) => {
        if (err) return res.send(err);

        const hechosEnForma = `
        SELECT 
            COUNT(*) AS Cantidad
        FROM servicioreporte A
        INNER JOIN empleado B ON A.responsable_empleado_id = B.Id
        INNER JOIN servicioprioridad C ON A.prioridad = C.id
        INNER JOIN serviciotiporeporte D ON A.serviciotiporeporte_id = D.id 
        WHERE A.fecha BETWEEN ? AND ?  AND
        CONCAT(A.fecha_solucion, ' ', A.horasolucion) <= CONCAT(A.fecha, ' ', A.hora) + INTERVAL C.hrs HOUR`;

        const hechosVencidos = `
        SELECT 
            COUNT(*) AS Cantidad
        FROM servicioreporte A
        INNER JOIN empleado B ON A.responsable_empleado_id = B.Id
        INNER JOIN servicioprioridad C ON A.prioridad = C.id
        INNER JOIN serviciotiporeporte D ON A.serviciotiporeporte_id = D.id 
        WHERE A.fecha BETWEEN ? AND ?  AND
        CONCAT(A.fecha_solucion, ' ', A.horasolucion) >= CONCAT(A.fecha, ' ', A.hora) + INTERVAL C.hrs HOUR`;


        const pendientesVencidos = `
        SELECT 

        COUNT(*) AS cantidad_registros
         FROM servicioreporte A
        INNER JOIN servicioprioridad B ON A.prioridad = B.id
        WHERE fecha BETWEEN '2023-05-31' AND '2023-08-03' AND
        activo = 1
        AND CONCAT(A.fecha, ' ', A.hora) + INTERVAL B.hrs HOUR < now() `;
 

const pendientesNoVencidos = `
SELECT 

COUNT(*) AS cantidad_registros
 FROM servicioreporte A
INNER JOIN servicioprioridad B ON A.prioridad = B.id
WHERE fecha BETWEEN '2023-05-31' AND '2023-08-03' AND
activo = 1
AND CONCAT(A.fecha, ' ', A.hora) + INTERVAL B.hrs HOUR > now()`



        conn.query(
            hechosEnForma,
            [fechaInicio, fechaFin],
            (err, hechosEnFormaResult) => {
                if (err) return res.send(err);

                conn.query(
                    hechosVencidos,
                    [fechaInicio, fechaFin],
                    (err, hechosVencidosResult) => {
                        if (err) return res.send(err);

                        conn.query(
                            pendientesVencidos,
                            [fechaInicio, fechaFin],
                            (err, pendientesVencidosResult) => {
                                if (err) return res.send(err);

                                conn.query(
                                    pendientesNoVencidos,
                                    [fechaInicio, fechaFin],
                                    (err, pendientesNoVencidosResult) => {
                                        if (err) return res.send(err);



                                        
                        const combinedResults = {
                            hechosEnForma: hechosEnFormaResult,
                            hechosVencidos: hechosVencidosResult,
                            pendientesVencidos:pendientesVencidosResult,
                            pendientesNoVencidos:pendientesNoVencidosResult

                        };

                        res.send(combinedResults);
                    }
                );
            }
            );

        }
        );
  

            }
        );
    });
};

