import { useEffect, useState } from "react";
import { getProyectos } from "../services/apiProyectos";

export const useGetProyectos = () => {
    const [ proyectos, setProyectos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resProyectos = await getProyectos();
            setProyectos(resProyectos);
            console.log(resProyectos);
        })()
    }, [])
    
    return { proyectos, setProyectos }
}