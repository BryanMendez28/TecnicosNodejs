

exports.getResultado = (req, res) => {

    const { fechaInicio, fechaFin, empleado } = req.query;

    req.getConnection((err, conn) => {
        if (err) return res.send(err);

        conn.query(`     
        SELECT 
        B.Nombre,
        C.descripcion,
        D.clave,
        C.hrs,
        COUNT(*) AS Cantidad
    FROM servicioreporte A
    LEFT JOIN empleado B ON A.responsable_empleado_id = B.Id
    LEFT JOIN servicioprioridad C ON A.prioridad = C.id
    LEFT JOIN serviciotiporeporte D ON A.serviciotiporeporte_id = D.id 
    WHERE A.fecha_solucion BETWEEN ? AND ?
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
        C.hrs,
        COUNT(*) AS Cantidad
    FROM servicioreporte A
    LEFT JOIN empleado B ON A.responsable_empleado_id = B.Id
    LEFT JOIN servicioprioridad C ON A.prioridad = C.id
    LEFT JOIN serviciotiporeporte D ON A.serviciotiporeporte_id = D.id 
    WHERE A.fecha_solucion BETWEEN ? AND ?
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
            LEFT JOIN empleado B ON A.responsable_empleado_id = B.Id
            LEFT JOIN serviciotiporeporte C ON A.serviciotiporeporte_id = C.id 
            WHERE A.fecha_solucion BETWEEN ? AND ?
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
        LEFT JOIN empleado B ON A.responsable_empleado_id = B.Id
        LEFT JOIN servicioprioridad C ON A.prioridad = C.id
        LEFT JOIN serviciotiporeporte D ON A.serviciotiporeporte_id = D.id 
        WHERE A.fecha_solucion BETWEEN ? AND ?  AND
        D.clave IS NOT NULL AND
        CONCAT(A.fecha_solucion, ' ', A.horasolucion) <= CONCAT(A.fecha, ' ', A.hora) + INTERVAL C.hrs HOUR`;

        const hechosVencidos = `
        SELECT 
            COUNT(*) AS Cantidad
        FROM servicioreporte A
         LEFT JOIN empleado B ON A.responsable_empleado_id = B.Id
        LEFT JOIN servicioprioridad C ON A.prioridad = C.id
        LEFT JOIN serviciotiporeporte D ON A.serviciotiporeporte_id = D.id 
        WHERE A.fecha_solucion BETWEEN ? AND ?  AND
        D.clave IS NOT NULL AND
        CONCAT(A.fecha_solucion, ' ', A.horasolucion) >= CONCAT(A.fecha, ' ', A.hora) + INTERVAL C.hrs HOUR`;

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

                        const combinedResults = {
                            hechosEnForma: hechosEnFormaResult,
                            hechosVencidos: hechosVencidosResult,
                           
                        };

                        res.send(combinedResults);
                    }
                );
            }
            );
        }
        );
            }
 
            exports.getGraficaPastel = (req, res) => {
               
            
                req.getConnection((err, conn) => {
                    if (err) return res.send(err);
            
                    const porVencer = `
                    SELECT 
                    COUNT(*) AS cantidad_registros_por_vencer
                FROM servicioreporte A
                LEFT JOIN servicioprioridad B ON A.prioridad = B.id
                WHERE activo = 1
                AND (CONCAT(A.fecha, ' ', A.hora) + INTERVAL B.hrs / 2 HOUR) > NOW()
                AND (CONCAT(A.fecha, ' ', A.hora) + INTERVAL B.hrs HOUR) > NOW();`;
            
                    const aTiempo = `
                    SELECT 
                    COUNT(*) AS cantidad_registros_por_vencer
                FROM servicioreporte A
                LEFT JOIN servicioprioridad B ON A.prioridad = B.id
                WHERE activo = 1
                AND (CONCAT(A.fecha, ' ', A.hora) + INTERVAL B.hrs / 2 HOUR) <= NOW()
                AND (CONCAT(A.fecha, ' ', A.hora) + INTERVAL B.hrs HOUR) > NOW();`;

                const vencido = `
                SELECT 
                COUNT(*) AS cantidad_registros
                         FROM servicioreporte A
                        LEFT JOIN servicioprioridad B ON A.prioridad = B.id
                        WHERE activo = 1
                        AND CONCAT(A.fecha, ' ', A.hora) + INTERVAL B.hrs HOUR < now() ;`;

                    conn.query(
                        porVencer,
                        
                        (err, porVencerResult) => {
                            if (err) return res.send(err);
            
                            conn.query(
                                aTiempo,
                               
                                (err, aTiempoResult) => {
                                    if (err) return res.send(err);

                                    conn.query(
                                        vencido,
                                       
                                        (err, vencidoResult) => {
                                            if (err) return res.send(err);
            
                                    const combinedResults = {
                                        porVencer: porVencerResult,
                                        aTiempo: aTiempoResult,
                                        vencido: vencidoResult
                                    };
                                    res.send(combinedResults);
                                }
                            );
                        }
                        );
                    }
                    );
                })
                        }