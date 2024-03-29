import { useEffect, useState } from "react";
import { getCentroCosto } from "../services/apiCentroCosto";

export const useGetCentroCosto = () => {
    const [ centroCosto, setCentroCosto ] = useState([]);

    useEffect(() => {
        (async () => {
            const resCentroCosto = await getCentroCosto();
            setCentroCosto(resCentroCosto);
            console.log(resCentroCosto);
        })()
        
    }, [])
    return { centroCosto, setCentroCosto }
}