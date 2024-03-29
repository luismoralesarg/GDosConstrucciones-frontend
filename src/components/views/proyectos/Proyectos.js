import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useGetProyectos } from '../../../hooks/useProyectos';
import { useGetEgresos } from '../../../hooks/useEgresos';
import { useGetIngresos } from '../../../hooks/useIngresos';

import './Proyectos.css';

const Proyectos = () => {
    const fecha = new Date().toISOString();
    const { proyectos } = useGetProyectos();
    const { egresos } = useGetEgresos();
    const { ingresos } = useGetIngresos();
    const [totales, setTotales] = useState({
        egresos: 0,
        ingresos: 0,
        costos: 0,
        ventas: 0
    });
    const [totalesUN, setTotalesUN] = useState({
        PPEgreso: 0,
        PPIngreso: 0,
        DEgreso: 0,
        DIngreso: 0,
        MEgreso: 0,
        MIngreso: 0
    })

    const egresosProyecto = (id_proyecto) => {
        let auxEgresosProyecto = 0;

        egresos.forEach(egreso => {
            if (egreso.id_proyecto == id_proyecto) {
                auxEgresosProyecto += parseFloat(egreso.valor_pago);
            }
        })

        return (auxEgresosProyecto)
    }

    const ingresosProyecto = (id_proyecto) => {
        let auxIngresosProyecto = 0;

        ingresos.map(ingreso => {
            if (ingreso.id_proyecto == id_proyecto) {
                auxIngresosProyecto += parseFloat(ingreso.valor_cobro);
            }
        })

        return (auxIngresosProyecto)
    }

    useEffect(() => {
        const resumenContableProyectos = () => {
            let auxTotalCosto = 0;
            let auxTotalVenta = 0;
            let auxTotalEgresos = 0;
            let auxTotalIngresos = 0;
            let auxPPE = 0;
            let auxPPI = 0;
            let auxDE = 0;
            let auxDI = 0;
            let auxME = 0;
            let auxMI = 0;
            
            //Reparto los ingresos y los egresos correspondientes a cada area
            if (proyectos.length > 0) {
                proyectos.forEach(proyecto => {
                    console.log(fecha);
                    console.log(egresos);
                    if (proyecto.id_centro_costo == '2') {
                        auxTotalCosto += parseFloat(proyecto.costo);
                        auxTotalVenta += parseFloat(proyecto.venta);
                    }
                    if (proyecto.id_unidad_negocio == '1') {
                        egresos.forEach(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto ) {
                                if(egreso.fecha_diferido_pago < fecha || egreso.fecha_pago < fecha){
                                    auxPPE += parseFloat(egreso.valor_pago);
                                    auxTotalEgresos += parseFloat(egreso.valor_pago);
                                }
                            }
                        });
                        ingresos.forEach(ingreso => {
                            if(ingreso.id_proyecto == proyecto.id_proyecto){
                                auxPPI += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '2') {
                        egresos.forEach(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto && egreso.fecha_diferido_pago < fecha) {
                                auxDE += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                            }
                        });
                        ingresos.forEach(ingreso => {
                            if(ingreso.id_proyecto == proyecto.id_proyecto){
                                auxDI += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '3') {
                        egresos.forEach(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto && egreso.fecha_diferido_pago < fecha) {
                                auxME += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                            }
                        });
                        ingresos.forEach(ingreso => {
                            if(ingreso.id_proyecto == proyecto.id_proyecto){
                                auxMI += parseFloat(ingreso.valor_cobro);
                            }
                        });
                    }
                })
            } else {
                auxTotalCosto = proyectos.costo;
                auxTotalVenta = proyectos.venta;
            }
    
            /*egresos.forEach(egreso => {
                if (egreso.fecha_diferido_pago < fecha) {
                    auxTotalEgresos += parseFloat(egreso.valor_pago);
                }
            })*/
    
            setTotales({
                costos: auxTotalCosto,
                ventas: auxTotalVenta,
                egresos: auxTotalEgresos,
                ingresos: auxTotalIngresos
            })
            setTotalesUN({
                PPEgreso: auxPPE,
                PPIngreso: auxPPI,
                DEgreso: auxDE,
                DIngreso: auxDI,
                MEgreso: auxME,
                MIngreso: auxMI
            })
        }
        resumenContableProyectos();
        //eslint-disable-next-line
    }, [proyectos, egresos])

    return (<>
        <div>
            <Row className="resumenTotales">
                <OverlayTrigger placement="bottom" overlay={
                    <Tooltip>
                        <p>PP: {totalesUN.PPEgreso}</p>
                        <p>D: {totalesUN.DEgreso}</p>
                        <p>M: {totalesUN.MEgreso}</p>
                    </Tooltip>
                }>
                    <Col xs={6} md={3} className="resumenTotal">
                        <h6>Egresos: {totales.egresos}</h6>
                    </Col>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={
                    <Tooltip>
                        <p>PP: {totalesUN.PPIngreso}</p>
                        <p>D: {totalesUN.DIngreso}</p>
                        <p>M: {totalesUN.MIngreso}</p>
                    </Tooltip>
                }>
                    <Col xs={6} md={3} className="resumenTotal">
                        <h6>Ingresos: {totales.ingresos}</h6>
                    </Col>
                </OverlayTrigger>
                <Col xs={6} md={3} className="resumenTotal">
                    <h6>Costos: {totales.costos}</h6>
                </Col>
                <Col xs={6} md={3} className="resumenTotal">
                    <h6>Venta: {totales.ventas}</h6>
                </Col>
            </Row>
            <Row>
                <Accordion>
                    {
                        proyectos.length > 0 ?
                            proyectos.map(proyecto => (
                                <Col key={proyecto.id_proyecto}>
                                    <Accordion.Item eventKey={proyecto.id_proyecto}>
                                        <Accordion.Header> {proyecto.id_proyecto} </Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <Col xs={12} md={6}><p> Valor de venta: {proyecto.venta}</p></Col>
                                                <Col xs={12} md={6}><p> Valor de costo: {proyecto.costo}</p></Col>
                                                <Col xs={12} md={6}><p> Egresos: {egresosProyecto(proyecto.id_proyecto)} </p></Col>
                                                <Col xs={12} md={6}><p> Ingresos: {ingresosProyecto(proyecto.id_proyecto)} </p></Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Col>
                            ))
                            : <Col>
                                <h6>No existen proyectos</h6>
                                <p>Agregar icono de alerta</p>
                            </Col>
                    }
                </Accordion>
            </Row>
        </div>
    </>)
}

export default Proyectos;